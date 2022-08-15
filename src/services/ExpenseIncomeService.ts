import { http } from "../Http";
import { ExpenseIncomeEntity } from "../types/expense-income";

const ENDPOINT = "/api/v1/expense_incomes";

export const ExpenseIncomeService = {
  query: (page: number, filter: any, order: any) =>
    http.get<Array<ExpenseIncomeEntity>>(ENDPOINT, {
      params: { ...filter, page, order },
    }),
  get: (id: number) => http.get<ExpenseIncomeEntity>(`${ENDPOINT}/${id}`),
  create: (model: ExpenseIncomeEntity) => http.post<ExpenseIncomeEntity>(ENDPOINT, model),
  update: (id: number, model: ExpenseIncomeEntity) =>
    http.put(`${ENDPOINT}/${id}`, model),
  delete: (id: number) => http.delete(`${ENDPOINT}/${id}`),
  quickPay: (id: number) => http.put(`${ENDPOINT}/${id}/quick_payment`),
};

