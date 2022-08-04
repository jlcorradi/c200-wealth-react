import React, {useState} from 'react';
import BankAccountService from '../services/BankAccountServices';

function BankAccountCombo({label, value, errorObject, onChange}) {
  const [bankAccountList, setBankAccountList] = useState([]);

  React.useEffect(() => {
    BankAccountService.list().then(({data}) => setBankAccountList(data));
  }, []);

  return (
    <>
      {label && <label htmlFor="bankAccountId">{label}</label>}
      <select type="text" name="bankAccountId" value={value} onChange={(e) => onChange(e.target.value)}>
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
}

export default BankAccountCombo;
