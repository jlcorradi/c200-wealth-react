import { http } from "../Http";

const ENDPOINT = "/api/v1/dividend_yields";

const DividendYieldService = {
  query: (params: any) => http.get<Array<any>>(ENDPOINT, { params }),
  create: (model: any) => http.post<any>(ENDPOINT, model),
  delete: (id: any) => http.delete(`${ENDPOINT}/${id}`),
  getDashboardData: (dateIni: string, dateEnd: string) =>
    http.get<any>(`${ENDPOINT}/dashboard`, { params: { dateIni, dateEnd } }),
  getMonthDys: (month: string) =>
    http.get(`${ENDPOINT}`, { params: { month } }),
  getMonthlyDys: (ticker: string) =>
    http.get<any>(`${ENDPOINT}/monthly`, { params: { ticker } }),
  get12MonthMatrix: (category: string) =>
    http.get<any>(
      `${ENDPOINT}/dy12monmatrix?category=${category.toUpperCase()}`
    ),
};

export default DividendYieldService;
