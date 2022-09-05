import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import React from "react";
import moment from "moment";
import QueryService from "../services/QueryService";
import { StockOperationEntity } from "../types/stock";

const useStockOperation = () => {
  const [operationList, setoperationList] = useState<StockOperationEntity[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [order, setOrder] = useState<string>("operationDate(asc)");
  const [filter, setFilter] = useState<any>({
    operationDate: [
      moment().startOf("month").format("DD/MM/YYYY"),
      moment().endOf("month").format("DD/MM/YYYY"),
    ],
  });

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await QueryService.query<StockOperationEntity>(
        "StockOperationEntity",
        filter,
        order,
        page,
        20
      );
      if (page === 0) {
        setoperationList(result.data.content);
      } else {
        setoperationList([...operationList, ...result.data.content]);
      }
      setTotalElements(result.data.totalElements);
      setHasMore(!result.data.empty);

      loadTotal();
    } finally {
      setIsLoading(false);
    }
  }

  async function loadTotal() {
    let total = await QueryService.sumCustom(
      "StockOperationEntity",
      "sum(e.quantity * e.price * case(e.operationType) when 'SELL' then -1 else 1 end)",
      filter
    );
    setTotalAmount(total.data);
  }

  useEffect(() => {
    loadData();
  }, [filter, page, order]);

  useEffect(() => {
    loadTotal();
  }, [filter]);

  return {
    state: {
      isLoading,
      hasMore,
      totalAmount,
      totalElements,
      page,
      filter,
      order,
      operationList,
    },
    actions: {
      changeFilter: (newFilter: any) => {
        setPage(0);
        setFilter({ ...newFilter });
      },
      loadData,
      setOrder,
      setPage,
    },
  };
};

export type StockOperationType = ReturnType<typeof useStockOperation>;

const StockOperationContext = createContext<StockOperationType>(
  {} as unknown as StockOperationType
);

export const StockOperationContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const ctx = useStockOperation();

  return (
    <StockOperationContext.Provider value={ctx}>
      {children}
    </StockOperationContext.Provider>
  );
};

export const useStockOperationContext = () => useContext(StockOperationContext);
