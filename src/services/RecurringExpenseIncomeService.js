import { http } from '../Http';

const ENDPOINT = '/api/v1/recurring_expense_income';

const RecurringExpenseIncomeService = {
  list: () => http.get(ENDPOINT),
  delete: (id) => http.delete(`${ENDPOINT}/${id}`),
  create: (model) => http.post(ENDPOINT, model),
  get: (id) => http.get(`${ENDPOINT}/${id}`),
  save: (item) =>
    item.id
      ? http.put(`${ENDPOINT}/${item.id}`, item)
      : http.post(ENDPOINT, item),
  trigger: () => http.put(`${ENDPOINT}/trigger_generation`)
};

export default RecurringExpenseIncomeService;
