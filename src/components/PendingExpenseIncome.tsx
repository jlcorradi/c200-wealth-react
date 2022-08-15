import React from "react";
import { ExpenseIncomeService } from "../services/ExpenseIncomeService";
import { NumberHelper, StringHelper } from "../Helpers";
import classNames from "classnames";
// @ts-ignore
import LoaderAndEmptyWrapper from "./LoaderAndEmptyWrapper";
// @ts-ignore
import { GlobalActions, useGlobalState } from "../store/GlobalStateContext";
import { useDashboardContext } from "../store/DashBoardStateContext";
import { IExpenseIncome } from "../types/expense-income";

function PendingExpenseIncome() {
  const { state, actions } = useDashboardContext();
  const { pendingExpensesIncomeList } = state.expenseIncomeSum;

  const [, globalDispatch] = useGlobalState();

  function markPaid(item: IExpenseIncome) {
    ExpenseIncomeService.quickPay(item.id).then(() => actions.markToReload());
  }

  return (
    <LoaderAndEmptyWrapper
      loadingMessage="Loading Pending Income/Expenses"
      emptyIcon="happy"
      isLoading={state.isLoading}
      isEmpty={pendingExpensesIncomeList?.length === 0}
    >
      <table className="data-table">
        <thead>
          <tr>
            <th>Due Date</th>
            <th>Category</th>
            <th>History</th>
            <th>Amount</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pendingExpensesIncomeList
            .filter((item: IExpenseIncome) => item.status === "PENDING")
            .map((item: IExpenseIncome) => (
              <tr
                key={item.id}
                className={classNames({
                  income: item.paymentType === "INCOME",
                  outcome: item.paymentType === "EXPENSE",
                  italic: item.status === "PAID",
                  bold: item.overdue,
                })}
              >
                <td>{item.dueDate}</td>
                <td>{item.categoryDescription}</td>
                <td>{StringHelper.abbreviate(item.history, 24)}</td>
                <td>{NumberHelper.formatBRL(item.amount)}</td>
                <td>
                  <a
                    href="#edit"
                    onClick={(e) => {
                      e.preventDefault();
                      globalDispatch(
                        GlobalActions.showExpenseIncomeOffset(item.id)
                      );
                    }}
                  >
                    <i className="bx bx-pencil"></i>Edit
                  </a>
                </td>
                <th>
                  <a
                    href="#pay"
                    onClick={(e) => {
                      e.preventDefault();
                      markPaid(item);
                    }}
                  >
                    <i className="bx bx-badge-check"></i>Pay
                  </a>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </LoaderAndEmptyWrapper>
  );
}

export default PendingExpenseIncome;
