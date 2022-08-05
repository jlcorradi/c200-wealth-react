import classNames from "classnames";
import React, { useEffect, useState } from "react";
import BankAccountService from "../services/BankAccountServices";
import DividendYieldService from "../services/DividendYieldService";
import {
  DashboardActions,
  useDashboardContext,
} from "../store/DashBoardStateContext";
import {
  DividendYieldActions,
  useDividendYieldStateContext,
} from "../store/DividendYieldStateContext";
import {
  load as loadPortfolio,
  usePortfolioStateContext,
} from "../store/PortfolioStateContext";
import OffCanva from "../template/OffCanva";
import {
  hasErrors,
  required,
  ruleRunner,
  runValidations,
} from "../Validatoion";

const validationRules = [
  ruleRunner("bankAccountId", "BankAccount", required),
  ruleRunner("paymentDate", "Payment Date", required),
  ruleRunner("symbol", "Symbol", required),
  ruleRunner("yieldType", "Yield Type", required),
  ruleRunner("amount", "Amount", required),
];

const EMPTY_MODEL = {
  paymentDate: "",
  symbol: "",
  yieldType: "",
  quantity: 0,
  amount: 0.0,
  bankAccountId: "",
};

function DividendYieldInstance({ visible, onDismiss }) {
  const [, dispatchDYEvent] = useDividendYieldStateContext();
  const { state, dispatchPortfolioEvent } = usePortfolioStateContext();
  const [, dashboardDispatch] = useDashboardContext();

  const [model, seetModel] = useState(EMPTY_MODEL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [bankAccountList, setBankAccountList] = useState([]);

  useEffect(() => {
    BankAccountService.getInvestmentAccounts().then(({ data }) =>
      setBankAccountList(data)
    );
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    let newErrors = runValidations(model, validationRules);
    setErrors(newErrors);
    if (!hasErrors(newErrors)) {
      DividendYieldService.create(model).then(() => {
        dispatchDYEvent(DividendYieldActions.setToLoad());
        dispatchPortfolioEvent(loadPortfolio());
        dashboardDispatch(DashboardActions.loadExpenseIncomeSum());
        setSubmitted(false);
        seetModel({
          ...EMPTY_MODEL,
          paymentDate: model.paymentDate,
          bankAccountId: model.bankAccountId,
        });
      });
    }
  }

  function onChange(field, value) {
    let newModel = Object.assign({}, model);
    newModel[field] = value;
    seetModel(newModel);
    let newErrors = runValidations(newModel, validationRules);
    setErrors(newErrors);
  }

  return (
    <OffCanva visible={visible} onDismiss={onDismiss}>
      <form
        onSubmit={onSubmit}
        className={classNames("flex", "flex-column", { submitted: submitted })}
      >
        <div className="titlebar">
          <h3>Registering DY Received</h3>
        </div>
        <div
          className={classNames("form-group", "padding-h", "flex-1", {
            error: errors.bankAccountId,
          })}
        >
          <label htmlFor="bankAccountId">Account</label>
          <select
            type="text"
            name="bankAccountId"
            value={model.bankAccountId}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          >
            <option value="" defaultValue>
              Select
            </option>
            {bankAccountList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.description}
              </option>
            ))}
          </select>
          <small>{errors.bankAccountId}</small>
        </div>
        <div className="flex flex-row">
          <div
            className={classNames("form-group", "padding-h", "w200", {
              error: errors.paymentDate,
            })}
          >
            <label htmlFor="paymentDate">Date</label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              name="paymentDate"
              value={model.paymentDate}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
            <small>{errors.paymentDate}</small>
          </div>
          <div
            className={classNames("form-group", "padding-h", "flex-1", {
              error: errors.symbol,
            })}
          >
            <label htmlFor="symbol">Symbol</label>
            <input
              type="text"
              name="symbol"
              value={model.symbol}
              onChange={(e) =>
                onChange(e.target.name, e.target.value.toUpperCase())
              }
            />
            <small>{errors.symbol}</small>
          </div>
        </div>
        <div className="flex flex-row">
          <div
            className={classNames("form-group", "padding-h", "flex-1", {
              error: errors.amount,
            })}
          >
            <label htmlFor="amount">Amount</label>
            <input
              type="text"
              name="amount"
              value={model.amount}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
            <small>{errors.amount}</small>
          </div>
          <div className="form-group padding-h">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="text"
              name="quantity"
              value={model.quantity}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
          </div>
        </div>
        <div
          className={classNames("form-group", "padding-h", "flex-1", {
            error: errors.yieldType,
          })}
        >
          <label htmlFor="Yield Type">Yield Type</label>
          <select
            name="yieldType"
            id="yieldType"
            value={model.yieldType}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          >
            <option value="" disabled selected>
              Select
            </option>
            <option value="JCP">JCP</option>
            <option value="DIVIDEND_YIELD">Dividend Yield</option>
            <option value="RENDIMENT">Rendiment</option>
          </select>
          <small>{errors.yieldType}</small>
        </div>
        <div className="buttons" style={{ alignSelf: "flex-end" }}>
          <button type="submit">
            <i className="bx bx-save"></i>Save
          </button>
          <button className="default" onClick={onDismiss} type="button">
            <i className="bx bx-hide"></i>Done
          </button>
        </div>
      </form>
    </OffCanva>
  );
}

export default DividendYieldInstance;
