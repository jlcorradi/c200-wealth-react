import classNames from "classnames";
import React, { FC, SyntheticEvent, useEffect, useState } from "react";
import { ExpenseIncomeService } from "../services/ExpenseIncomeService";
import KeyValuePairService from "../services/KeyValuePairService";
import {
  ExpenseIncomeEntity,
  PaymentStatus,
  PaymentType,
} from "../types/expense-income";
import { KeyValuePair } from "../types/key-value-pair";
import {
  hasErrors,
  minValue,
  required,
  ruleRunner,
  runValidations,
} from "../Validatoion";
import { BankAccountCombo } from "./BankAccountCombo";
import LoaderAndEmptyWrapper from "./LoaderAndEmptyWrapper";

const EMPTY_MODEL = {
  paymentType: PaymentType.Expense,
  dueDate: "",
  categoryId: -1,
  amount: 0.0,
  history: "",
  bankAccountId: null,
  paymentDate: "",
  paidAmount: 0,
  feesAndInterest: 0,
  status: PaymentStatus.Pending,
} as unknown as ExpenseIncomeEntity;

const validationRules = [
  ruleRunner("paymentType", "Type", required),
  ruleRunner("dueDate", "Due Date", required),
  ruleRunner("categoryId", "Category", required),
  ruleRunner("amount", "Amount", required, minValue(0.01)),
  ruleRunner("history", "History", required),
];

const paymentValidationRules = [
  ruleRunner("bankAccountId", "Bank Account", required),
  ruleRunner("paymentDate", "Payment Date", required),
  ruleRunner("paidAmount", "Paid Amount", required),
];

