import React from "react";
import { useDividendYieldStateContext } from "../store/DividendYieldStateContext";
//@ts-ignore
import CrudTable from "./CrudTable";
import BankAccountFilterEditor from "./BankAccountFilterEditor";
import DividendYieldInstance from "./DividendYieldInstance";
import DividendYieldService from "../services/DividendYieldService";
import { NumberHelper } from "../Helpers";
import { DividendYieldEntity } from "../types/dividend-yield";

const config = {
  fields: [
    {
      field: "id",
      label: "#",
    },
    {
      field: "symbol",
      label: "Ticker",
      functionalField: "stock.symbol",
      allowSort: true,
      allowFilter: true,
    },
    {
      field: "bankAccountDescription",
      label: "Bank Account",
      functionalField: "bankAccount.id",
      allowSort: true,
      allowFilter: true,
      renderFilterEditor: (
        fieldFilterValue: any,
        onChange: (value: any) => void
      ) => (
        <BankAccountFilterEditor
          fieldFilterValue={fieldFilterValue}
          onChange={onChange}
        />
      ),
    },
    {
      field: "quantity",
      allowSort: true,
    },
    {
      field: "paymentDate",
      label: "Payment Date",
      allowSort: true,
      allowFilter: true,
      filterType: "DATE_RANGE",
    },
    {
      field: "yieldType",
      label: "Type",
      allowSort: true,
      allowFilter: true,
      renderFilterEditor: (
        fieldFilterValue: any,
        onChange: (value: any) => void
      ) => {
        const [value] = fieldFilterValue ? fieldFilterValue : [""];
        return (
          <select value={value} onChange={(e) => onChange([e.target.value])}>
            <option>Select</option>
            <option value="DIVIDEND_YIELD">Dividend Yield</option>
            <option value="JCP">JCP</option>
            <option value="RENDIMENT">Rendiment</option>
          </select>
        );
      },
    },
    {
      field: "amount",
      label: "Amount",
      format: "brl",
      className: "text-right",
      allowSort: true,
      allowFilter: true,
      filterType: "NUMBER_RANGE",
    },
  ],
};

function DividendYieldList() {
  const {
    state: { hasMore, page, filter, totalAmount, dividendYieldList, order },
    actions: { loadData, setFilter, setOrder, setPage },
  } = useDividendYieldStateContext();
  const [instanceVisible, setInstanceVisible] = React.useState(false);

  return (
    <>
      <div className="titlebar">
        <h3>Dividend Yields</h3>
        <div className="buttons">
          <a
            href="#new"
            onClick={(e) => {
              e.preventDefault();
              setInstanceVisible(true);
            }}
          >
            <i className="bx bx-add-to-queue"></i>Register Yield
          </a>
        </div>
      </div>
      <CrudTable
        config={config}
        items={dividendYieldList}
        filter={filter}
        order={order}
        page={page}
        hasMore={hasMore}
        onPageChange={(page: number) => {
          setPage(page);
        }}
        onDeleteClick={async (item: DividendYieldEntity) => {
          if (!window.confirm("Are you sure you want to delete the record?")) {
            return;
          }
          await DividendYieldService.delete(item.id);
          loadData();
        }}
        onChangeFilter={(newFilter: any) => {
          setFilter({...newFilter});
        }}
        onChangeOrder={(order: string) => {
          setOrder(order);
        }}
        renderFooter={() => (
          <div className="padding flex flex-row justify-content-end">
            <strong>Total: </strong>
            <span className="margin-left">
              {NumberHelper.formatBRL(totalAmount)}
            </span>
          </div>
        )}
      />

      <DividendYieldInstance
        visible={instanceVisible}
        onDismiss={() => setInstanceVisible(false)}
      />
    </>
  );
}

export default DividendYieldList;
