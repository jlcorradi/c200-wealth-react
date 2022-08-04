import { http } from "../Http";

const ENDPOINT = "/api/v1/query";

const QueryService = {
  query: (
    entity: string,
    filter: any,
    order: string,
    page: number,
    pageSize: number
  ) => {
    return http.get<any>(`${ENDPOINT}/${entity}`, {
      params: { q: QueryService.resolveQ(filter), order, pageSize, page },
    });
  },
  sum: (entity: string, field: string, filter: any) => {
    return http.get<number>(`${ENDPOINT}/${entity}/sum`, {
      params: { field, q: QueryService.resolveQ(filter) },
    });
  },
  resolveQ: (filter: any) =>
    Object.keys(filter)
      .map((field) => {
        let value = filter[field];
        if (!Array.isArray(value) || value.length === 1) {
          return `${field}:${value}`;
        } else {
          return `${field}:(${value.join(",")})`;
        }
      })
      .join(";"),
};

export default QueryService;
