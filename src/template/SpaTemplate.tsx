import classNames from "classnames";
import React from "react";
import { useGlobalState } from "../store/GlobalStateContext";
import { Auth } from "../Auth";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink,
} from "react-router-dom";
import { DashboardView } from "../views/DashboardView";
import { BankAccountsView } from "../views/BankAccountsView";
import { ExpensesIncomeView } from "../views/ExpensesIncomeView";
//@ts-ignore
import RecurringExpenseIncomeView from "../views/RecurringExpenseIncomeView";
import InvestmentsView from "../views/InvestmentsView";
import { Popup } from "../components/Popup";
import QueryService from "../services/QueryService";
import { NotificationWidget } from "../components/NotificationWidget";
//@ts-ignore
import ReportingView from "../views/ReportingView";
import { SystemView } from "../views/SystemView";
import { Sidebar } from "./Sidebar";
import GlobalOffCanva from "../components/GlobalOffset";
import { DashboardContextProvider } from "../store/DashBoardStateContext";
import { ExpenseIncomeStateProvider } from "../store/ExpenseIncomeStateContext";

export function SpaTemplate() {
  const {
    state: { isSidebarActive },
    actions: { toggleAuthenticated, toggleSidebarActive },
  } = useGlobalState();

  const [previewNotificationsVisible, setPreviewNotificationsVisible] =
    React.useState(false);

  if (!Auth.isValidSession()) {
    toggleAuthenticated(false);
    return null;
  }

  return (
    <Router>
      <Sidebar></Sidebar>

      <div
        className={classNames("main", { "sidebar-active": isSidebarActive })}
      >
        <div className="content-wrapper">
          <div className="topbar">
            <div className="topbar-content">
              <div className="flex flex-row">
                <div className="w100">
                  <i
                    className="bx bx-menu"
                    onClick={() => toggleSidebarActive(!isSidebarActive)}
                  ></i>
                </div>
              </div>
              <div>
                <i
                  className="bx bx-bell"
                  onClick={(e) => {
                    setPreviewNotificationsVisible(
                      !previewNotificationsVisible
                    );
                  }}
                ></i>
                <span className="relative">
                  <i
                    className="bx bx-exit"
                    onClick={(e) => {
                      Auth.setToken(null);
                      toggleAuthenticated(false);
                    }}
                  ></i>
                  <Popup
                    visible={previewNotificationsVisible}
                    onClose={() => setPreviewNotificationsVisible(false)}
                    left={true}
                  >
                    <div className="w500">
                      <NotificationWidget />
                    </div>
                  </Popup>
                </span>
              </div>
            </div>
          </div>
          <div className="content">
            <Switch>
              <Route
                path="/dashboard"
                render={() => (
                  <DashboardContextProvider>
                    <DashboardView />
                  </DashboardContextProvider>
                )}
              />
              <Route path="/bank-accounts" component={BankAccountsView} />
              <Route path="/investments" component={InvestmentsView} />
              <Route
                path="/expense-incomes"
                render={() => (
                  <ExpenseIncomeStateProvider>
                    <ExpensesIncomeView />
                  </ExpenseIncomeStateProvider>
                )}
              />
              <Route
                path="/recurring-expense-incomes"
                component={RecurringExpenseIncomeView}
              />
              <Route
                path="/reporting"
                component={ReportingView}
                exact={false}
              />
              {/* <Route
              path="/balance-portfolio"
              component={PortfolioTemplateContextProvider}
            /> */}
              <Route path="/system" exact={false} component={SystemView} />
              <Route
                path="/"
                exact
                render={() => <Redirect to="/dashboard" />}
              />
            </Switch>
          </div>
        </div>
      </div>
      <GlobalOffCanva></GlobalOffCanva>
    </Router>
  );
}

export default SpaTemplate;
