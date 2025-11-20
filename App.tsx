import React, { useState } from 'react';
import { Deal, SearchFilters, ViewState } from './types';
import { searchDeals } from './services/geminiService';
import { SearchForm } from './components/SearchForm';
import { DealCard } from './components/DealCard';
import { RedirectModal } from './components/RedirectModal';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [filters, setFilters] = useState<SearchFilters>({ productName: '', brand: '', color: '' });
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setLoading(true);
    setError(null);
    setView(ViewState.RESULTS);
    setDeals([]); // Clear previous

    try {
      const results = await searchDeals(
        newFilters.productName, 
        newFilters.brand, 
        newFilters.color
      );
      setDeals(results);
      if (results.length === 0) {
        setError("We couldn't find any treats for that search! 🥧 Try something else.");
      }
    } catch (err) {
      setError("Oops! The turkey burned. Failed to fetch deals. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleConfirmRedirect = () => {
    if (selectedDeal && selectedDeal.url) {
      window.open(selectedDeal.url, '_blank', 'noopener,noreferrer');
      setIsModalOpen(false);
      setSelectedDeal(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col font-sans selection:bg-brand-highlight selection:text-brand-text">
      
      {/* Navbar / Header (Only visible in RESULTS view) */}
      {view === ViewState.RESULTS && (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center gap-4">
            <div 
              onClick={() => setView(ViewState.HOME)} 
              className="cursor-pointer font-bold text-2xl tracking-tight flex items-center gap-2 text-brand-accent hover:text-brand-text transition-colors"
            >
              <span>🦃</span>DealHunter
            </div>
            <div className="flex-1 w-full">
              <SearchForm 
                initialFilters={filters} 
                onSearch={handleSearch} 
                variant="header" 
              />
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-10 text-4xl opacity-20 animate-float pointer-events-none hidden lg:block">🍂</div>
        <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float pointer-events-none hidden lg:block" style={{animationDelay: '2s'}}>🍁</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-20 animate-float pointer-events-none hidden lg:block" style={{animationDelay: '1s'}}>🥧</div>

        {/* HOME VIEW */}
        {view === ViewState.HOME && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center relative">
            
            <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
               <div className="mb-10 animate-fade-in">
                  <div className="inline-block py-2 px-4 rounded-full bg-orange-100 text-brand-accent border border-brand-accent/20 text-sm font-bold tracking-wider mb-6 shadow-sm">
                    🍂 THANKSGIVING EDITION 🍂
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-brand-text mb-6 tracking-tight drop-shadow-sm leading-tight">
                    Gobble Up The <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-500">Best Deals!</span>
                  </h1>
                  <p className="text-xl text-brand-muted max-w-2xl mx-auto font-medium">
                    We're stuffing our search engine with the best savings just for you.
                  </p>
               </div>
               
               <SearchForm 
                 initialFilters={filters} 
                 onSearch={handleSearch} 
                 variant="hero" 
               />
            </div>
          </div>
        )}

        {/* RESULTS VIEW */}
        {view === ViewState.RESULTS && (
          <div className="container mx-auto px-4 py-8 z-10">
            
            {/* Stats Bar */}
            {!loading && deals.length > 0 && (
               <div className="mb-8 flex flex-col sm:flex-row items-center justify-between text-sm text-brand-muted bg-white p-4 rounded-2xl shadow-sm border border-orange-100">
                  <p className="font-medium">✨ Found {deals.length} yummy deals for <span className="text-brand-accent font-bold">"{filters.productName}"</span></p>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span>Sort by:</span>
                    <div className="px-3 py-1 bg-orange-50 rounded-lg text-brand-accent font-semibold text-xs border border-orange-100">
                      Biggest Savings 🏷️
                    </div>
                  </div>
               </div>
            )}

            {loading && <LoadingSpinner />}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl shadow-sm border border-orange-100 max-w-2xl mx-auto mt-10">
                <div className="text-6xl mb-4">🦃</div>
                <h2 className="text-2xl font-bold text-brand-text mb-2">Oh, crumbs!</h2>
                <p className="text-brand-muted">{error}</p>
                <button 
                  onClick={() => setView(ViewState.HOME)}
                  className="mt-6 text-brand-accent hover:text-brand-text font-bold underline decoration-wavy decoration-brand-highlight underline-offset-4"
                >
                  Try another search
                </button>
              </div>
            )}

            {!loading && !error && deals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map((deal, index) => (
                  <DealCard 
                    key={deal.id} 
                    deal={deal} 
                    onVisit={handleDealClick}
                    rank={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-100 bg-white py-8 text-center text-brand-muted text-sm mt-auto">
        <div className="container mx-auto px-4">
           <p className="mb-2 flex items-center justify-center gap-2">
             Made with 🧡 and <span className="text-brand-accent font-bold">Google Gemini</span>
           </p>
           <p className="opacity-70">Prices are accurate as of search time. Happy Thanksgiving Shopping!</p>
        </div>
      </footer>

      {/* Modals */}
      <RedirectModal 
        deal={selectedDeal} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmRedirect}
      />

    </div>
  );
};

export default App;