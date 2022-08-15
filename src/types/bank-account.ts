import { type } from "os";

export type BankAccountType = "CHECKING" | "SAVINGS" | "INVESTMENT";

export type BankAccountEntity = {
  id: number;
  number: string;
  description: string;
  active: boolean;
  type: BankAccountType;
};
