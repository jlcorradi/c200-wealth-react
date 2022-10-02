import React, { PropsWithChildren } from "react";
import {
  DashboardService,
  ExpenseIncomeSummaryItem,
} from "../services/DashboardService";
import { ExpenseIncomeSummary, PaymentType } from "../types/expense-income";

const useDashboard = () => {
  const [reloadPending, setReloadPending] = React.useState<boolean>(true);
  
  const [monthlyExpenseIncomeSummary, setMonthlyExpenseIncomeSummary] =
    React.useState<ExpenseIncomeSummaryItem[]>([]);
  
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
  
    const [pendingExpenses, setPendingExpenses] =
    React.useState<ExpenseIncomeSummary>({
      pendingAmount: 0,
      totalAmount: 0,
      list: [],
    });
  
    const [pendingIncomes, setPendingIncomes] =
    React.useState<ExpenseIncomeSummary>({
      pendingAmount: 0,
      totalAmount: 0,
      list: [],
    });
  const dashboardService = new DashboardService();

  React.useEffect(() => {
    if (!reloadPending) {
      return;
    }

    setIsLoading(true);

    Promise.all([
      dashboardService.getMonthlyExpenseIncomeSummary(),
      dashboardService.getPendingOrWithinTimeWindow(PaymentType.Expense),
      dashboardService.getPendingOrWithinTimeWindow(PaymentType.Income),
    ])
      .then(([monSum, expenses, incomes]) => {
        setMonthlyExpenseIncomeSummary(monSum.data);
        setPendingExpenses(expenses.data);
        setPendingIncomes(incomes.data);
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
    state: {
      monthlyExpenseIncomeSummary,
      pendingExpenses,
      pendingIncomes,
      isLoading,
    },
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
