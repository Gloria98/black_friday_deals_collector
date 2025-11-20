import React from 'react';
import { Deal } from '../types';

interface RedirectModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RedirectModal: React.FC<RedirectModalProps> = ({ deal, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !deal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-orange-100/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white border-2 border-orange-100 rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all scale-100">
        <div className="absolute -top-6 -right-6 text-6xl opacity-20 rotate-12 pointer-events-none">🦃</div>
        
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-orange-100 shadow-inner">
            <span className="text-4xl animate-bounce">🏃💨</span>
          </div>
          <h3 className="text-2xl font-bold text-brand-text mb-2">Catch that deal!</h3>
          <p className="text-brand-muted mb-6 font-medium">
            We are sending you over to <span className="font-bold text-brand-accent underline decoration-wavy">{deal.storeName}</span> to grab this offer.
          </p>
          
          <div className="bg-brand-bg rounded-2xl p-5 mb-8 text-left border border-orange-100 shadow-inner">
            <p className="text-sm text-brand-muted font-bold truncate mb-1">{deal.title}</p>
            <div className="flex justify-between items-center">
               <p className="text-brand-accent font-black text-xl">{deal.currentPrice}</p>
               <span className="text-xs bg-white px-2 py-1 rounded border border-orange-200 text-brand-muted">Verified at {deal.storeName}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white hover:bg-orange-50 text-brand-muted border-2 border-orange-100 rounded-xl font-bold transition-colors"
            >
              Stay here
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-brand-accent hover:bg-brand-text text-white rounded-xl font-bold transition-colors shadow-lg hover:shadow-xl"
            >
              Go to Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};