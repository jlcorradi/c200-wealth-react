import {http} from '../Http';

const ENDPOINT = '/api/v1/stock-watch-list';

const WatchListService = {
  delete: (id) => http.delete(`${ENDPOINT}/${id}`),
  save: (item) => item.id ? http.put(`${ENDPOINT}/${item.id}`, item) : http.post(ENDPOINT, item),
};

export default WatchListService;
