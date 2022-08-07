import React, { useEffect, useState } from "react";
import ExpenseIncomeCollection from "../components/ExpenseIncomeCollection";
import ExpenseIncomeInstance from "../components/ExpenseIncomeInstance";
import GlobalFilter from "../components/GlobalFilter";
import { ExpenseIncomeService } from "../services/ExpenseIncomeService";
import {
  DashboardActions,
  useDashboardContext,
} from "../store/DashBoardStateContext";
import {
  ExpenseIncomeActions,
  useExpenseIncomeStateContext,
} from "../store/ExpenseIncomeStateContext";
import Modal from "../template/Modal";

function ExpensesIncomeView() {
  const [{ loadingPending, page, filter, order }, dispatch] =
    useExpenseIncomeStateContext();
  const [showingInstance, setShowingInstance] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState(null);
  const [_, dashboardDispatch] = useDashboardContext();

  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(loadExpenseIncomes, [loadingPending]);

  function loadExpenseIncomes() {
    ExpenseIncomeService.query(page, filter, order).then(({ data }) =>
      dispatch(ExpenseIncomeActions.loadList(data))
    );
  }

  function reload() {
    dispatch(ExpenseIncomeActions.setToLoad());
    dashboardDispatch(DashboardActions.loadExpenseIncomeSum());
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
          id={idToUpdate}
          onDismiss={() => setShowingInstance(false)}
          onSave={(e) => {
            dispatch(ExpenseIncomeActions.setToLoad());
            dashboardDispatch(DashboardActions.loadExpenseIncomeSum());
          }}
        />
      </Modal>

      <GlobalFilter
        supportedFields="bankAccountId,dateInterval,expenseIncomeCategoryId,description,paymentType,expenseIncomeStatus"
        visible={filterVisible}
        onDismiss={() => setFilterVisible(false)}
        filter={filter}
        onChange={(newFilter) => {
          dispatch(ExpenseIncomeActions.changeFilter(newFilter));
          setFilterVisible(false);
        }}
      ></GlobalFilter>
    </>
  );
}

export default ExpensesIncomeView;
