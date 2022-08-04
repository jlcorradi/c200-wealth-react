import React, { useEffect, useState } from 'react'
import BankAccountInstance from '../components/BankAccountInstance';
import LoaderAndEmptyWrapper from '../components/LoaderAndEmptyWrapper';
import { http } from '../Http';
import BankAccountService from '../services/BankAccountServices';
import OffCanva from '../template/OffCanva';

function BankAccountsView() {
    useEffect(loadAccounts, []);
    let [list, setList] = useState([]);
    let [isUpdating, setIsUpdating] = useState(false);
    let [idToUpdate, setIdToUpdate] = useState('new');
    let [isLoading, setIsLoading] = useState(false);
    useEffect(loadAccounts, [isUpdating]);

    function loadAccounts() {
        setIsLoading(true);
        http.get("/api/v1/bank_accounts")
            .then(response => setList([...response.data]))
            .finally(() => setIsLoading(false));
    }

    function instanceOnUpdate(id) {
        setIdToUpdate(id);
        setIsUpdating(true);
    }

    return (
        <>
            <div className="titlebar">
                <h3>Bank Accounts</h3>
                <div className="buttons">
                    <a href="#new" onClick={(e) => {
                        e.preventDefault();
                        setIdToUpdate('new');
                        setIsUpdating(true);
                    }}><i className='bx bx-add-to-queue' ></i>Create Account</a>
                </div>
            </div>

            <div className="box shadow">
                <div className="flex flew-row">
                    <div className="flex-column padding flex-1 border-right">
                        <LoaderAndEmptyWrapper isLoading={isLoading} isEmpty={!list.length}>
                            {list.map((account) => <AccountItem updateClick={instanceOnUpdate} key={account.number} {...account} />)}
                        </LoaderAndEmptyWrapper>
                    </div>
                </div>
            </div>

            <OffCanva visible={isUpdating} onDismiss={() => setIsUpdating(false)}>
                <BankAccountInstance id={idToUpdate} onUpdate={() => {
                    setIsUpdating(false);
                    loadAccounts();
                }} />
            </OffCanva>
        </>
    )
}

const AccountItem = ({ updateClick, id, number, description, active }) => {
    return (
        <div className="flex flex-row align-items-space-between" style={{ padding: '10px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
            <div className="flex flex-column">
                <strong>#{number}</strong>
                <span>{description}</span>
                <span><button onClick={(e) => {
                    e.preventDefault();
                    BankAccountService.setDefaultPaier(id);
                }}><i className='bx bxs-calendar-check' ></i> Mark as Default Payment Account</button></span>
            </div>
            <div className="buttons">
                <a href="#update" onClick={(e) => {
                    e.preventDefault();
                    updateClick(id);
                }}><i className='bx bx-pencil' ></i>Update</a>
            </div>
        </div>
    )
}

export default BankAccountsView
