import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import moment from "moment";
import { ExpenseIncomeEntity } from "../types/expense-income";
import { ExpenseIncomeService } from "../services/ExpenseIncomeService";

const useExpenseIncome = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [list, setList] = useState<ExpenseIncomeEntity[]>([]);
  const [filter, setFilter] = useState<any>({
    dateIni: moment().startOf("month").format("DD/MM/YYYY"),
    dateEnd: moment().endOf("month").format("DD/MM/YYYY"),
  });
  const [order, setOrder] = useState<string>("dueDate(DESC)");
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await ExpenseIncomeService.query(page, filter, order);
      setList(
        page === 0
          ? [...result.data.content]
          : [...list, ...result.data.content]
      );
      setHasMore(!result.data.empty);
    } finally {
      setIsLoading(false);
    }
  }

  function changeFilter(newFilter: any) {
    setFilter({ ...newFilter });
  }

  function nextPage() {
    setPage(page + 1);
  }

  useEffect(() => {
    loadData();
  }, [filter, order, page]);

  return {
    state: { isLoading, list, filter, order, page, hasMore },
    actions: { changeFilter, nextPage, setOrder, loadData },
  };
};

export type ExpenseIncomeContextType = ReturnType<typeof useExpenseIncome>;

const ExpenseIncomeStateContext = createContext<ExpenseIncomeContextType>(
  {} as unknown as ExpenseIncomeContextType
);

export const ExpenseIncomeStateProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const ctx = useExpenseIncome();
  return (
    <ExpenseIncomeStateContext.Provider value={ctx}>
      {children}
    </ExpenseIncomeStateContext.Provider>
  );
};

export const useExpenseIncomeStateContext = () =>
  useContext(ExpenseIncomeStateContext);
