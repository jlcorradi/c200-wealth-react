import React from 'react';
import CustomCombo from './components/CustomCombo';
import KeyValuePairService from './services/KeyValuePairService';

function ExpenseIncomeCategoryCombo({
  className,
  value,
  disabled,
  onChange,
}) {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    KeyValuePairService.listExpenseIncomeCategories().then(({ data }) =>
      setCategories(data.map((c) => ({ key: c.id, label: c.description })))
    );
  }, []);

  return (
    <CustomCombo
      itemsArray={categories}
      className={className}
      onChange={onChange}
      value={value}
      disabled={disabled}
    ></CustomCombo>
  );
}

export default ExpenseIncomeCategoryCombo;
