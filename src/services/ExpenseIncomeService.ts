import { http } from "../Http";
import { ExpenseIncomeEntity } from "../types/expense-income";
import { IPage } from "../types/page";

export const EXPENSE_INCOME_ENDPOINT = "/api/v1/expense_incomes";

export const ExpenseIncomeService = {
  query: async (page: number, filter: any, order: any) => {
    return await http.get<IPage<ExpenseIncomeEntity>>(EXPENSE_INCOME_ENDPOINT, {
      params: { ...filter, page, order },
    });
  },
  get: async (id: number) => {
    return await http.get<ExpenseIncomeEntity>(`${EXPENSE_INCOME_ENDPOINT}/${id}`);
  },
  create: async (model: ExpenseIncomeEntity) => {
    return await http.post<ExpenseIncomeEntity>(EXPENSE_INCOME_ENDPOINT, model);
  },
  update: async (id: number, model: ExpenseIncomeEntity) => {
    return await http.put(`${EXPENSE_INCOME_ENDPOINT}/${id}`, model);
  },
  delete: async (id: number) => {
    return await http.delete(`${EXPENSE_INCOME_ENDPOINT}/${id}`);
  },
  quickPay: async (id: number) => {
    return await http.put(`${EXPENSE_INCOME_ENDPOINT}/${id}/quick_payment`);
  },
};
