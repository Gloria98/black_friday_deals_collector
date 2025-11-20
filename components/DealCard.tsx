import React from 'react';
import { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
  onVisit: (deal: Deal) => void;
  rank: number;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onVisit, rank }) => {
  const isTopDeal = rank === 0;
  
  return (
    <div className={`relative group bg-white rounded-3xl overflow-hidden border-2 border-orange-100 hover:border-brand-accent/50 transition-all duration-300 shadow-sm hover:shadow-2xl ${isTopDeal ? 'ring-4 ring-brand-highlight/30' : ''}`}>
      
      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full font-bold shadow-md transform rotate-3 group-hover:rotate-6 transition-transform ${deal.discountPercentage > 40 ? 'bg-brand-accent text-white' : 'bg-brand-soft text-brand-accent border-2 border-brand-accent'}`}>
          <span className="text-lg leading-none">{deal.discountPercentage}%</span>
          <span className="text-[10px] uppercase leading-none mt-1">OFF</span>
        </div>
      </div>

      {/* Rank Badge */}
      <div className="absolute top-0 left-0 z-10">
        <div className="bg-orange-50 text-brand-muted font-bold text-xs px-4 py-2 rounded-br-2xl border-b border-r border-orange-100 flex items-center gap-1 shadow-sm">
          {isTopDeal ? '🏆 Top Pick' : `#${rank + 1} Choice`}
        </div>
      </div>

      <div className="p-6 flex flex-col h-full">
        
        {/* Header Section with Store Tag */}
        <div className="flex justify-between items-start mb-3 pt-5">
           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-soft text-brand-text text-xs font-bold uppercase tracking-wide shadow-sm border border-orange-100">
              <svg className="w-3 h-3 text-brand-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
              </svg>
              {deal.storeName}
           </span>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-brand-text mb-2 line-clamp-3 leading-snug pr-2">
            {deal.title}
          </h3>
          <p className="text-sm text-brand-muted/80 mb-4 line-clamp-4 font-medium">
            {deal.description}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t-2 border-orange-50 dashed">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {deal.originalPrice && (
                <span className="text-sm text-brand-muted/50 line-through decoration-brand-muted/50 decoration-2">
                  {deal.originalPrice}
                </span>
              )}
              <span className="text-3xl font-bold text-brand-accent">
                {deal.currentPrice}
              </span>
              <span className="text-[10px] text-brand-muted mt-0.5 font-semibold">Prices may vary 🍂</span>
            </div>
            <button 
              onClick={() => onVisit(deal)}
              className="bg-brand-text text-white hover:bg-brand-accent px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              Get Deal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};