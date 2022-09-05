import React, { useEffect, useState } from "react";
import { useStockOperationContext } from "../store/StockOperationStateContext";
//@ts-ignore
import CrudTable from "./CrudTable";
import BankAccountFilterEditor from "./BankAccountFilterEditor";
import classNames from "classnames";
import StockOperationService from "../services/StockOperationService";
import OffCanva from "../template/OffCanva";
import StockOperationInstance from "./StockOperationInstance";
import QueryService from "../services/QueryService";
import { StockOperationEntity } from "../types/stock";
import { NumberHelper } from "../Helpers";

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
      renderFilterEditor: (
        fieldFilterValue: any,
        onChange: (newFilter: any) => void
      ) => {
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
      onRenderColumn: (item: StockOperationEntity) => (
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
      renderFilterEditor: (
        fieldFilterValue: any,
        onChange: (newFilter: any) => void
      ) => (
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

  const {
    state: { hasMore, page, filter, order, operationList, totalAmount },
    actions: { loadData, changeFilter, setOrder, setPage },
  } = useStockOperationContext();

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
        onChangeFilter={(newFilter: any) => changeFilter(newFilter)}
        onChangeOrder={(newOrder: string) => setOrder(newOrder)}
        onPageChange={(newPage: number) => setPage(newPage)}
        onDeleteClick={(item: StockOperationEntity) => {
          if (window.confirm("Confirm delete record?")) {
            StockOperationService.delete(item.id ?? 0).then(() => loadData());
          }
        }}
        renderFooter={() => (
          <div className="padding-v flex flex-row align-items-space-between">
            <span className="flex-1">Total:</span>
            <strong>{NumberHelper.formatBRL(totalAmount)}</strong>
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
        <StockOperationInstance onSave={(e) => loadData()} />
      </OffCanva>
    </>
  );
}

export default StockOperationList;
