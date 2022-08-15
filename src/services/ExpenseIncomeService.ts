import { http } from "../Http";
import { ExpenseIncome } from "../types/expense-income";

const ENDPOINT = "/api/v1/expense_incomes";

export const ExpenseIncomeService = {
  query: (page: number, filter: any, order: any) =>
    http.get<Array<ExpenseIncome>>(ENDPOINT, {
      params: { ...filter, page, order },
    }),
  get: (id: number) => http.get<ExpenseIncome>(`${ENDPOINT}/${id}`),
  create: (model: ExpenseIncome) => http.post<ExpenseIncome>(ENDPOINT, model),
  update: (id: number, model: ExpenseIncome) =>
    http.put(`${ENDPOINT}/${id}`, model),
  delete: (id: number) => http.delete(`${ENDPOINT}/${id}`),
  quickPay: (id: number) => http.put(`${ENDPOINT}/${id}/quick_payment`),
};

