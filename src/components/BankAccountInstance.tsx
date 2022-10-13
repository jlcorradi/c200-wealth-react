import classNames from "classnames";
import React, { useState, useEffect, FC, SyntheticEvent } from "react";
//@ts-ignore
import { NotificationManager } from "react-notifications";
import { http } from "../Http";
import LoadingComponent from "../template/LoadingComponent";
import { BankAccountEntity } from "../types/bank-account";

import {
  hasErrors,
  required,
  ruleRunner,
  runValidations,
} from "../Validatoion";

export const BankAccountInstance: FC<{
  id: string;
  onUpdate: (account: BankAccountEntity) => void;
}> = ({ onUpdate, id }) => {
  let validationRules = [
    ruleRunner("number", "Account Number", required),
    ruleRunner("description", "Description", required),
    ruleRunner("type", "Account Type", required),
  ];

  const EMPTY_ACCOUNT: BankAccountEntity = {
    id: undefined,
    active: true,
    number: "",
    description: "",
    type: "INVESTMENT",
  };

  let [errors, setErrors] = useState<any>({});
  let [submitted, setSubmitted] = useState(false);
  let [loading, setLoading] = useState(false);

  let [account, setAccount] = useState<BankAccountEntity>(EMPTY_ACCOUNT);

  function isUpdating() {
    return id && id !== "new";
  }

  useEffect(() => {
    setSubmitted(false);
    setErrors({});
    if (isUpdating()) {
      setLoading(true);
      http
        .get(`/api/v1/bank_accounts/${id}`)
        .then((response) => {
          setAccount(response.data);
        })
        .finally(() => setLoading(false));
    } else {
      setAccount(EMPTY_ACCOUNT);
    }
  }, [id, EMPTY_ACCOUNT, isUpdating]);

  function submitForm(e: SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);
    let preSubmittedErros = runValidations<BankAccountEntity>(
      account,
      validationRules
    );
    setErrors(preSubmittedErros);

    if (!hasErrors(preSubmittedErros)) {
      if (isUpdating()) {
        setLoading(true);
        http
          .put(`/api/v1/bank_accounts/${id}`, account)
          .finally(() => setLoading(false));
      } else {
        http
          .post(`/api/v1/bank_accounts`, account)
          .finally(() => setLoading(false));
      }

      if (onUpdate) {
        onUpdate(account);
      }
    } else {
      NotificationManager.warning(
        "Please, verify validation errors and try again."
      );
    }
  }

  function onChange(field: string, value: any) {
    let toUpdate: BankAccountEntity = Object.assign({}, account);
    (toUpdate as any)[field] = value;
    setAccount(toUpdate);
    setErrors(runValidations(toUpdate, validationRules));
  }

  return (
    <>
      {loading && <LoadingComponent />}
      {!loading && (
        <form
          onSubmit={submitForm}
          className={classNames("padding", {
            submitted: submitted,
            error: hasErrors(errors),
          })}
          noValidate
        >
          <div className="form-group">
            <label htmlFor="active">Active</label>
            <input
              type="checkbox"
              name="active"
              checked={account.active}
              data-readonly={isUpdating()}
              onChange={(e) => onChange("active", e.target.checked)}
            />
          </div>
          <div
            className={classNames("form-group", { error: errors["number"] })}
          >
            <label htmlFor="id">Account Number</label>
            <input
              type="text"
              placeholder="Account Number"
              name="number"
              value={account.number}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
            {errors["number"] && <small>{errors["number"]}</small>}
          </div>
          <div className={classNames("form-group", { error: errors["type"] })}>
            <label htmlFor="type">Account Type</label>
            <select
              name="type"
              id="type"
              value={account.type}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            >
              <option value="" disabled selected>
                Select
              </option>
              <option value="SAVINGS">Savings Account</option>
              <option value="INVESTMENT">Investments Account</option>
              <option value="CHECKING">Checking Account</option>
            </select>
            {errors["type"] && <small>{errors["type"]}</small>}
          </div>
          <div
            className={classNames("form-group", {
              error: errors["description"],
            })}
          >
            <label htmlFor="id">Description</label>
            <input
              type="text"
              placeholder="Bank Account Description"
              name="description"
              value={account.description}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
            {errors["description"] && <small>{errors["description"]}</small>}
          </div>
          <div
            className={classNames("form-group", {
              error: errors["description"],
            })}
          >
            <label htmlFor="id">Description</label>
            <input
              type="text"
              placeholder="Related Descriptions(comma separeted)"
              name="relatedDescriptions"
              value={account.relatedDescriptions}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
            {errors["description"] && <small>{errors["description"]}</small>}
          </div>

          <div className="buttons padding-v" data-disabled={loading}>
            <input
              type="submit"
              className="button button-primary"
              value="Save Account Details"
            ></input>
          </div>
        </form>
      )}
    </>
  );
};
