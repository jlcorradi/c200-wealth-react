import { http } from "../Http";
import { IPage, Pageable } from "../types/page";

const ENDPOINT = "/api/v1/query";

const QueryService = {
  query: async <T>(
    entity: string,
    filter: any,
    order: string,
    page?: number,
    pageSize?: number
  ) => {
    return (await http.get)<IPage<T>>(`${ENDPOINT}/${entity}`, {
      params: {
        q: QueryService.resolveQ(filter),
        order,
        pageSize: pageSize ?? 3000,
        page: page ?? 0,
      },
    });
  },
  sum: async (entity: string, field: string, filter: any) => {
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
