import React from 'react';

function CustomCombo({
  itemsArray,
  value,
  className,
  label,
  errorObject,
  onChange,
  disabled
}) {
  return (
    <>
      {label && <label htmlFor="bankAccountId">{label}</label>}
      <select
        type="text"
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
}

export default CustomCombo;
