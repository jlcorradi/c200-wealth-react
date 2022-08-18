import React, { useState } from "react";
import BankAccountService from "../services/BankAccountServices";
import { BankAccountEntity } from "../types/bank-account";

export const BankAccountCombo: React.FC<{
  label?: string;
  value: string;
  errorObject?: any;
  onChange: (value: string) => void;
}> = ({ label, value, errorObject, onChange }) => {
  const [bankAccountList, setBankAccountList] = useState<BankAccountEntity[]>(
    []
  );

  async function loadList() {
    const list = await BankAccountService.list();
    setBankAccountList(list);
  }

  React.useEffect(() => {
    loadList();
  }, []);

  return (
    <>
      {label && <label htmlFor="bankAccountId">{label}</label>}
      <select
        name="bankAccountId"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" selected>
          Select
        </option>
        {bankAccountList.map((a) => (
          <option key={a.id} value={a.id}>
            {a.description}
          </option>
        ))}
      </select>
      {errorObject && <small>{errorObject}</small>}
    </>
  );
};
