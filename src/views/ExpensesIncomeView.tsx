import React, { FC, useEffect, useState } from "react";
import { ExpenseIncomeCollection } from "../components/ExpenseIncomeCollection";
import { ExpenseIncomeInstance } from "../components/ExpenseIncomeInstance";
import GlobalFilter from "../components/GlobalFilter";
import { ExpenseIncomeService } from "../services/ExpenseIncomeService";
import { useDashboardContext } from "../store/DashBoardStateContext";
import { useExpenseIncomeStateContext } from "../store/ExpenseIncomeStateContext";
//@ts-ignore
import Modal from "../template/Modal";
import { ExpenseIncomeEntity } from "../types/expense-income";

export const ExpensesIncomeView: FC<{}> = () => {
  const {
    state: { isLoading, page, filter, order },
    actions: { loadData, changeFilter },
  } = useExpenseIncomeStateContext();
  const [showingInstance, setShowingInstance] = useState<boolean>(false);
  const [idToUpdate, setIdToUpdate] = useState<number | null>(null);
  const { actions: DashboardActions } = useDashboardContext();

  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  function reload() {
    loadData();
    DashboardActions.markToReload();
  }

  return (
    <>
      <div className="titlebar">
        <h3>Expenses / Income</h3>
        <div className="buttons">
          <a
            href="#new"
            onClick={(e) => {
              e.preventDefault();
              setShowingInstance(true);
              setIdToUpdate(null);
            }}
          >
            <i className="bx bx-add-to-queue"></i>New
          </a>
          <a
            href="#delete"
            onClick={(e) => {
              setFilterVisible(true);
              e.preventDefault();
            }}
          >
            <i className="bx bx-filter-alt"></i>Filter
          </a>
        </div>
      </div>

      <div className="flex flex-column box shadow padding">
        <ExpenseIncomeCollection
          onEdit={(e) => {
            setIdToUpdate(e.id);
            setShowingInstance(true);
          }}
          onDelete={(e) => ExpenseIncomeService.delete(e.id).then(reload)}
          onPay={(e) => ExpenseIncomeService.quickPay(e.id).then(reload)}
        />
      </div>

      <Modal
        title="Expense / Income data"
        visible={showingInstance}
        onClose={() => setShowingInstance(false)}
      >
        <ExpenseIncomeInstance
          id={idToUpdate ?? null}
          onDismiss={() => setShowingInstance(false)}
          onSave={reload}
        />
      </Modal>

      <GlobalFilter
        supportedFields="bankAccountId,dateInterval,expenseIncomeCategoryId,description,paymentType,expenseIncomeStatus"
        visible={filterVisible}
        onDismiss={() => setFilterVisible(false)}
        filter={filter}
        onChange={(newFilter) => {
          changeFilter(newFilter);
          setFilterVisible(false);
        }}
      ></GlobalFilter>
    </>
  );
};
