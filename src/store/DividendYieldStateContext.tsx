import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import moment from "moment";
import QueryService from "../services/QueryService";
import { DividendYieldEntity } from "../types/dividend-yield";

const useDY = () => {
  const [filter, setFilter] = useState<any>({
    paymentDate: [
      moment().startOf("month").format("DD/MM/YYYY"),
      moment().endOf("month").format("DD/MM/YYYY"),
    ],
  });
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [dividendYieldList, setDividendYieldList] = useState<
    DividendYieldEntity[]
  >([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  async function loadData() {
    setIsLoading(true);
    try {
      const dyQueryResponse = await QueryService.query<DividendYieldEntity>(
        "DividendYieldEntity",
        filter,
        order,
        page,
        30
      );
      const dyTotalResponse = await QueryService.sum(
        "DividendYieldEntity",
        "quantity*amount",
        filter
      );
      setTotalAmount(dyTotalResponse.data);
      setHasMore(!dyQueryResponse.data.last);
      setDividendYieldList(
        page !== 0
          ? [...dividendYieldList, ...dyQueryResponse.data.content]
          : dyQueryResponse.data.content
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setPage(0);
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [page, filter, order]);

  return {
    state: {
      filter,
      page,
      isLoading,
      totalAmount,
      hasMore,
      dividendYieldList,
      order,
    },
    actions: { loadData, setFilter, setOrder, setPage },
  };
};

export type DYContextType = ReturnType<typeof useDY>;

const DYContext = createContext<DYContextType>({} as unknown as DYContextType);

export const DividendYieldStateContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const value = useDY();
  return <DYContext.Provider value={value}>{children}</DYContext.Provider>;
};

export const useDividendYieldStateContext = () => useContext(DYContext);
