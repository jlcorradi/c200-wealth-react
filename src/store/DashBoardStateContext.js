import React from 'react';
import { ArrayHelper } from '../Helpers';
import DashboardService from '../services/DashboardService';

const DashboardContext = React.createContext();

export const DashboardActions = {
  loadMonthlyExpenseIncomeSummary: () => ({
    action: 'LOAD_MONTHLY_EXPENSE_INCOME',
  }),
  monthlyExpenseIncomeSummaryLoadComplete: ({ expenses, incomes }) => {
    expenses.forEach((ex) => {
      if (!ArrayHelper.findItem(incomes, 'month', ex.month)) {
        incomes.unshift({ month: ex.month, amount: 0 });
      }
    });

    incomes.forEach((inc) => {
      if (!ArrayHelper.findItem(expenses, 'month', inc.month)) {
        expenses.unshift({ month: inc.month, amount: 0 });
      }
    });

    return {
      action: 'LOAD_MONTHLY_EXPENSE_INCOME_COMPLETE',
      payload: { expenses, incomes },
    };
  },
  loadExpenseIncomeSum: () => ({ action: 'LOAD_EXPENSE_INCOME_SUM' }),
  expenseIncomeSumComplete: (data) => ({
    action: 'LOAD_EXPENSE_INCOME_SUM_COMPLETE',
    payload: data,
  }),
};

const initialState = {
  monthlyExpenseIncomeSummary: {
    isLoading: true,
    expenses: [],
    incomes: [],
  },
  expenseIncomeSumIsLoading: true,
  expenseIncomeSum: {
    pendingExpenses: 0,
    totalExpenses: 0,
    pendingIncome: 0,
    totalIncome: 0,
  },
  expenseIncomeList: [],
};

const dashboardReducer = (state, { action, payload }) => {
  switch (action) {
    case 'LOAD_MONTHLY_EXPENSE_INCOME':
      return {
        ...state,
        monthlyExpenseIncomeSummary: {
          ...state.monthlyExpenseIncomeSummary,
          isLoading: false,
        },
      };
    case 'LOAD_MONTHLY_EXPENSE_INCOME_COMPLETE':
      return {
        ...state,
        monthlyExpenseIncomeSummary: {
          ...state.monthlyExpenseIncomeSummary,
          isLoading: false,
          ...payload,
        },
      };

    case 'LOAD_EXPENSE_INCOME_SUM':
      return { ...state, expenseIncomeSumIsLoading: true };

    case 'LOAD_EXPENSE_INCOME_SUM_COMPLETE':
      return {
        ...state,
        expenseIncomeSumIsLoading: false,
        expenseIncomeSum: payload.sum,
        expenseIncomeList: payload.list,
      };

    default:
      return state;
  }
};

export const DashboardContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(dashboardReducer, initialState);

  React.useEffect(() => {
    if (state.monthlyExpenseIncomeSummary.isLoading) {
      Promise.all([
        DashboardService.getMonthlyExpenseIncomeSummary('EXPENSE'),
        DashboardService.getMonthlyExpenseIncomeSummary('INCOME'),
      ]).then(([expensesResponse, incomesResponse]) => {
        dispatch(
          DashboardActions.monthlyExpenseIncomeSummaryLoadComplete({
            expenses: expensesResponse.data,
            incomes: incomesResponse.data,
          })
        );
      });
    }
  }, [
    state.loadExpenseIncomeSum,
    state.monthlyExpenseIncomeSummary.isLoading,
    state.monthlyExpenseIncomeSummary.paymentType,
  ]);

  React.useEffect(() => {
    if (state.expenseIncomeSumIsLoading) {
      DashboardService.getExpenseIncomeSummary().then(({ data }) => {
        dispatch(
          DashboardActions.expenseIncomeSumComplete({
            sum: data,
            list: data.pendingExpensesIncomeList,
          })
        );
      });
    }
  }, [state.expenseIncomeSumIsLoading]);

  return (
    <DashboardContext.Provider value={[state, dispatch]}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => React.useContext(DashboardContext);
