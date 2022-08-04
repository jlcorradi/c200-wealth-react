import { http } from '../Http';

const ENDPOINT = '/api/v1/query';

const QueryService = {
  query: (entity, filter, order, page, pageSize) => {
    return http.get(`${ENDPOINT}/${entity}`, {
      params: { q: QueryService.resolveQ(filter), order, pageSize, page },
    });
  },
  sum: (entity, field, filter) => {
    return http.get(`${ENDPOINT}/${entity}/sum`, {
      params: { field, q: QueryService.resolveQ(filter) },
    });
  },
  resolveQ: (filter) =>
    Object.keys(filter)
      .map((field) => {
        let value = filter[field];
        if (!Array.isArray(value) || value.length === 1) {
          return `${field}:${value}`;
        } else {
          return `${field}:(${value.join(',')})`;
        }
      })
      .join(';'),
};

export default QueryService;
