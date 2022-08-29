export interface IPortfolioEntity {
  date: string;
  bankAccountId: number;
  bankAccountDescription: string;
  symbol: string;
  description: string;
  category: string;
  sectorId: number;
  sectorDescription: string;
  quantity: number;
  averagePrice: number;
  adjustedAveragePrice: number;
  totalPrice: number;
  lastPrice: number;
  currentAmount: number;
  thumbImage?: string;
}

export interface IPortfolio {
  totalCurrent: number;
  totalCurrentFII: number;
  totalCurrentStocks: number;
  totalInvested: number;
  totalInvestedFII: number;
  totalInvestedStocks: number;

  fiis: Array<IPortfolioEntity>;
  stocks: Array<IPortfolioEntity>;
}

export interface PortfolioTemplateEntity {
  id: number;
  symbol: string;
  weight: number;
}
