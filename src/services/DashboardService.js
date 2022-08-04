import { http } from '../Http';

const ENDPOINT = '/api/v1/dashboard_stats';

const DashboardService = {
  getExpenseIncomeSummary: () =>
    http.get(`${ENDPOINT}/expense_income_summaries`),
  getMonthlyExpenseIncomeSummary: (paymentType) =>
    http.get(`${ENDPOINT}/monthly_expense_income_summary`, {
      params: { paymentType },
    }),
};

export default DashboardService;
