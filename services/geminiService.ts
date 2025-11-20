import { GoogleGenAI } from "@google/genai";
import { Deal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchDeals = async (
  query: string, 
  brand?: string, 
  color?: string
): Promise<Deal[]> => {
  
  // Explicitly requesting US deals in the query
  const fullQuery = `Black Friday deals in USA for ${brand ? brand + " " : ""}${color ? color + " " : ""}${query}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for speed + grounding capabilities
      contents: fullQuery,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are a specialized shopping assistant for finding Black Friday deals in the United States. 
        Your goal is to find real, currently available deals for the user's request from US-based retailers only (e.g., Amazon US, Best Buy, Walmart, Target, B&H).
        Do not include results from international domains (like .co.uk, .ca, .au) unless they are the global site shipping from the US.
        
        CRITICAL OUTPUT FORMAT RULES:
        You must return the results in a strict custom text block format so I can parse it. 
        Do not use Markdown tables. 
        For each deal found, output a block exactly like this:
        
        [[[START_DEAL]]]
        Title: {Exact product title}
        Store: {Name of the store}
        Price: {Current deal price with currency. EXTRACT EXACT PRICE FROM SNIPPET. Do not guess.}
        OldPrice: {Original price or "N/A"}
        Discount: {Discount percentage as a number only, e.g. 25. If unknown calculate based on prices. If no discount, 0}
        URL: {The URL found in the search results}
        Description: {Short 1 sentence description}
        [[[END_DEAL]]]
        
        Find at least 5-10 top deals.
        Rank them by highest discount percentage first.
        If you cannot find a specific URL in the search grounding, provide the best approximation.
        `
      }
    });

    const text = response.text || "";
    
    // Extract Grounding URLs (The Source of Truth)
    // We use these to verify the links generated in the text response
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const validUrls: string[] = groundingChunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: string) => typeof uri === 'string' && uri.length > 0);

    // Parse the custom format
    const deals: Deal[] = [];
    const dealBlocks = text.split('[[[START_DEAL]]]');

    dealBlocks.forEach((block, index) => {
      if (!block.includes('[[[END_DEAL]]]')) return;

      const content = block.split('[[[END_DEAL]]]')[0];
      
      const extract = (key: string) => {
        const regex = new RegExp(`${key}:\\s*(.*)`);
        const match = content.match(regex);
        return match ? match[1].trim() : "";
      };

      const title = extract('Title');
      const storeName = extract('Store');
      const currentPrice = extract('Price');
      const originalPrice = extract('OldPrice');
      let discountStr = extract('Discount');
      const rawUrl = extract('URL');
      const description = extract('Description');

      // --- LINK VERIFICATION LOGIC ---
      // This step ensures we don't send users to broken URLs hallucinated by the LLM.
      let finalUrl = rawUrl;
      let isVerified = false;

      // 1. Exact match: The generated URL exists in the grounding data
      if (validUrls.includes(rawUrl)) {
        isVerified = true;
      }

      // 2. Fuzzy match: The generated URL is part of a valid grounding URL (or vice versa)
      if (!isVerified) {
        const fuzzyMatch = validUrls.find(v => v.includes(rawUrl) || rawUrl.includes(v));
        if (fuzzyMatch) {
          finalUrl = fuzzyMatch;
          isVerified = true;
        }
      }

      // 3. Store/Domain match: Find a valid URL that likely belongs to the same store/context
      if (!isVerified && validUrls.length > 0) {
         const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
         const targetStore = normalize(storeName);
         
         // Look for a grounding URL that contains the store name
         const bestGuess = validUrls.find(v => normalize(v).includes(targetStore));
         if (bestGuess) {
             finalUrl = bestGuess;
             isVerified = true;
         }
      }

      // 4. Ultimate Fallback: Google Search Link
      // If we absolutely cannot verify the link against real data, we generate a Google Search link.
      // This ensures the user never hits a 404 page and can always find the deal.
      if (!isVerified) {
        const searchBuffer = `${title} ${storeName} deal`;
        finalUrl = `https://www.google.com/search?q=${encodeURIComponent(searchBuffer)}`;
      }
      // -------------------------------

      // Clean up discount
      let discountPercentage = parseInt(discountStr.replace(/[^0-9]/g, ''), 10);
      if (isNaN(discountPercentage)) discountPercentage = 0;

      if (title && currentPrice) {
        deals.push({
          id: `deal-${index}-${Date.now()}`,
          title,
          storeName,
          currentPrice,
          originalPrice: originalPrice === "N/A" ? "" : originalPrice,
          discountPercentage,
          url: finalUrl,
          description
        });
      }
    });

    // Sort by discount descending
    return deals.sort((a, b) => b.discountPercentage - a.discountPercentage);

  } catch (error) {
    console.error("Error fetching deals:", error);
    throw error;
  }
};