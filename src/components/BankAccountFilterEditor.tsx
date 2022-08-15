import React from "react";
import { BankAccountCombo } from "./BankAccountCombo";

export const BankAccountFilterEditor: React.FC<{
  fieldFilterValue: string;
  onChange: (value: string[]) => void;
}> = ({ fieldFilterValue, onChange }) => {
  const [value] = fieldFilterValue ? fieldFilterValue : [""];

  return (
    <div className="w400 padding">
      <BankAccountCombo value={value} onChange={(id) => onChange([id])} />
    </div>
  );
};

export default BankAccountFilterEditor;
