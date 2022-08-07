import React from "react";
import { ExpenseIncomeService } from "../services/ExpenseIncomeService";
import { NumberHelper, StringHelper } from "../Helpers";
import classNames from "classnames";
import LoaderAndEmptyWrapper from "./LoaderAndEmptyWrapper";
import {
  DashboardActions,
  useDashboardContext,
} from "../store/DashBoardStateContext";
import { GlobalActions, useGlobalState } from "../store/GlobalStateContext";

function PendingExpenseIncome() {
  const [{ expenseIncomeList, expenseIncomeSumIsLoading }, dispatch] =
    useDashboardContext();

  const [, globalDispatch] = useGlobalState();

  function markPaid(item) {
    ExpenseIncomeService.quickPay(item.id).then(() =>
      dispatch(DashboardActions.loadExpenseIncomeSum())
    );
  }

  return (
    <LoaderAndEmptyWrapper
      loadingMessage="Loading Pending Income/Expenses"
      emptyIcon="happy"
      isLoading={expenseIncomeSumIsLoading}
      isEmpty={expenseIncomeList.length === 0}
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
          {expenseIncomeList
            .filter((item) => item.status === "PENDING")
            .map((item) => (
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
          <tr></tr>
        </tbody>
      </table>
    </LoaderAndEmptyWrapper>
  );
}

export default PendingExpenseIncome;
