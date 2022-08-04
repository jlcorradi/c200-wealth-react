import './App.css';
import {useGlobalState} from './store/GlobalStateContext';
import SpaTemplate from './template/SpaTemplate';
import LoginView from './views/LoginView';
import NotificationContainer from 'react-notifications/lib/NotificationContainer';
import {DividendYieldStateContextProvider} from './store/DividendYieldStateContext';
import {ExpenseIncomeStateProvider} from './store/ExpenseIncomeStateContext';
import {PortfolioTemplateContextProvider} from './store/PortfolioTemplateContext';
import {RecurringExpenseIncomeContextProvider} from './store/RecurringExpenseIncomeContext';
import {StockOperationContextProvider} from './store/StockOperationStateContext';
import {combineComponents} from './store/CombineProviders';
import {PortfolioContextProvider} from './store/PortfolioStateContext';
import WatchListStateProvider from './store/WatchListStateProvider';
import { DashboardContextProvider } from './store/DashBoardStateContext';

const providers = [
  DashboardContextProvider,
  DividendYieldStateContextProvider,
  ExpenseIncomeStateProvider,
  PortfolioTemplateContextProvider,
  RecurringExpenseIncomeContextProvider,
  StockOperationContextProvider,
  WatchListStateProvider,
  PortfolioContextProvider,
];

const CombinedProvider = combineComponents(...providers);

function App() {
  const [{isAuthenticated}] = useGlobalState();

  return (
    <>
      {isAuthenticated ? (
        <CombinedProvider>
          <SpaTemplate />{' '}
        </CombinedProvider>
      ) : (
        <LoginView />
      )}
      <NotificationContainer />
    </>
  );
}

export default App;
