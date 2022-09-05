import React, { PropsWithChildren } from "react";
import {
  DashboardService,
  ExpenseIncomeSummaryItem,
} from "../services/DashboardService";
import { ExpenseIncomeSummary } from "../types/expense-income";

const useDashboard = () => {
  const [reloadPending, setReloadPending] = React.useState<boolean>(true);
  const [monthlyExpenseIncomeSummary, setMonthlyExpenseIncomeSummary] =
    React.useState<ExpenseIncomeSummaryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [expenseIncomeSum, setExpenseIncomeSum] =
    React.useState<ExpenseIncomeSummary>({
      pendingExpenses: 0,
      pendingIncome: 0,
      totalExpenses: 0,
      totalIncome: 0,
      pendingExpensesIncomeList: [],
    });
  const dashboardService = new DashboardService();

  React.useEffect(() => {
    if (!reloadPending) {
      return;
    }

    setIsLoading(true);

    Promise.all([
      dashboardService.getMonthlyExpenseIncomeSummary(),
      dashboardService.getExpenseIncomeSummary(),
    ])
      .then(([monSum, genSum]) => {
        setMonthlyExpenseIncomeSummary(monSum.data);
        setExpenseIncomeSum(genSum.data);
      })
      .finally(() => {
        setIsLoading(false);
        setReloadPending(false);
      });
  }, [reloadPending]);

  function markToReload() {
    setReloadPending(true);
  }

  return {
    state: { monthlyExpenseIncomeSummary, expenseIncomeSum, isLoading },
    actions: { markToReload },
  };
};

export type IDashboardContext = ReturnType<typeof useDashboard>;

const DashboardContext = React.createContext<IDashboardContext>(
  {} as unknown as IDashboardContext
);

export const DashboardContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const ctx = useDashboard();
  return (
    <DashboardContext.Provider value={ctx}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => React.useContext(DashboardContext);
