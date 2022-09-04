import React, { useEffect, useState } from "react";
import {
  StockOperationActions,
  useStockOperationContext,
} from "../store/StockOperationStateContext";
import CrudTable from "./CrudTable";
import BankAccountFilterEditor from "./BankAccountFilterEditor";
import classNames from "classnames";
import StockOperationService from "../services/StockOperationService";
import OffCanva from "../template/OffCanva";
import StockOperationInstance from "./StockOperationInstance";
import QueryService from "../services/QueryService";

const config = {
  fields: [
    {
      field: "operationDate",
      label: "Operation Date",
      allowFilter: true,
      filterType: "DATE_RANGE",
      allowSort: true,
    },
    {
      field: "symbol",
      functionalField: "stock.symbol",
      label: "Stock",
      allowFilter: true,
      filterType: "DEFAULT",
      allowSort: true,
    },
    {
      field: "operationType",
      label: "Type",
      allowFilter: true,
      renderFilterEditor: (fieldFilterValue, onChange) => {
        const [value] = fieldFilterValue ? fieldFilterValue : [""];
        return (
          <select onChange={(e) => onChange([e.target.value])} value={value}>
            <option value="">Select</option>
            <option value="PURCHASE">Purchase</option>
            <option value="SELL">sell</option>
          </select>
        );
      },
      allowSort: true,
      onRenderColumn: (item) => (
        <span
          className={classNames({
            income: item.operationType === "PURCHASE",
            danger: item.operationType === "SELL",
          })}
        >
          {item.operationType}
        </span>
      ),
    },
    {
      field: "bankAccountDescription",
      label: "Bank Account",
      functionalField: "bankAccount.id",
      allowSort: true,
      allowFilter: true,
      renderFilterEditor: (fieldFilterValue, onChange) => (
        <BankAccountFilterEditor
          fieldFilterValue={fieldFilterValue}
          onChange={onChange}
        />
      ),
    },
    { field: "price", label: "Price", format: "brl" },
    { field: "quantity", label: "Quantity" },
    { field: "total", label: "Total", format: "brl" },
  ],
};

function StockOperationList() {
  const [instanceVisible, setInstanceVisible] = React.useState(false);
  const [{ operationList, page, order, filter, hasMore }, dispatch] =
    useStockOperationContext();

  const [total, setTotal] = useState(0);

  async function loadTotal() {
    const { data: amount } = await QueryService.sumCustom(
      "StockOperationEntity",
      "sum(quantity*price)",
      filter
    );
    setTotal(amount);
  }

  useEffect(() => {
    loadTotal();
  }, [filter]);

  return (
    <>
      <div className="titlebar">
        <h3>Stock Operations</h3>
        <div className="buttons">
          <a
            href="#new"
            onClick={(e) => {
              e.preventDefault();
              setInstanceVisible(true);
            }}
          >
            <i className="bx bx-add-to-queue"></i>Register Operations
          </a>
        </div>
      </div>
      <CrudTable
        config={config}
        items={operationList}
        order={order}
        filter={filter}
        hasMore={hasMore}
        page={page}
        onChangeFilter={(newFilter) =>
          dispatch(StockOperationActions.changeFilter(newFilter))
        }
        onChangeOrder={(newOrder) =>
          dispatch(StockOperationActions.changeOrder(newOrder))
        }
        onPageChange={(newPage) =>
          dispatch(StockOperationActions.changeCurrentPage(newPage))
        }
        onDeleteClick={(item) => {
          if (window.confirm("Confirm delete record?")) {
            StockOperationService.delete(item.id).then(() =>
              dispatch(StockOperationActions.setToLoad())
            );
          }
        }}
        renderFooter={() => (
          <div className="flex align-items-space-between">
            <div>
              <span>Total:</span>
              <strong>{total}</strong>
            </div>
          </div>
        )}
      />
      <OffCanva
        visible={instanceVisible}
        onDismiss={() => setInstanceVisible(false)}
      >
        <div className="titlebar">
          <h3>New Operation</h3>
        </div>
        <StockOperationInstance
          onSave={(e) => dispatch(StockOperationActions.setToLoad())}
        />
      </OffCanva>
    </>
  );
}

export default StockOperationList;
