import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import QueryService from "../services/QueryService";
import { StockWatchListEntity } from "../types/stock";

export const useWatchList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [watchListList, setWatchListList] = useState<StockWatchListEntity[]>(
    []
  );

  async function reload() {
    setIsLoading(true);
    try {
      const { data } = await QueryService.query<StockWatchListEntity>(
        "StockWatchListEntity",
        {},
        "stock.symbol(ASC)"
      );

      setWatchListList(data.content);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  return {
    state: { isLoading, watchListList },
    actions: { reload },
  };
};

type TWatchListContext = ReturnType<typeof useWatchList>;

const WatchListContext = React.createContext<TWatchListContext>(
  {} as unknown as TWatchListContext
);

export const WatchListContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const watchListContext = useWatchList();

  return (
    <WatchListContext.Provider value={watchListContext}>
      {children}
    </WatchListContext.Provider>
  );
};

export const useWatchListContext = () => React.useContext(WatchListContext);
