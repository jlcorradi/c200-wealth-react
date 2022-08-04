import { http } from '../Http';

const ENDPOINT = '/api/v1/reporting';

export const ReportingService = {
  rendimentInform: (year) => http.get(`${ENDPOINT}/irpf`, { params: { year } }),
};
