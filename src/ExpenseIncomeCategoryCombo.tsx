import React, { FC } from "react";
import { CustomCombo } from "./components/CustomCombo";
import KeyValuePairService from "./services/KeyValuePairService";

export const ExpenseIncomeCategoryCombo: FC<{
  className?: string;
  value: any;
  disabled?: boolean;
  onChange: (value: any) => void;
}> = ({ className, value, disabled, onChange }) => {
  const [categories, setCategories] = React.useState<
    { key: number; label: string }[]
  >([]);

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
};

export default ExpenseIncomeCategoryCombo;
