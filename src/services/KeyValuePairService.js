import { http } from '../Http';

const ENDPOINT = '/api/v1/key_value_pairs';

const KeyValuePairService = {
  list: (type) => http.get(`${ENDPOINT}?type=${type}&description=`),
  listExpenseIncomeCategories: () =>
    http.get(`${ENDPOINT}?type=INCOME_EXPENSE_CATEGORY&description=`),
  listExpenseIncomeCategoriesAsync: async () => {
    let res = await http.get(
      `${ENDPOINT}?type=INCOME_EXPENSE_CATEGORY&description=`
    );
    return res.data;
  },
  add: (type, description) => http.post(ENDPOINT, { type, description }),
  delete: (id) => http.delete(`${ENDPOINT}/${id}`),
};

export default KeyValuePairService;
