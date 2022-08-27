import { http } from "../Http";
import { ExpenseIncomeEntity } from "../types/expense-income";
import { IPage } from "../types/page";

const ENDPOINT = "/api/v1/expense_incomes";

export const ExpenseIncomeService = {
  query: async (page: number, filter: any, order: any) => {
    return await http.get<IPage<ExpenseIncomeEntity>>(ENDPOINT, {
      params: { ...filter, page, order },
    });
  },
  get: async (id: number) => {
    return await http.get<ExpenseIncomeEntity>(`${ENDPOINT}/${id}`);
  },
  create: async (model: ExpenseIncomeEntity) => {
    return await http.post<ExpenseIncomeEntity>(ENDPOINT, model);
  },
  update: async (id: number, model: ExpenseIncomeEntity) => {
    return await http.put(`${ENDPOINT}/${id}`, model);
  },
  delete: async (id: number) => {
    return await http.delete(`${ENDPOINT}/${id}`);
  },
  quickPay: async (id: number) => {
    return await http.put(`${ENDPOINT}/${id}/quick_payment`);
  },
};
