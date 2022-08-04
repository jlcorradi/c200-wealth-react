import React, { createContext, useContext, useReducer } from 'react';
import { Auth } from '../Auth';

const GlobalContext = createContext();

export const GlobalActions = {
  toggleSidebarActive: (value) => ({
    type: 'TOGGLE_SIDEBAR_ACTIVE',
    payload: value,
  }),
  toggleAuthenticated: (value) => ({
    type: 'TOGGLE_AUTHENTICATED',
    payload: value,
  }),
  triggerLoadNotifications: () => ({ type: 'NOTIFICATIONS_PENDING' }),
  notificationsLoaded: (notifications) => ({
    type: 'NOTIFICATIONS_LOADED',
    payload: notifications,
  }),
  showExpenseIncomeOffset: (expenseIncomeId) => ({
    type: 'SET_ACTIVE_EXPENSE_INCOME_ID',
    payload: expenseIncomeId,
  }),
  dismissGlobalOffset: () => ({ type: 'DISMISS_GLOBAL_OFFSET' }),
};

const globalReducer = (state, { type, payload }) => {
  switch (type) {
    case 'TOGGLE_SIDEBAR_ACTIVE':
      return { ...state, isSidebarActive: payload };
    case 'TOGGLE_AUTHENTICATED':
      return { ...state, isAuthenticated: payload };
    case 'NOTIFICATIONS_PENDING':
      return { ...state, loadNotifications: true };
    case 'NOTIFICATIONS_LOADED':
      return { ...state, loadNotifications: false, notifications: payload };
    case 'SET_ACTIVE_EXPENSE_INCOME_ID':
      return {
        ...state,
        activeExpenseIncomeId: payload,
        globalOffcanvaVisible: payload > 0,
        globalOffsetTitle: payload > 0 ? "Expense / Income Data": ""
      };
    case 'DISMISS_GLOBAL_OFFSET':
      return {
        ...state,
        globalOffcanvaVisible: false,
        globalOffsetTitle: ""
      };
    default:
      return state;
  }
};

let isAuthenticated = Auth.isValidSession();

const globalInitialState = {
  isLoading: false,
  isSidebarActive: false,
  isAuthenticated: isAuthenticated,
  loadNotifications: true,
  notifications: [],
  activeExpenseIncomeId: 0,
  globalOffcanvaVisible: false,
  globalOffsetTitle: ""
};

export const GlobalStateProvider = ({ children }) => (
  <GlobalContext.Provider value={useReducer(globalReducer, globalInitialState)}>
    {children}
  </GlobalContext.Provider>
);

export const useGlobalState = () => useContext(GlobalContext);
