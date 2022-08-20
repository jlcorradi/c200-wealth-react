import React, { FC } from "react";

export const CustomCombo: FC<{
  itemsArray: any[];
  value: any;
  className?: string;
  label?: string;
  errorObject?: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}> = ({
  itemsArray,
  value,
  className,
  label,
  errorObject,
  onChange,
  disabled = false,
}) => {
  return (
    <>
      {label && <label htmlFor="bankAccountId">{label}</label>}
      <select
        data-type="text"
        name="bankAccountId"
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" selected>
          Select
        </option>
        {itemsArray.map((a) => (
          <option key={a.key} value={a.key}>
            {a.label}
          </option>
        ))}
      </select>
      {errorObject && <small>{errorObject}</small>}
    </>
  );
};

export default CustomCombo;
