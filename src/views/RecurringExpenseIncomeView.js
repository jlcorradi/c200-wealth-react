import React, { useState } from "react";
import CrudTable from "../components/CrudTable";
import FormWithValidation from "../components/FormWithValidation";
import RecurringExpenseIncomeService from "../services/RecurringExpenseIncomeService";
import {
  RecurringExpenseIncomeActions,
  useRecurringExpenseIncomeContext,
} from "../store/RecurringExpenseIncomeContext";
import Modal from "../template/Modal";
import { minValue, required, ruleRunner } from "../Validatoion";

const EMPTY_ITEM = {
  active: true,
  paymentType: "",
  dueDay: 1,
  categoryId: "",
  amount: 0.0,
  history: "",
};

const formConfig = {
  fields: [
    {
      field: "active",
      label: "Active",
      rowGroup: "firstRow",
      cssClass: "w200",
      fieldType: "checkbox",
    },
    {
      field: "dueDay",
      label: "Due Day",
      rowGroup: "firstRow",
      fieldType: "Number",
    },
    {
      field: "paymentType",
      label: "Type",
      rowGroup: "secondRow",
      cssClass: "w300",
      fieldType: "PAYMENT_TYPE",
    },
    {
      field: "categoryId",
      label: "Category",
      rowGroup: "secondRow",
      fieldType: "EXPENSE_INCOME_CATEGORY",
    },
    { field: "amount", label: "Amount", format: "brl" },
    { field: "history", label: "History", fieldType: "textarea" },
  ],
  validationRules: [
    ruleRunner("dueDay", "Due Day", required),
    ruleRunner("paymentType", "Payment Type", required),
    ruleRunner("categoryId", "Category", required),
    ruleRunner("amount", "Amount", required, minValue(1)),
    ruleRunner("history", "History", required),
  ],
};

function RecurringExpenseIncomeView() {
  const [{ list }, dispatch] = useRecurringExpenseIncomeContext();

  const [instanceVisible, setInstanceVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(EMPTY_ITEM);

  const crudTableConfig = {
    fields: [
      {
        field: "active",
        label: "Active",
        onRenderColumn: (item) => <span>{item.active ? "Yes" : "No"}</span>,
      },
      { field: "dueDay", label: "Due Day" },
      { field: "paymentType", label: "Type" },
      { field: "categoryDescription", label: "Category" },
      { field: "history", label: "History" },
      { field: "amount", label: "Amount", format: "brl" },
    ],
  };

  function deleteItem(item) {
    RecurringExpenseIncomeService.delete(item.id).then(() =>
      dispatch(RecurringExpenseIncomeActions.setToLoad())
    );
  }

  async function handleEditClick(item) {
    const { data: itemToEdit } = await RecurringExpenseIncomeService.get(
      item.id
    );
    setItemToEdit(itemToEdit);
    setInstanceVisible(true);
  }

  return (
    <>
      <div className="titlebar">
        <h3>Recurring Expense/Incomes</h3>
        <div className="buttons">
          <a
            href="#new"
            onClick={(e) => {
              e.preventDefault();
              setItemToEdit(EMPTY_ITEM);
              setInstanceVisible(true);
            }}
          >
            <i className="bx bx-add-to-queue"></i>Create Recurring
            Expense/Income
          </a>
          <a
            href="#new"
            onClick={(e) => {
              e.preventDefault();
              if (!window.confirm("Trigger Recurring Expense generation?")) {
                return;
              }
              RecurringExpenseIncomeService.trigger();
            }}
          >
            <i className="bx bx-bolt-circle"></i> Trigger
          </a>
        </div>
      </div>
      <div className="box shadow padding">
        <CrudTable
          config={crudTableConfig}
          onDeleteClick={deleteItem}
          onEditClick={handleEditClick}
          items={list}
        ></CrudTable>
      </div>
      <Modal
        title="Add Recurring Expense/Income"
        onClose={() => setInstanceVisible(false)}
        visible={instanceVisible}
      >
        <FormWithValidation
          modelToEdit={itemToEdit}
          config={formConfig}
          onDismiss={() => setInstanceVisible(false)}
          onSubmit={async (model) => {
            setInstanceVisible(false);
            await RecurringExpenseIncomeService.save(model);
            dispatch(RecurringExpenseIncomeActions.setToLoad());
          }}
        ></FormWithValidation>
      </Modal>
    </>
  );
}

export default RecurringExpenseIncomeView;
