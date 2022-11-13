import React from "react";
// @ts-ignore
import { ExpensesIncomesPerCategory } from "../components/ExpensesPerCategory";
import { PendingExpenseIncome } from "../components/PendingExpenseIncome";
import { NumberHelper } from "../Helpers";
import { useGlobalState } from "../store/GlobalStateContext";
import { NotificationWidget } from "../components/NotificationWidget";
import ReactApexChart from "react-apexcharts";
import LoaderAndEmptyWrapper from "../components/LoaderAndEmptyWrapper";
import { Indicator, IndicatorIcon } from "../components/Indicator";
import { useDashboardContext } from "../store/DashBoardStateContext";
import { ExpenseIncomeSummaryItem } from "../services/DashboardService";

export const DashboardView: React.FC<{}> = () => {
  const dashboardCtx = useDashboardContext();

  const {
    state: { notifications },
  } = useGlobalState();
  const { pendingExpenses, pendingIncomes } = dashboardCtx.state;

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
          value={NumberHelper.formatBRL(pendingExpenses.pendingAmount ?? 0)}
          icon={IndicatorIcon.ArchiveOut}
        />
        <Indicator
          label="Total Expenses"
          color="danger"
          value={NumberHelper.formatBRL(pendingExpenses.totalAmount ?? 0)}
          icon={IndicatorIcon.ArchiveOut}
        />
        <Indicator
          label="Pending Income"
          value={NumberHelper.formatBRL(pendingIncomes.pendingAmount ?? 0)}
          icon={IndicatorIcon.ArchiveIn}
        />
        <Indicator
          label="Total Income"
          value={NumberHelper.formatBRL(pendingIncomes.totalAmount ?? 0)}
          icon={IndicatorIcon.ArchiveIn}
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
              <h3>Pending Expenses</h3>
            </div>
            <PendingExpenseIncome list={pendingExpenses.list} />
          </div>
          <div className="flex flex-column align-items-center justify-content-center padding flex-1 border-left">
            <div className="titlebar">
              <h3>Expenses per category</h3>
            </div>
            <ExpensesIncomesPerCategory paymentType="EXPENSE" />
          </div>
        </div>
      </div>

      <div className="flex flex-column box border-bottom shadow margin-v">
        <div className="flex flex-row margin-v">
          <div className="flex flex-column padding flex-1">
            <div className="titlebar">
              <h3>Pending Incomes</h3>
            </div>
            <PendingExpenseIncome list={pendingIncomes.list} />
          </div>
          <div className="flex flex-column align-items-center justify-content-center padding flex-1 border-left">
            <div className="titlebar">
              <h3>Incomes per category</h3>
            </div>
            <ExpensesIncomesPerCategory paymentType="INCOME" />
          </div>
        </div>
      </div>

      <div className="flex flex-column box border-bottom margin-v shadow">
        <div className="flex flex-row margin-v">
          <div className="flex flex-column padding flex-1">
            <LoaderAndEmptyWrapper
              isLoading={dashboardCtx.state.isLoading}
              isEmpty={
                dashboardCtx.state.monthlyExpenseIncomeSummary?.length === 0
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
