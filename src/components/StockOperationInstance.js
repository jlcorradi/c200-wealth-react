import classNames from 'classnames';
import React, {useEffect, useState} from 'react';
import BankAccountService from '../services/BankAccountServices';
import StockOperationService from '../services/StockOperationService';
import {hasErrors, required, ruleRunner, runValidations} from '../Validatoion';
import {load as loadPortfolio, usePortfolioStateContext} from '../store/PortfolioStateContext';

const EMPTY_MODEL = {
  id: '',
  operationDate: '',
  bankAccountId: '',
  symbol: '',
  price: 0.0,
  quantity: 0,
  total: 0,
};

const validationRules = [
  ruleRunner('operationType', 'Operation Type', required),
  ruleRunner('operationDate', 'Operation Date', required),
  ruleRunner('bankAccountId', 'Bank Account', required),
  ruleRunner('symbol', 'Stock Symbol', required),
  ruleRunner('price', 'Price', required),
  ruleRunner('quantity', 'Quantity', required),
];

function StockOperationInstance({onSave, onHide}) {
  const [submitted, setSubmitted] = useState(false);
  const [model, setModel] = useState(EMPTY_MODEL);
  const [errors, setErrors] = useState({});
  const [accounts, setAccounts] = useState([]);

  const [, dispatchPortfolioEvent] = usePortfolioStateContext();

  useEffect(() => {
    BankAccountService.getInvestmentAccounts().then((response) => setAccounts(response.data));
  }, []);

  function onSubmit(e) {
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

  function onChange(field, value) {
    let updatedModel = Object.assign({}, model);
    updatedModel[field] = value;
    setModel(updatedModel);
    setErrors(runValidations(updatedModel, validationRules));
  }

  return (
    <form onSubmit={onSubmit} className={classNames('flex', 'flex-column', {submitted: submitted})}>
      <div className="flex flex-row">
        <div className={classNames('form-group', 'w150', {error: errors.operationDate})}>
          <label htmlFor="operationDate">Date</label>
          <input
            type="text"
            name="operationDate"
            value={model.operationDate}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
          <small>{errors.operationDate}</small>
        </div>
        <div className={classNames('form-group', 'margin-left', 'flex-1', {error: errors.operationType})}>
          <label htmlFor="operationType">Operation</label>
          <select
            type="text"
            name="operationType"
            value={model.operationType}
            onChange={(e) => onChange(e.target.name, e.target.value)}>
            <option value="" defaultValue>
              Select
            </option>
            <option value="PURCHASE">Purchase</option>
            <option value="SELL">Sell</option>
          </select>
          <small>{errors.operationType}</small>
        </div>
      </div>
      <div className="flex flex-row">
        <div className={classNames('form-group', 'w150', {error: errors.symbol})}>
          <label htmlFor="symbol">Symbol</label>
          <input
            type="text"
            name="symbol"
            value={model.symbol}
            onChange={(e) => onChange(e.target.name, e.target.value.toUpperCase())}
          />
          <small>{errors.symbol}</small>
        </div>
        <div className={classNames('form-group', 'margin-left', 'flex-1', {error: errors.bankAccountId})}>
          <label htmlFor="bankAccountId">Account</label>
          <select
            type="text"
            name="bankAccountId"
            value={model.bankAccountId}
            onChange={(e) => onChange(e.target.name, e.target.value)}>
            <option value="" defaultValue>
              Select
            </option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.description}
              </option>
            ))}
          </select>
          <small>{errors.bankAccountId}</small>
        </div>
      </div>
      <div className="flex flex-row">
        <div className={classNames('form-group', 'flex-1', 'w150', {error: errors.price})}>
          <label htmlFor="price">Price</label>
          <input
            type="text"
            name="price"
            value={model.price}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
          <small>{errors.price}</small>
        </div>
        <div className={classNames('form-group', 'margin-left', 'w150', {error: errors.quantity})}>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="text"
            name="quantity"
            value={model.quantity}
            onChange={(e) => onChange(e.target.name, e.target.value)}
          />
          <small>{errors.quantity}</small>
        </div>
        <div className={classNames('form-group', 'margin-left', 'w150', {error: errors.quantity})}>
          <label htmlFor="quantity">Total</label>
          <input type="text" name="total" value={(model.quantity * model.price).toFixed(2)} />
        </div>
      </div>

      <div className="buttons">
        <button type="submit">Register</button>
      </div>
    </form>
  );
}

export default StockOperationInstance;
