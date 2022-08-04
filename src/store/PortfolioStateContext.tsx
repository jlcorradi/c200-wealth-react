import React from "react";
import { ArrayHelper } from "../Helpers";
import PortfolioService from "../services/PortfolioService";

type Action = "LOAD" | "SET_SUMMARY" | "SET_PORTFOLIO";

export interface PortfolioAction {
  type: Action;
  payload: any;
}

const PortfolioContext = React.createContext<any | null>(null);

export const load = () => ({ action: "LOAD" });

const portfolioInitialState = {
  portfolioLoadPending: true,
  summary: {
    totalCurrent: 0.0,
    totalInvested: 0.0,
    totalCurrentStocks: 0.0,
    totalInvestedFII: 0.0,
    totalCurrentFII: 0.0,
    totalInvestedStocks: 0.0,
  },
  stocks: [],
  fiis: [],
  bySector: [],
};

const portfolioReducer = (state: any, { type, payload }: PortfolioAction) => {
  switch (type) {
    case "LOAD":
      return { ...state, portfolioLoadPending: true };
    case "SET_SUMMARY":
      return { ...state, summary: payload, portfolioLoadPending: false };
    case "SET_PORTFOLIO":
      return { ...state, portfolioLoadPending: false, ...payload };
    default:
      return state;
  }
};

export const PortfolioContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(
    portfolioReducer,
    portfolioInitialState
  );
  let { portfolioLoadPending } = state;

  React.useEffect(() => {
    if (portfolioLoadPending) {
      PortfolioService.getPortfolio().then(({ data }) => {
        dispatch({
          type: "SET_SUMMARY",
          payload: {
            totalCurrent: data.totalCurrent,
            totalInvested: data.totalInvested,
            totalCurrentStocks: data.totalCurrentStocks,
            totalInvestedFII: data.totalInvestedFII,
            totalCurrentFII: data.totalCurrentFII,
            totalInvestedStocks: data.totalInvestedStocks,
          },
        });

        let { stocks, fiis, bySector } = data;
        let bySectorArray = Object.keys(bySector).map((symbol) => ({
          symbol,
          currentAmount: bySector[symbol],
        }));
        dispatch({
          type: "SET_PORTFOLIO",
          payload: {
            stocks,
            fiis,
            bySector: ArrayHelper.sortDescending(
              bySectorArray,
              "currentAmount"
            ),
          },
        });
      });
    }
  }, [portfolioLoadPending]);

  return (
    <PortfolioContext.Provider value={[state, dispatch]}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioStateContext = () =>
  React.useContext(PortfolioContext);
