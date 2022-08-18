import { http } from "../Http";
import { BankAccountEntity } from "../types/bank-account";

const ENDPOINT = "/api/v1/bank_accounts";

const BankAccountService = {
  getInvestmentAccounts: () => {
    return http.get<Array<BankAccountEntity>>(`${ENDPOINT}?type=INVESTMENT`);
  },
  getCheckingAccounts: () => {
    return http.get<Array<BankAccountEntity>>(`${ENDPOINT}?type=CHECKING`);
  },
  list: async () => {
    const { data } = await http.get<Array<BankAccountEntity>>(`${ENDPOINT}`);
    return data;
  },
  setDefaultPaier: (id: string) =>
    http.put(`${ENDPOINT}/${id}/default_payment_account`),
};

export default BankAccountService;
