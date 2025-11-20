import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-6 p-12">
    <div className="relative w-20 h-20">
      <div className="absolute top-0 left-0 w-full h-full border-8 border-orange-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-8 border-t-brand-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">🦃</div>
    </div>
    <p className="text-brand-muted font-medium animate-pulse text-lg">Hunting for the best turkeys... I mean deals! 🍂</p>
  </div>
);