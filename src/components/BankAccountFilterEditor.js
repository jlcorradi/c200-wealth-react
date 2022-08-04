import React from 'react';
import BankAccountCombo from './BankAccountCombo';

function BankAccountFilterEditor({fieldFilterValue, onChange}) {
  const [value] = fieldFilterValue ? fieldFilterValue : [''];

  return (
    <div className="w400 padding">
      <BankAccountCombo value={value} onChange={(id) => onChange([id])} />
    </div>
  );
}

export default BankAccountFilterEditor;
