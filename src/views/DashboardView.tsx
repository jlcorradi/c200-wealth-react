import React from "react";
// @ts-ignore
import ExpensesPerCategory from "../components/ExpensesPerCategory";
// @ts-ignore
import PendingExpenseIncome from "../components/PendingExpenseIncome";
import { ArrayHelper, NumberHelper } from "../Helpers";
// @ts-ignore
import { useGlobalState } from "../store/GlobalStateContext";
// @ts-ignore
import NotificationWidget from "../components/NotificationWidget";
import ReactApexChart from "react-apexcharts";
// @ts-ignore
import LoaderAndEmptyWrapper from "../components/LoaderAndEmptyWrapper";
import { Indicator } from "../components/Indicator";
//@ts-ignore
import { useDashboardContext } from "../store/DashBoardStateContext";
import { ExpenseIncomeEntity, PaymentType } from "../types/expense-income";
import { ExpenseIncomeSummaryItem } from "../services/DashboardService";

export const DashboardView: React.FC<{}> = () => {
  const dashboardCtx = useDashboardContext();

  const [{ notifications }] = useGlobalState();
  const { pendingExpenses, pendingIncome, totalExpenses, totalIncome } =
    dashboardCtx.state.expenseIncomeSum;

  const { monthlyExpenseIncomeSummary } = dashboardCtx.state;

  return (
    <>
      <div className="titlebar">
        <h3>Dashboard</h3>
      </div>

      <div className="flex box shadow flex-row">
        <Indicator
          label="Pending Expenses"
          color="danger"
          value={NumberHelper.formatBRL(pendingExpenses ?? 0)}
          icon="bx-archive-out"
        />
        <Indicator
          label="Total Expenses"
          color="danger"
          value={NumberHelper.formatBRL(totalExpenses ?? 0)}
          icon="bxs-archive-out"
        />
        <Indicator
          label="Pending Income"
          value={NumberHelper.formatBRL(pendingIncome ?? 0)}
          icon="bx-archive-in"
        />
        <Indicator
          label="Total Income"
          value={NumberHelper.formatBRL(totalIncome ?? 0)}
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
              isLoading={dashboardCtx.state.isLoading}
              isEmpty={
                dashboardCtx.state.expenseIncomeSum.pendingExpensesIncomeList
                  ?.length === 0
              }
              loadingMessage="Loading Expenses Evolution Chart"
            >
              <>
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
                      data: monthlyExpenseIncomeSummary.map(
                        (i: ExpenseIncomeSummaryItem) => i.expenseAmount
                      ),
                    },
                    {
                      name: "Incomes",
                      data: monthlyExpenseIncomeSummary.map(
                        (i: ExpenseIncomeSummaryItem) => i.incomeAmount
                      ),
                    },
                  ]}
                  options={{
                    labels: monthlyExpenseIncomeSummary.map(
                      (i: ExpenseIncomeSummaryItem) => i.month
                    ),
                    dataLabels: { enabled: false },
                    xaxis: {
                      tooltip: { enabled: false },
                    },
                  }}
                ></ReactApexChart>
              </>
            </LoaderAndEmptyWrapper>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardView;
