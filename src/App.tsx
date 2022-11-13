import "./App.css";
import { useGlobalState } from "./store/GlobalStateContext";
import {SpaTemplate} from "./template/SpaTemplate";
import {LoginView} from "./views/LoginView";
// @ts-ignore
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import { DividendYieldStateContextProvider } from "./store/DividendYieldStateContext";
// @ts-ignore
import { PortfolioTemplateContextProvider } from "./store/PortfolioTemplateContext";
// @ts-ignore
import { RecurringExpenseIncomeContextProvider } from "./store/RecurringExpenseIncomeContext";
import { StockOperationContextProvider } from "./store/StockOperationStateContext";
// @ts-ignore
import { combineComponents } from "./store/CombineProviders";
import { PortfolioContextProvider } from "./store/PortfolioStateContext";
import { WatchListContextProvider } from "./store/WatchListStateProvider";
import React from "react";
import { DashboardContextProvider } from "./store/DashBoardStateContext";

const providers = [
  DashboardContextProvider,
  DividendYieldStateContextProvider,
  PortfolioTemplateContextProvider,
  RecurringExpenseIncomeContextProvider,
  StockOperationContextProvider,
  WatchListContextProvider,
  PortfolioContextProvider,
];

const CombinedProvider = combineComponents(...providers);

export function App() {
  const {
    state: { isAuthenticated },
  } = useGlobalState();

  return (
    <>
      {isAuthenticated ? (
        <CombinedProvider>
          <SpaTemplate />
        </CombinedProvider>
      ) : (
        <LoginView />
      )}
      <NotificationContainer />
    </>
  );
}
