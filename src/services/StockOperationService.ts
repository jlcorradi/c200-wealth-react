import { http } from "../Http";
import { StockOperationEntity } from "../types/stock";

const ENDPOINT = "/api/v1/stock_operations";

const StockOperationService = {
  create: (op: StockOperationEntity) =>
    http.post<StockOperationEntity>(ENDPOINT, op),
  delete: (id: number) => http.delete(`${ENDPOINT}/${id}`),
  query: (page: number, filter: any, order: string) =>
    http.get(ENDPOINT, { params: { ...filter, page, order } }),
};

export default StockOperationService;
