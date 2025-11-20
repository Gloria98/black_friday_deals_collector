export interface Deal {
  id: string;
  title: string;
  storeName: string;
  currentPrice: string;
  originalPrice: string;
  discountPercentage: number;
  url: string;
  description: string;
  isSponsored?: boolean;
}

export interface SearchFilters {
  productName: string;
  brand: string;
  color: string;
}

export enum ViewState {
  HOME = 'HOME',
  RESULTS = 'RESULTS',
}
