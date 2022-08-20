export type DividendYieldEntity = {
  id?: number;
  bankAccountId: number;
  bankAccountDescription?: string;
  symbol: string;
  paymentDate: string;
  yieldType: string;
  quantity: number;
  amount: number;
};

export enum DividendYieldType {
  Rendiment="RENDIMENT",
  JCP="JCP",
  DividendYield = "DIVIDEND_YIELD"
}