export const ExpenseIncomeInstance: FC<{
  id: number | null;
  onSave?: (e: ExpenseIncomeEntity) => void;
  onDismiss: () => void;
  showVertically?: boolean;
}> = ({ id, onSave, onDismiss, showVertically = false }) => {
  const [errors, setErrors] = useState<any>({});
  const [model, setModel] = useState<ExpenseIncomeEntity>(EMPTY_MODEL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [categories, setCategories] = useState<KeyValuePair[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [paymentDataDirty, setPaymentDataDirty] = useState<boolean>(false);

  useEffect(() => {
    KeyValuePairService.listExpenseIncomeCategories().then(({ data }) =>
      setCategories(data)
    );
  }, []);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      ExpenseIncomeService.get(id)
        .then(({ data }) => setModel({ ...data }))
        .finally(() => setIsLoading(false));
      setIsUpdating(true);
    }
  }, [id]);

  function submit(e: SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);

    let newErrors = runValidations(model, validationRules);
    setErrors(newErrors);
    if (hasErrors(newErrors)) {
      return;
    }

    if (paymentDataDirty) {
      let newErrorsPayment = runValidations(model, paymentValidationRules);
      setErrors({ ...newErrors, ...newErrorsPayment });
      if (hasErrors(newErrorsPayment)) {
        return;
      }
    }

    if (isUpdating) {
      ExpenseIncomeService.update(id ?? -1, model).then(({ data }) => {
        if (onSave) {
          onSave(data);
        }
        onDismiss();
      });
    } else {
      ExpenseIncomeService.create(model).then(({ data }) => {
        if (onSave) {
          onSave(data);
        }
        setSubmitted(false);
        setPaymentDataDirty(false);
        setModel(EMPTY_MODEL);
      });
    }
  }

  function onChange(field: string, value: any) {
    let newModel = { ...model };
    (newModel as any)[field] = value;
    setModel(newModel);
    let newErrors = runValidations(newModel, validationRules);
    setErrors(newErrors);
    return newModel;
  }

  function onChangePayment(field: string, value: any) {
    let newModel = onChange(field, value);
    if (!paymentDataDirty) {
      setPaymentDataDirty(true);
      setModel({
        ...newModel,
        paymentDate: newModel.dueDate,
        paidAmount: newModel.amount,
        status: PaymentStatus.Paid,
      });
    }

    let newErrors = runValidations(newModel, [
      ...validationRules,
      ...paymentValidationRules,
    ]);
    setErrors(newErrors);
  }

  return (
    <LoaderAndEmptyWrapper isLoading={isLoading} isEmpty={false}>
      <form
        onSubmit={submit}
        className={classNames("flex", "flex-column", { submitted: submitted })}
      >
        <div
          className={classNames("flex border-bottom padding-v", {
            "flex-column": showVertically,
            "flex-row": !showVertically,
          })}
        >
          <div className="flex-1 padding flex flex-column">
            <div className="flex flex-row">
              <div
                className={classNames("form-group", "flex-1", {
                  error: errors["paymentType"],
                })}
              >
                <label htmlFor="paymentType">Payment Type</label>
                <select
                  name="paymentType"
                  id="paymentType"
                  onChange={(e) => onChange(e.target.name, e.target.value)}
                  value={model["paymentType"]}
                >
                  <option value="" data-defaultValue>
                    Select
                  </option>
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
                <small>{errors["paymentType"]}</small>
              </div>

              <div
                className={classNames("form-group", "margin-left", "flex-1", {
                  error: errors["dueDate"],
                })}
              >
                <label htmlFor="paymentType">Due Date</label>
                <input
                  type="text"
                  name="dueDate"
                  id="dueDate"
                  onChange={(e) => onChange(e.target.name, e.target.value)}
                  value={model["dueDate"]}
                  placeholder="dd/MM/yyyy"
                />
                <small>{errors["dueDate"]}</small>
              </div>
            </div>

            <div
              className={classNames("form-group", "flex-1", {
                error: errors["categoryId"],
              })}
            >
              <label htmlFor="categoryId">Category</label>
              <select
                name="categoryId"
                id="categoryId"
                onChange={(e) => onChange(e.target.name, e.target.value)}
                value={model["categoryId"]}
              >
                <option value="" data-defaultValue>
                  Select
                </option>
                {categories.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.description}
                  </option>
                ))}
              </select>
              <small>{errors["categoryId"]}</small>
            </div>

            <div
              className={classNames("form-group", "w200", {
                error: errors["amount"],
              })}
            >
              <label htmlFor="amount">Amount</label>
              <input
                type="text"
                name="amount"
                id="amount"
                onChange={(e) => onChange(e.target.name, e.target.value)}
                value={model["amount"]}
                placeholder="999.99"
              />
              <small>{errors["amount"]}</small>
            </div>

            <div
              className={classNames("form-group", { error: errors["history"] })}
            >
              <label htmlFor="history">History</label>
              <textarea
                data-rows="5"
                name="history"
                id="history"
                onChange={(e) => onChange(e.target.name, e.target.value)}
                value={model["history"]}
              />
              <small>{errors["history"]}</small>
            </div>
          </div>
          <div
            className={classNames("padding flex flex-column", {
              "border-top": showVertically,
              "border-left": !showVertically,
              "w400 ": !showVertically,
            })}
          >
            <div className="titlebar">
              <strong>Payment Data</strong>
            </div>

            <div
              className={classNames("form-group", {
                error: errors["bankAccountId"],
              })}
            >
              <BankAccountCombo
                label="Account"
                value={model.bankAccountId?.toString() ?? ""}
                errorObject={errors["bankAccountId"]}
                onChange={(id) => onChangePayment("bankAccountId", id)}
              />
            </div>

            <div
              className={classNames("form-group", {
                error: errors["paymentDate"],
              })}
            >
              <label htmlFor="paymentType">Payment Date</label>
              <input
                type="text"
                name="paymentDate"
                id="paymentDate"
                onChange={(e) => onChangePayment(e.target.name, e.target.value)}
                value={(model as any)["paymentDate"]}
                placeholder="dd/MM/yyyy"
              />
              <small>{errors["dueDate"]}</small>
            </div>

            <div className="flex flex-1 flex-row">
              <div className="flex flex-1 flex-column">
                <div
                  className={classNames("form-group", "margin-left", {
                    error: errors["paidAmount"],
                  })}
                >
                  <label htmlFor="paidAmount">paidAmount</label>
                  <input
                    type="text"
                    name="paidAmount"
                    id="paidAmount"
                    onChange={(e) =>
                      onChangePayment(e.target.name, e.target.value)
                    }
                    value={model["paidAmount"]}
                    placeholder="999.99"
                  />
                  <small>{errors["paidAmount"]}</small>
                </div>
              </div>
              <div className="flex flex-1 flex-column">
                <div
                  className={classNames("form-group", "margin-left", {
                    error: errors["feesAndInterest"],
                  })}
                >
                  <label htmlFor="feesAndInterest">Fees and Interest</label>
                  <input
                    type="text"
                    name="feesAndInterest"
                    id="feesAndInterest"
                    onChange={(e) =>
                      onChangePayment(e.target.name, e.target.value)
                    }
                    value={model["feesAndInterest"]}
                    placeholder="999.99"
                  />
                  <small>{errors["feesAndInterest"]}</small>
                </div>
              </div>
            </div>
            <div className="flex flex-row"></div>
          </div>
        </div>
        <div className="buttons">
          <button className="primary">
            <i className="bx bx-save"></i> Save
          </button>
          <button className="default" type="button" onClick={onDismiss}>
            <i className="bx bx-x"></i> Done
          </button>
        </div>
      </form>
    </LoaderAndEmptyWrapper>
  );
};
