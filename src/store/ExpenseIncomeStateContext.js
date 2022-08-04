import {createContext, useContext, useReducer} from 'react';
import moment from 'moment';

const ExpenseIncomeStateContext = createContext();

const expenseIncomeInitialState = {
  loadingPending: true,
  list: [],
  filter: {
    dateIni: moment().startOf('month').format('DD/MM/YYYY'),
    dateEnd: moment().endOf('month').format('DD/MM/YYYY'),
  },
  order: 'dueDate(asc)',
  page: 0,
  hasMore: true,
};

const LOAD_LIST = 'EXPENSE_INCOME_LOAD_LIST';
const SET_TO_LOAD = 'EXPENSE_INCOME_SET_TO_LOAD';
const CHANGE_FILTER = 'EXPENSE_INCOME_CHANGE_FILTER';
const CHANGE_ORDER = 'EXPENSE_INCOME_CHANGE_ORDER';
const NEXT_PAGE = 'EXPENSE_INCOME_NEXT_PAGE';

export const ExpenseIncomeActions = {
  loadList: (responseData) => ({action: LOAD_LIST, payload: responseData}),
  setToLoad: () => ({action: SET_TO_LOAD}),
  changeFilter: (filter) => ({action: CHANGE_FILTER, payload: filter}),
  nextPage: () => ({action: NEXT_PAGE}),
  changeOrder: (order) => ({action: CHANGE_ORDER, payload: order}),
};

const expenseIncomeReducer = (state, {action, payload}) => {
  switch (action) {
    case LOAD_LIST:
      return {
        ...state,
        loadingPending: false,
        list: state.page === 0 ? [...payload.content] : [...state.list, ...payload.content],
        hasMore: payload.content.last,
      };
    case CHANGE_FILTER:
      return {
        ...state,
        loadingPending: true,
        filter: {...payload},
      };
    case CHANGE_ORDER:
      return {
        ...state,
        loadingPending: true,
        order: payload,
      };
    case NEXT_PAGE:
      return {
        ...state,
        loadingPending: true,
        page: state.page + 1,
      };
    case SET_TO_LOAD:
      return {...state, loadingPending: true, page: 0};
    default:
      return state;
  }
};

export const ExpenseIncomeStateProvider = ({children}) => (
  <ExpenseIncomeStateContext.Provider value={useReducer(expenseIncomeReducer, expenseIncomeInitialState)}>
    {children}
  </ExpenseIncomeStateContext.Provider>
);

export const useExpenseIncomeStateContext = () => useContext(ExpenseIncomeStateContext);
