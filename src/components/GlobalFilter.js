import React, { useEffect, useState } from 'react'
import BankAccountService from '../services/BankAccountServices';
import KeyValuePairService from '../services/KeyValuePairService';
import OffCanva from '../template/OffCanva'

function GlobalFilter({ filter, supportedFields, visible, onChange: onChangeFilter, onDismiss }) {

    const supportedFieldList = supportedFields.split(",");
    const [model, setModel] = useState({});

    const [accountList, setAccountList] = useState([]);
    const [expenseIncomeCategoryList, setExpenseIncomeCategoryList] = useState([]);

    useEffect(() => {
        BankAccountService.list()
            .then(response => setAccountList(response.data));
        KeyValuePairService.listExpenseIncomeCategories()
            .then(response => setExpenseIncomeCategoryList(response.data));
        setModel({...filter});
    }, []);

    function onSubmit(e) {
        e.preventDefault();
        if (JSON.stringify(filter) !== JSON.stringify(model)) {
            onChangeFilter(model);
        } else {
            if (onDismiss) {
                onDismiss()
            } else {
                console.log("Dismiss event is not being handled.");
            }
        }
    }

    function onChange(field, value) {
        let newModel = Object.assign({}, model);
        if (!value) {
            delete newModel[field];
        } else {
            newModel[field] = value;
        }
        setModel(newModel);
    }

    function isSupported(field) {
        return supportedFieldList.includes(field);
    }

    return (
        <OffCanva visible={visible} onDismiss={onDismiss}>
            <form onSubmit={onSubmit} className="padding flex-1 flex flex-column justify-content-space-between" style={{ height: "100%" }}>
                <div className="titlebar"><h3>Filters</h3></div>
                <div className="flex flex-1 flex-column">
                    {isSupported("bankAccountId") && <div className="form-group padding">
                        <label htmlFor="bankAccountId">Account</label>
                        <select type="text" name="bankAccountId" value={model.bankAccountId}
                            onChange={(e) => onChange(e.target.name, e.target.value)}>
                            <option value="" defaultValue>Select</option>
                            {accountList.map((a) => <option key={a.id} value={a.id}>{a.description}</option>)}
                        </select>
                    </div>}

                    {isSupported("symbol") && <div className="form-group padding">
                        <label htmlFor="symbol">Symbol</label>
                        <input type="text" name="symbol" value={model.symbol} onChange={(e) => onChange(e.target.name, e.target.value.toUpperCase())} />
                    </div>}

                    {isSupported("dateInterval") && <div className="flex flex-row">
                        <div className="form-group padding flex-1">
                            <label htmlFor="dateIni">From</label>
                            <input type="text" name="dateIni" value={model.dateIni} onChange={(e) => onChange(e.target.name, e.target.value)} />
                        </div>
                        <div className="form-group padding flex-1">
                            <label htmlFor="dateEnd">To</label>
                            <input type="text" name="dateEnd" value={model.dateEnd} onChange={(e) => onChange(e.target.name, e.target.value)} />
                        </div>
                    </div>}

                    {isSupported("stockOperationType") && <div className="form-group padding">
                        <label htmlFor="stockOperationType">Operation</label>
                        <select type="text" name="stockOperationType" value={model.stockOperationType}
                            onChange={(e) => onChange(e.target.name, e.target.value)}>
                            <option value="" defaultValue>Select</option>
                            <option value="PURCHASE">Purchase</option>
                            <option value="SELL">Sell</option>
                        </select>
                    </div>}

                    {isSupported("paymentType") && <div className="form-group padding">
                        <label htmlFor="paymentType">Type</label>
                        <select type="text" name="paymentType" value={model.paymentType}
                            onChange={(e) => onChange(e.target.name, e.target.value)}>
                            <option value="" defaultValue>Select</option>
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </div>}

                    {isSupported("expenseIncomeStatus") && <div className="form-group padding">
                        <label htmlFor="expenseIncomeStatus">Status</label>
                        <select type="text" name="expenseIncomeStatus" value={model.expenseIncomeStatus}
                            onChange={(e) => onChange(e.target.name, e.target.value)}>
                            <option value="" defaultValue>Select</option>
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>}

                    {isSupported("expenseIncomeCategoryId") && <div className="form-group padding">
                        <label htmlFor="expenseIncomeCategoryId">Category</label>
                        <select type="text" name="expenseIncomeCategoryId" value={model.expenseIncomeCategoryId}
                            onChange={(e) => onChange(e.target.name, e.target.value)}>
                            <option value="" defaultValue>Select</option>
                            {expenseIncomeCategoryList.map((item) => <option key={item.id} value={item.id}>{item.description}</option>)}
                        </select>
                    </div>}

                    {isSupported("description") && <div className="flex flex-row">
                        <div className="form-group padding flex-1">
                            <label htmlFor="description">Description</label>
                            <input type="text" name="description" value={model.description} onChange={(e) => onChange(e.target.name, e.target.value)} />
                        </div>
                    </div>}

                </div>
                <div className="buttons">
                    <button type="submit" onClick={onSubmit}><i className='bx bx-check-double' ></i>Apply Filters</button>
                </div>
            </form>
        </OffCanva>
    )
}

export default GlobalFilter
