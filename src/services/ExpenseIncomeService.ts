import { http } from "../Http";
import { IExpenseIncome } from "../types/expense-income";

const ENDPOINT = "/api/v1/expense_incomes";

export const ExpenseIncomeService = {
  query: (page: number, filter: any, order: any) =>
    http.get<Array<IExpenseIncome>>(ENDPOINT, {
      params: { ...filter, page, order },
    }),
  get: (id: number) => http.get<IExpenseIncome>(`${ENDPOINT}/${id}`),
  create: (model: IExpenseIncome) => http.post<IExpenseIncome>(ENDPOINT, model),
  update: (id: number, model: IExpenseIncome) =>
    http.put(`${ENDPOINT}/${id}`, model),
  delete: (id: number) => http.delete(`${ENDPOINT}/${id}`),
  quickPay: (id: number) => http.put(`${ENDPOINT}/${id}/quick_payment`),
};

