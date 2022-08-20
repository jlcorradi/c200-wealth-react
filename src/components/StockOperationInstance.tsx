import classNames from "classnames";
import React, { FC, SyntheticEvent, useEffect, useState } from "react";
import BankAccountService from "../services/BankAccountServices";
import StockOperationService from "../services/StockOperationService";
import {
  hasErrors,
  required,
  ruleRunner,
  runValidations,
} from "../Validatoion";
import {
  load as loadPortfolio,
  usePortfolioStateContext,
} from "../store/PortfolioStateContext";
import {
  StockOperationEntity,
  StockOperationType,
} from "../types/stock-operation";
import { BankAccountEntity } from "../types/bank-account";

const EMPTY_MODEL: StockOperationEntity = {
  operationDate: "",
  bankAccountId: -1,
  operationType: StockOperationType.Purchase,
  symbol: "",
  price: 0.0,
  quantity: 0,
  total: 0,
};

const validationRules = [
  ruleRunner("operationType", "Operation Type", required),
  ruleRunner("operationDate", "Operation Date", required),
  ruleRunner("bankAccountId", "Bank Account", required),
  ruleRunner("symbol", "Stock Symbol", required),
  ruleRunner("price", "Price", required),
  ruleRunner("quantity", "Quantity", required),
];

export const StockOperationInstance: FC<{
  onSave: (entity: StockOperationEntity) => void;
  onHide: () => void;
}> = ({ onSave }) => {
  const [submitted, setSubmitted] = useState(false);
  const [model, setModel] = useState(EMPTY_MODEL);
  const [errors, setErrors] = useState({});
  const [accounts, setAccounts] = useState<BankAccountEntity[]>([]);

  const a = usePortfolioStateContext();

  const { dispatch: dispatchPortfolioEvent } = usePortfolioStateContext();

  useEffect(() => {
    BankAccountService.getInvestmentAccounts().then((response) =>
      setAccounts(response.data)
    );
  }, []);

  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);
    let newErrors = runValidations(model, validationRules);
    setErrors(newErrors);
    if (!hasErrors(newErrors)) {
      StockOperationService.create(model).then(() => {
        if (onSave) {
          onSave(model);
        }
        dispatchPortfolioEvent(loadPortfolio());
        setModel({
          ...EMPTY_MODEL,
          operationType: model.operationType,
          bankAccountId: model.bankAccountId,
          operationDate: model.operationDate,
        });
        setSubmitted(false);
      });
    }
  }

  function onChange(field: string, value: any) {
    let updatedModel = Object.assign({}, model) as StockOperationEntity;
    (updatedModel as any)[field] = value;
    setModel(updatedModel);
    setErrors(runValidations(updatedModel, validationRules));
  }

  return (
    <form
      onSubmit={onSubmit}
      className={classNames("flex", "flex-column", { submitted: submitted })}
    >
      <div className="flex flex-row">
        <div
          className={classNames("form-group", "w150", {
            error: (errors as any).operationDate,
          })}
        >
          <label htmlFor="operationDate">Date</label>
          <input
            type="text"
            name="operationDate"
            value={model.operationDate}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
          <small>{(errors as any).operationDate}</small>
        </div>
        <div
          className={classNames("form-group", "margin-left", "flex-1", {
            error: (errors as any).operationType,
          })}
        >
          <label htmlFor="operationType">Operation</label>
          <select
            data-type="text"
            name="operationType"
            value={model.operationType}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          >
            <option value="" data-defaultValue>
              Select
            </option>
            <option value="PURCHASE">Purchase</option>
            <option value="SELL">Sell</option>
          </select>
          <small>{(errors as any).operationType}</small>
        </div>
      </div>
      <div className="flex flex-row">
        <div
          className={classNames("form-group", "w150", {
            error: (errors as any).symbol,
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
          <small>{(errors as any).symbol}</small>
        </div>
        <div
          className={classNames("form-group", "margin-left", "flex-1", {
            error: (errors as any).bankAccountId,
          })}
        >
          <label htmlFor="bankAccountId">Account</label>
          <select
            data-type="text"
            name="bankAccountId"
            value={model.bankAccountId}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          >
            <option value="" data-defaultValue>
              Select
            </option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.description}
              </option>
            ))}
          </select>
          <small>{(errors as any).bankAccountId}</small>
        </div>
      </div>
      <div className="flex flex-row">
        <div
          className={classNames("form-group", "flex-1", "w150", {
            error: (errors as any).price,
          })}
        >
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            value={model.price}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
          <small>{(errors as any).price}</small>
        </div>
        <div
          className={classNames("form-group", "margin-left", "w150", {
            error: (errors as any).quantity,
          })}
        >
          <label htmlFor="quantity">Quantity</label>
          <input
            type="text"
            name="quantity"
            value={model.quantity}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
          <small>{(errors as any).quantity}</small>
        </div>
        <div
          className={classNames("form-group", "margin-left", "w150", {
            error: (errors as any).quantity,
          })}
        >
          <label htmlFor="quantity">Total</label>
          <input
            type="text"
            name="total"
            value={(model.quantity * model.price).toFixed(2)}
          />
        </div>
      </div>

      <div className="buttons">
        <button type="submit">Register</button>
      </div>
    </form>
  );
};

export default StockOperationInstance;
