import React, { useState } from 'react';
import { SearchFilters } from '../types';

interface SearchFormProps {
  initialFilters?: SearchFilters;
  onSearch: (filters: SearchFilters) => void;
  variant: 'hero' | 'header';
}

export const SearchForm: React.FC<SearchFormProps> = ({ initialFilters, onSearch, variant }) => {
  const [productName, setProductName] = useState(initialFilters?.productName || '');
  const [brand, setBrand] = useState(initialFilters?.brand || '');
  const [color, setColor] = useState(initialFilters?.color || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productName.trim()) {
      onSearch({ productName, brand, color });
    }
  };

  if (variant === 'header') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 w-full max-w-4xl items-center">
         <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <svg className="h-5 w-5 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
               </svg>
            </div>
            <input
              type="text"
              placeholder="Search deals..."
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-orange-50/50 text-brand-text border border-orange-200 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent placeholder-brand-muted/50 transition-all"
            />
         </div>
         <div className="flex gap-2 w-full md:w-auto">
           <input
             type="text"
             placeholder="Brand"
             value={brand}
             onChange={(e) => setBrand(e.target.value)}
             className="flex-1 md:w-28 bg-orange-50/50 text-brand-text border border-orange-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent placeholder-brand-muted/50 text-sm transition-all"
           />
           <input
             type="text"
             placeholder="Color"
             value={color}
             onChange={(e) => setColor(e.target.value)}
             className="flex-1 md:w-28 bg-orange-50/50 text-brand-text border border-orange-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-accent placeholder-brand-muted/50 text-sm transition-all"
           />
           <button 
            type="submit"
            className="bg-brand-accent hover:bg-brand-text text-white px-6 py-2 rounded-full font-bold transition-colors shadow-md hover:shadow-lg"
           >
             Search
           </button>
         </div>
      </form>
    );
  }

  // Hero Variant
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-4 animate-fade-in-up">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-brand-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="What do you want to feast on? (e.g. Air Fryer)"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="block w-full bg-white text-brand-text border-2 border-orange-100 rounded-2xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-brand-accent placeholder-brand-muted/40 shadow-xl transition-all"
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Brand (Optional)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="flex-1 bg-white text-brand-text border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-brand-accent placeholder-brand-muted/40 shadow-sm transition-all"
        />
        <input
          type="text"
          placeholder="Color (Optional)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="flex-1 bg-white text-brand-text border-2 border-orange-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-brand-accent placeholder-brand-muted/40 shadow-sm transition-all"
        />
      </div>

      <button 
        type="submit"
        className="w-full bg-brand-accent text-white hover:bg-brand-text font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 text-xl mt-2 flex items-center justify-center gap-2"
      >
        <span>🥧</span> Find Best Deals
      </button>
    </form>
  );
};