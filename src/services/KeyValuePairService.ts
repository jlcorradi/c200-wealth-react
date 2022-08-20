import { http } from "../Http";
import { KeyValuePair, KeyValuePairType } from "../types/key-value-pair";

const ENDPOINT = "/api/v1/key_value_pairs";

const KeyValuePairService = {
  list: (type: string) =>
    http.get<KeyValuePair>(`${ENDPOINT}?type=${type}&description=`),
  listExpenseIncomeCategories: () =>
    http.get<KeyValuePair[]>(
      `${ENDPOINT}?type=INCOME_EXPENSE_CATEGORY&description=`
    ),
  listExpenseIncomeCategoriesAsync: async () => {
    let res = await http.get<KeyValuePair[]>(
      `${ENDPOINT}?type=INCOME_EXPENSE_CATEGORY&description=`
    );
    return res.data;
  },
  add: (type: KeyValuePairType, description: string) =>
    http.post(ENDPOINT, { type, description }),
  delete: (id: number) => http.delete<void>(`${ENDPOINT}/${id}`),
};

export default KeyValuePairService;
