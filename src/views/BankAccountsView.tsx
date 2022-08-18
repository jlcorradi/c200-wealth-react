import React, { FC, useEffect, useState } from "react";
import { BankAccountInstance } from "../components/BankAccountInstance";
//@ts-ignore
import LoaderAndEmptyWrapper from "../components/LoaderAndEmptyWrapper";
import { http } from "../Http";
import BankAccountService from "../services/BankAccountServices";
import { OffCanva } from "../template/OffCanva";
import { BankAccountEntity } from "../types/bank-account";

export const BankAccountsView: FC<{}> = () => {
  let [list, setList] = useState<BankAccountEntity[]>([]);
  let [isUpdating, setIsUpdating] = useState<boolean>(false);
  let [idToUpdate, setIdToUpdate] = useState<string>("new");
  let [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadAccounts();
  }, [isUpdating]);

  async function loadAccounts() {
    setIsLoading(true);
    try {
      let response = await http.get<BankAccountEntity[]>(
        "/api/v1/bank_accounts"
      );
      setList(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  function instanceOnUpdate(id: string) {
    setIdToUpdate(id);
    setIsUpdating(true);
  }

  return (
    <>
      <div className="titlebar">
        <h3>Bank Accounts</h3>
        <div className="buttons">
          <a
            href="#new"
            onClick={(e) => {
              e.preventDefault();
              setIdToUpdate("new");
              setIsUpdating(true);
            }}
          >
            <i className="bx bx-add-to-queue"></i>Create Account
          </a>
        </div>
      </div>

      <div className="box shadow">
        <div className="flex flew-row">
          <div className="flex-column padding flex-1 border-right">
            <LoaderAndEmptyWrapper isLoading={isLoading} isEmpty={!list.length}>
              {list.map((account) => (
                <AccountItem
                  updateClick={instanceOnUpdate}
                  key={account.number}
                  description={account.description}
                  id={account.id?.toString() ?? ""}
                  number={account.number}
                />
              ))}
            </LoaderAndEmptyWrapper>
          </div>
        </div>
      </div>

      <OffCanva visible={isUpdating} onDismiss={() => setIsUpdating(false)}>
        <BankAccountInstance
          id={idToUpdate}
          onUpdate={() => {
            setIsUpdating(false);
            loadAccounts();
          }}
        />
      </OffCanva>
    </>
  );
};

const AccountItem: FC<{
  updateClick: (id: string) => void;
  id: string;
  number: string;
  description: string;
}> = ({ updateClick, id, number, description }) => {
  return (
    <div
      className="flex flex-row align-items-space-between"
      style={{ padding: "10px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex flex-column">
        <strong>#{number}</strong>
        <span>{description}</span>
        <span>
          <button
            onClick={(e) => {
              e.preventDefault();
              BankAccountService.setDefaultPaier(id);
            }}
          >
            <i className="bx bxs-calendar-check"></i> Mark as Default Payment
            Account
          </button>
        </span>
      </div>
      <div className="buttons">
        <a
          href="#update"
          onClick={(e) => {
            e.preventDefault();
            updateClick(id);
          }}
        >
          <i className="bx bx-pencil"></i>Update
        </a>
      </div>
    </div>
  );
};
