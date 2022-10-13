import classNames from "classnames";
import React, { FC } from "react";
import LoaderAndEmptyWrapper from "./LoaderAndEmptyWrapper";
import LoadMoreButton from "./LoadMoreButton";
import { NumberHelper, StringHelper } from "../Helpers";
import { useExpenseIncomeStateContext } from "../store/ExpenseIncomeStateContext";
import { OrderToggle } from "./OrderToggle";
import { ExpenseIncomeEntity } from "../types/expense-income";

export const ExpenseIncomeCollection: FC<{
  onEdit: (e: ExpenseIncomeEntity) => void;
  onDelete: (e: ExpenseIncomeEntity) => void;
  onPay: (e: ExpenseIncomeEntity) => void;
}> = ({ onEdit, onDelete, onPay }) => {
  const {
    state: { list, isLoading, hasMore, order },
    actions: { setOrder, nextPage },
  } = useExpenseIncomeStateContext();

  function getTotal() {
    let total = list.reduce(
      (tot: number, curr: ExpenseIncomeEntity) =>
        tot + (curr.paymentType === "EXPENSE" ? -1 * curr.amount : curr.amount),
      0
    );
    return NumberHelper.formatBRL(total);
  }

  function renderRow(item: ExpenseIncomeEntity) {
    return (
      <tr
        key={item.id}
        className={classNames({
          italic: item.status === "PAID",
          bold: item.overdue,
        })}
      >
        <td>{item.dueDate}</td>
        <td>
          <i
            className={classNames("bx", {
              "bx-layer-minus": item.paymentType === "EXPENSE",
              "bx-layer-plus": item.paymentType === "INCOME",
            })}
          ></i>
        </td>
        <td>{item.categoryDescription}</td>
        <td>{StringHelper.abbreviate(item.history, 30)}</td>
        <td
          className={classNames("text-right", {
            income: item.paymentType === "INCOME",
            outcome: item.paymentType === "EXPENSE",
          })}
        >
          {NumberHelper.formatBRL(item.amount)}
        </td>
        <td>
          <i
            className={classNames("bx", {
              "bx-check-double": item.status === "PAID",
              "bx-info-circle": item.status === "PENDING",
            })}
          ></i>
        </td>
        <td className="text-right">
          {onPay && item.status === "PENDING" && (
            <a
              href="#pay"
              onClick={(e) => {
                e.preventDefault();
                onPay(item);
              }}
            >
              <i className="bx bx-badge-check"></i>Pay
            </a>
          )}
          {onEdit && (
            <a
              href="#edit"
              onClick={(e) => {
                e.preventDefault();
                onEdit(item);
              }}
            >
              <i className="bx bx-pencil"></i>
            </a>
          )}
          {onDelete && (
            <a
              href="#delete"
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm("Delete Record?")) {
                  onDelete(item);
                }
              }}
            >
              <i className="bx bx-trash"></i>
            </a>
          )}
        </td>
      </tr>
    );
  }

  return (
    <LoaderAndEmptyWrapper isLoading={isLoading} isEmpty={!list.length}>
      <table className="data-table">
        <thead>
          <tr>
            <td>
              <OrderToggle
                field="dueDate"
                order={order ?? ""}
                onChange={setOrder}
                description="Due Date"
              />
            </td>
            <td>
              <OrderToggle
                field="paymentType"
                order={order ?? ""}
                onChange={setOrder}
                description="Type"
              />
            </td>
            <td>
              <OrderToggle
                field="category.description"
                order={order ?? ""}
                onChange={setOrder}
                description="Category"
              />
            </td>
            <td>
              <OrderToggle
                field="history"
                order={order ?? ""}
                onChange={setOrder}
                description="History"
              />
            </td>
            <td>
              <OrderToggle
                field="amount"
                order={order ?? ""}
                onChange={setOrder}
                description="Amount"
              />
            </td>
            <td>
              <OrderToggle
                field="status"
                order={order ?? ""}
                onChange={setOrder}
                description="Status"
              />
            </td>
            <td className="text-right">Operations</td>
          </tr>
        </thead>
        <tbody>
          {list.map(renderRow)}
          <tr>
            <td data-colSpan="6">Total: </td>
            <td className="text-right">
              <strong>{getTotal()}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <LoadMoreButton enabled={hasMore} onClick={nextPage} />
    </LoaderAndEmptyWrapper>
  );
};
