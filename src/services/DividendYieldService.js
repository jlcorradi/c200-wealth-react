import { http } from '../Http';

const ENDPOINT = '/api/v1/dividend_yields';

const DividendYieldService = {
  query: (params) => http.get(ENDPOINT, { params }),
  create: (model) => http.post(ENDPOINT, model),
  delete: (id) => http.delete(`${ENDPOINT}/${id}`),
  getDashboardData: (dateIni, dateEnd) =>
    http.get(`${ENDPOINT}/dashboard`, { params: { dateIni, dateEnd } }),
  getMonthDys: (month) => http.get(`${ENDPOINT}`, { params: { month } }),
  getMonthlyDys: (ticker, dateIni, dateEnd) =>
    http.get(`${ENDPOINT}/monthly`, { params: { ticker } }),
  get12MonthMatrix: (category) =>
    http.get(`${ENDPOINT}/dy12monmatrix?category=${category.toUpperCase()}`),
};

export default DividendYieldService;
