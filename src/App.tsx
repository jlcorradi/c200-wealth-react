import "./App.css";
// @ts-ignore
import { useGlobalState } from "./store/GlobalStateContext";
// @ts-ignore
import {SpaTemplate} from "./template/SpaTemplate";
// @ts-ignore
import {LoginView} from "./views/LoginView";
// @ts-ignore
import NotificationContainer from "react-notifications/lib/NotificationContainer";
// @ts-ignore
import { DividendYieldStateContextProvider } from "./store/DividendYieldStateContext";
// @ts-ignore
import { PortfolioTemplateContextProvider } from "./store/PortfolioTemplateContext";
// @ts-ignore
import { RecurringExpenseIncomeContextProvider } from "./store/RecurringExpenseIncomeContext";
// @ts-ignore
import { StockOperationContextProvider } from "./store/StockOperationStateContext";
// @ts-ignore
import { combineComponents } from "./store/CombineProviders";
// @ts-ignore
import { PortfolioContextProvider } from "./store/PortfolioStateContext";
import { WatchListContextProvider } from "./store/WatchListStateProvider";
import React from "react";

const providers = [
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
