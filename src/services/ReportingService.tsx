import { http } from "../Http";

const ENDPOINT = "/api/v1/reporting";

export const ReportingService = {
  rendimentInform: async (year: number) =>
    http.get<any>(`${ENDPOINT}/irpf`, { params: { year } }),
};
