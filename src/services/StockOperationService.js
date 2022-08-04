import { http } from "../Http";

const ENDPOINT = "/api/v1/stock_operations";

const StockOperationService = {
    create: (op) => http.post(ENDPOINT, op),
    delete: (id) => http.delete(`${ENDPOINT}/${id}`),
    query: (page, filter, order) => http.get(ENDPOINT, { params: { ...filter, page, order } })
}

export default StockOperationService;