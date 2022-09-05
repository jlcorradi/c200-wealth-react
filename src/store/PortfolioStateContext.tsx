import moment from "moment";
import React, { Dispatch, useState } from "react";
import { ArrayHelper } from "../Helpers";
import { PortfolioService } from "../services/PortfolioService";
import QueryService from "../services/QueryService";

const usePortfolio = () => {
  const [summary, setSummary] = useState<{
    totalCurrent: number;
    totalInvested: number;
    totalCurrentStocks: number;
    totalInvestedFII: number;
    totalCurrentFII: number;
    totalInvestedStocks: number;
  }>({
    totalCurrent: 0,
    totalInvested: 0,
    totalCurrentStocks: 0,
    totalInvestedFII: 0,
    totalCurrentFII: 0,
    totalInvestedStocks: 0,
  });

  const [stocks, setStocks] = useState<any[]>([]);
  const [fiis, setFiis] = useState<any[]>([]);
  const [bySector, setBySector] = useState<any[]>([]);
  const [dyMonthTD, setDyMonthTD] = useState<number>(0);
  const [dyYearTD, setDyYearTD] = useState<number>(0);

  function load() {
    QueryService.sum("DividendYieldEntity", "amount", {
      paymentDate: [
        moment().startOf("month").format("DD/MM/YYYY"),
        moment().endOf("month").format("DD/MM/YYYY"),
      ],
    }).then(({ data }) => setDyMonthTD(data));

    PortfolioService.getPortfolio().then(({ data }) => {
      setSummary({
        totalCurrent: data.totalCurrent,
        totalInvested: data.totalInvested,
        totalCurrentStocks: data.totalCurrentStocks,
        totalInvestedFII: data.totalInvestedFII,
        totalCurrentFII: data.totalCurrentFII,
        totalInvestedStocks: data.totalInvestedStocks,
      });

      // @ts-ignore
      let bySectorArray = Object.keys(bySector).map((symbol) => ({
        symbol,
        // @ts-ignore
        currentAmount: bySector[data.bySector],
      }));

      setStocks(data.stocks);
      setFiis(data.fiis);
      setBySector(ArrayHelper.sortDescending(bySectorArray, "currentAmount"));

      QueryService.sum("DividendYieldEntity", "amount", {
        paymentDate: [
          moment().startOf("month").format("DD/MM/YYYY"),
          moment().endOf("month").format("DD/MM/YYYY"),
        ],
      }).then(({ data }) => setDyMonthTD(data));

      QueryService.sum("DividendYieldEntity", "amount", {
        paymentDate: [
          moment().startOf("year").format("DD/MM/YYYY"),
          moment().format("DD/MM/YYYY"),
        ],
      }).then(({ data }) => setDyYearTD(data));
    });
  }

  React.useEffect(() => {
    load();
  }, []);

  return {
    state: {
      summary,
      stocks,
      fiis,
      bySector,
      dyMonthTD,
      dyYearTD,
    },
    actions: {
      load,
    },
  };
};

export type PortfolioType = ReturnType<typeof usePortfolio>;

const PortfolioContext = React.createContext<PortfolioType>(
  {} as unknown as PortfolioType
);

export const PortfolioContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const ctx = usePortfolio();

  return (
    <PortfolioContext.Provider value={ctx}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioStateContext = () =>
  React.useContext(PortfolioContext);
