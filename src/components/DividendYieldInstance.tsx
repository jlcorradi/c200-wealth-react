import classNames from "classnames";
import React, { FC, SyntheticEvent, useEffect, useState } from "react";
import BankAccountService from "../services/BankAccountServices";
import DividendYieldService from "../services/DividendYieldService";
import {
  useDividendYieldStateContext,
  //@ts-ignore
} from "../store/DividendYieldStateContext";
import { useDashboardContext } from "../store/DashBoardStateContext";
import { usePortfolioStateContext } from "../store/PortfolioStateContext";
import OffCanva from "../template/OffCanva";
import {
  hasErrors,
  required,
  ruleRunner,
  runValidations,
} from "../Validatoion";
import { BankAccountEntity } from "../types/bank-account";
import {
  DividendYieldEntity,
  DividendYieldType,
} from "../types/dividend-yield";

const validationRules = [
  ruleRunner("bankAccountId", "BankAccount", required),
  ruleRunner("paymentDate", "Payment Date", required),
  ruleRunner("symbol", "Symbol", required),
  ruleRunner("yieldType", "Yield Type", required),
  ruleRunner("amount", "Amount", required),
];

const EMPTY_MODEL: DividendYieldEntity = {
  paymentDate: "",
  symbol: "",
  yieldType: DividendYieldType.Rendiment,
  quantity: 0,
  amount: 0.0,
  bankAccountId: -1,
};

export const DividendYieldInstance: FC<{
  visible: boolean;
  onDismiss: () => void;
}> = ({ visible, onDismiss }) => {
  const {
    state: { filter, hasMore, isLoading, page, totalAmount },
    actions: { loadData: loadDyList, setFilter, setOrder, setPage },
  } = useDividendYieldStateContext();
  const {
    actions: { load: loadPortfolio },
  } = usePortfolioStateContext();
  const { actions: dashboardActions } = useDashboardContext();

  const [model, seetModel] = useState<DividendYieldEntity>(EMPTY_MODEL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [bankAccountList, setBankAccountList] = useState<BankAccountEntity[]>(
    []
  );

  useEffect(() => {
    BankAccountService.getInvestmentAccounts().then(({ data }) =>
      setBankAccountList(data)
    );
  }, []);

  function onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setSubmitted(true);
    let newErrors = runValidations(model, validationRules);
    setErrors(newErrors);
    if (!hasErrors(newErrors)) {
      DividendYieldService.create(model).then(() => {
        loadDyList();
        loadPortfolio();
        dashboardActions.markToReload();
        setSubmitted(false);
        seetModel({
          ...EMPTY_MODEL,
          paymentDate: model.paymentDate,
          bankAccountId: model.bankAccountId,
        });
      });
    }
  }

  function onChange(field: string, value: any) {
    let newModel: any = Object.assign({}, model);
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
            {bankAccountList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.description}
              </option>
            ))}
          </select>
          <small>{(errors as any).bankAccountId}</small>
        </div>
        <div className="flex flex-row">
          <div
            className={classNames("form-group", "padding-h", "w200", {
              error: (errors as any).paymentDate,
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
            <small>{(errors as any).paymentDate}</small>
          </div>
          <div
            className={classNames("form-group", "padding-h", "flex-1", {
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
        </div>
        <div className="flex flex-row">
          <div
            className={classNames("form-group", "padding-h", "flex-1", {
              error: (errors as any).amount,
            })}
          >
            <label htmlFor="amount">Amount</label>
            <input
              type="text"
              name="amount"
              value={model.amount}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
            <small>{(errors as any).amount}</small>
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
            error: (errors as any).yieldType,
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
          <small>{(errors as any).yieldType}</small>
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
};

export default DividendYieldInstance;
