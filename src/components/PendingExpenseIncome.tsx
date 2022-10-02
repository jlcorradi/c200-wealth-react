import React from "react";
import { ExpenseIncomeService } from "../services/ExpenseIncomeService";
import { NumberHelper, StringHelper } from "../Helpers";
import classNames from "classnames";
// @ts-ignore
import LoaderAndEmptyWrapper from "./LoaderAndEmptyWrapper";
// @ts-ignore
import { useGlobalState } from "../store/GlobalStateContext";
import { useDashboardContext } from "../store/DashBoardStateContext";
import {
  ExpenseIncomeEntity,
  PaymentStatus,
  PaymentType,
} from "../types/expense-income";

export const PendingExpenseIncome: React.FC<{
  list: ExpenseIncomeEntity[];
}> = ({ list }) => {
  const { state, actions } = useDashboardContext();

  const {
    actions: { showExpenseIncomeOffset },
  } = useGlobalState();

  function markPaid(item: ExpenseIncomeEntity) {
    ExpenseIncomeService.quickPay(item.id).then(() => actions.markToReload());
  }

  return (
    <LoaderAndEmptyWrapper
      loadingMessage="Loading Pending Income/Expenses"
      emptyIcon="happy"
      isLoading={state.isLoading}
      isEmpty={list.length === 0}
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
          {list
            .filter((item: ExpenseIncomeEntity) => item.status === "PENDING")
            .map((item: ExpenseIncomeEntity) => (
              <tr
                key={item.id}
                className={classNames({
                  income: item.paymentType === PaymentType.Income,
                  outcome: item.paymentType === PaymentType.Expense,
                  italic: item.status === PaymentStatus.Paid,
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
                      showExpenseIncomeOffset(item.id);
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
};
