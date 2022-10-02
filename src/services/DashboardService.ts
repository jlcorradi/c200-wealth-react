import { http } from "../Http";
import { ExpenseIncomeSummary, PaymentType } from "../types/expense-income";
import { EXPENSE_INCOME_ENDPOINT } from "./ExpenseIncomeService";

export interface ExpenseIncomeSummaryItem {
  month: string;
  expenseAmount: number;
  incomeAmount: number;
}

export class DashboardService {
  public getPendingOrWithinTimeWindow(paymentType: PaymentType) {
    return http.get<ExpenseIncomeSummary>(
      `${EXPENSE_INCOME_ENDPOINT}/pending_by_period?type=${paymentType}`
    );
  }

  public getMonthlyExpenseIncomeSummary() {
    return http.get<ExpenseIncomeSummaryItem[]>(
      `${EXPENSE_INCOME_ENDPOINT}/monthly_expense_income_summary`
    );
  }
}
