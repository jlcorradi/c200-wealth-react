import "./App.css";
// @ts-ignore
import { useGlobalState } from "./store/GlobalStateContext";
// @ts-ignore
import SpaTemplate from "./template/SpaTemplate";
// @ts-ignore
import LoginView from "./views/LoginView";
// @ts-ignore
import NotificationContainer from "react-notifications/lib/NotificationContainer";
// @ts-ignore
import { DividendYieldStateContextProvider } from "./store/DividendYieldStateContext";
// @ts-ignore
import { ExpenseIncomeStateProvider } from "./store/ExpenseIncomeStateContext";
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
// @ts-ignore
import { DashboardContextProvider } from "./store/DashBoardStateContext";
import React from "react";

const providers = [
  DashboardContextProvider,
  DividendYieldStateContextProvider,
  ExpenseIncomeStateProvider,
  PortfolioTemplateContextProvider,
  RecurringExpenseIncomeContextProvider,
  StockOperationContextProvider,
  WatchListContextProvider,
  PortfolioContextProvider,
];

const CombinedProvider = combineComponents(...providers);

function App() {
  const [{ isAuthenticated }] = useGlobalState();

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

export default App;
