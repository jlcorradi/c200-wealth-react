import { http } from "../Http";
import { StockWatchListEntity } from "../types/stock";

const ENDPOINT = "/api/v1/stock-watch-list";

const WatchListService = {
  delete: async (id: number) => {
    return await http.delete<void>(`${ENDPOINT}/${id}`);
  },
  save: async (item: StockWatchListEntity) => {
    return item.id
      ? await http.put<StockWatchListEntity>(`${ENDPOINT}/${item.id}`, item)
      : await http.post<StockWatchListEntity>(ENDPOINT, item);
  },
};

export default WatchListService;
