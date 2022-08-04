import {http} from '../Http';

const ENDPOINT = '/api/v1/expense_incomes';

const ExpenseIncomeService = {
  query: (page, filter, order) =>
    http.get(ENDPOINT, {params: {...filter, page, order}}),
  get: (id) => http.get(`${ENDPOINT}/${id}`),
  create: (model) => http.post(ENDPOINT, model),
  update: (id, model) => http.put(`${ENDPOINT}/${id}`, model),
  delete: (id) => http.delete(`${ENDPOINT}/${id}`),
  quickPay: (id) => http.put(`${ENDPOINT}/${id}/quick_payment`),
};
export default ExpenseIncomeService;
