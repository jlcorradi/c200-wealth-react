export type BankAccountType = "CHECKING" | "SAVINGS" | "INVESTMENT";

export interface BankAccountEntity {
  id: number;
  number: string;
  description: string;
  active: boolean;
  type: BankAccountType;
}
