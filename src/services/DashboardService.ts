import { http } from "../Http";
import { ExpenseIncomeSummary } from "../types/expense-income";

const ENDPOINT = "/api/v1/dashboard_stats";

export interface ExpenseIncomeSummaryItem {
  month: string;
  expenseAmount: number;
  incomeAmount: number;
}

export class DashboardService {
  public getExpenseIncomeSummary() {
    return http.get<ExpenseIncomeSummary>(
      `${ENDPOINT}/expense_income_summaries`
    );
  }

  public getMonthlyExpenseIncomeSummary() {
    return http.get<ExpenseIncomeSummaryItem[]>(
      `${ENDPOINT}/monthly_expense_income_summary`
    );
  }
}
