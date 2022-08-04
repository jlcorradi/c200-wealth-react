import React from "react";
// @ts-ignore
import ExpensesPerCategory from "../components/ExpensesPerCategory";
// @ts-ignore
import PendingExpenseIncome from "../components/PendingExpenseIncome";
import { NumberHelper } from "../Helpers";
// @ts-ignore
import { useGlobalState } from "../store/GlobalStateContext";
// @ts-ignore
import NotificationWidget from "../components/NotificationWidget";
// @ts-ignore
import {
  DashboardActions,
  useDashboardContext,
  //@ts-ignore
} from "../store/DashBoardStateContext";
import ReactApexChart from "react-apexcharts";
// @ts-ignore
import LoaderAndEmptyWrapper from "../components/LoaderAndEmptyWrapper";
import { Indicator } from "../components/Indicator";

export const DashboardView: React.FC<{}> = () => {
  const [{ monthlyExpenseIncomeSummary, expenseIncomeSum }, dispatch] =
    useDashboardContext();

  const [{ notifications }] = useGlobalState();

  React.useEffect(() => {
    dispatch(DashboardActions.loadExpenseIncomeSum());
    dispatch(DashboardActions.loadMonthlyExpenseIncomeSummary());
  }, []);

  return (
    <>
      <div className="titlebar">
        <h3>Dashboard</h3>
      </div>

      <div className="flex box shadow flex-row">
        <Indicator
          label="Pending Expenses"
          color="danger"
          value={NumberHelper.formatBRL(expenseIncomeSum["pendingExpenses"])}
          icon="bx-archive-out"
        />
        <Indicator
          label="Total Expenses"
          color="danger"
          value={NumberHelper.formatBRL(expenseIncomeSum["totalExpenses"])}
          icon="bxs-archive-out"
        />
        <Indicator
          label="Pending Income"
          value={NumberHelper.formatBRL(expenseIncomeSum["pendingIncome"])}
          icon="bx-archive-in"
        />
        <Indicator
          label="Total Income"
          value={NumberHelper.formatBRL(expenseIncomeSum["totalIncome"])}
          icon="bxs-archive-in"
        />
      </div>

      {notifications.length ? (
        <div className="flex flex-column box shadow padding margin-top">
          <NotificationWidget />
        </div>
      ) : null}

      <div className="flex flex-column box border-bottom shadow margin-v">
        <div className="flex flex-row margin-v">
          <div className="flex flex-column padding flex-1">
            <div className="titlebar">
              <h3>Pending Expenses / Incomes</h3>
            </div>
            <PendingExpenseIncome />
          </div>
          <div className="flex flex-column align-items-center justify-content-center padding flex-1 border-left">
            <div className="titlebar">
              <h3>Expenses per category</h3>
            </div>
            <ExpensesPerCategory />
          </div>
        </div>
      </div>
      <div className="flex flex-column box border-bottom margin-v shadow">
        <div className="flex flex-row margin-v">
          <div className="flex flex-column padding flex-1">
            <LoaderAndEmptyWrapper
              isLoading={monthlyExpenseIncomeSummary.isLoading}
              isEmpty={
                monthlyExpenseIncomeSummary.expenses === 0 &&
                monthlyExpenseIncomeSummary.incomes === 0
              }
              loadingMessage="Loading Expenses Evolution Chart"
            >
              <div className="titlebar">
                <h3>Expenses/Income evolution</h3>
              </div>
              <ReactApexChart
                type="bar"
                height={380}
                width={600}
                series={[
                  {
                    name: "Expenses",
                    data: monthlyExpenseIncomeSummary.expenses.map(
                      (i: any) => i.amount
                    ),
                  },
                  {
                    name: "Incomes",
                    data: monthlyExpenseIncomeSummary.incomes.map(
                      (i: any) => i.amount
                    ),
                  },
                ]}
                options={{
                  labels: monthlyExpenseIncomeSummary.expenses.map(
                    (i: any) => i.month
                  ),
                  dataLabels: { enabled: false },
                  xaxis: {
                    tooltip: { enabled: false },
                  },
                }}
              ></ReactApexChart>
            </LoaderAndEmptyWrapper>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardView;
