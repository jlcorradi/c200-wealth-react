export type StockOperationEntity = {
  id?: number;
  bankAccountId: number;
  bankAccountDescription?: string;
  symbol: string;
  operationDate: string;
  operationType: StockOperationType;
  quantity: number;
  price: number;
  total: number;
};

export enum StockOperationType {
  Purchase = "PURCHASE",
  Sell = "SELL",
}
