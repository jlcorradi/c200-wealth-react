import { createContext, useContext, useReducer } from 'react';
import moment from 'moment';

let yeldsInicialState = {
  isLoading: true,
  loadingPending: true,
  hasMore: true,
  filter: {
    paymentDate: [
      moment().startOf('month').format('DD/MM/YYYY'),
      moment().endOf('month').format('DD/MM/YYYY'),
    ],
  },
  order: 'paymentDate(ASC)',
  page: 0,
  totalAmount: 0,
  dividendYieldList: [],
};

const DividendYieldStateContext = createContext();

export const DividendYieldActions = {
  loadData: (list, totalAmount) => ({
    action: 'LOAD_DATA',
    payload: { list, totalAmount },
  }),
  changeFilter: (filter) => ({ action: 'CHANGE_FILTER', payload: filter }),
  changeOrder: (order) => ({ action: 'CHANGE_ORDER', payload: order }),
  changePage: (page) => ({ action: 'CHANGE_PAGE', payload: page }),
  setToLoad: () => ({ action: 'SET_TO_LOAD' }),
};

let yeldsReducer = (state, { action, payload }) => {
  switch (action) {
    case 'LOAD_DATA':
      return {
        ...state,
        isLoading: false,
        loadingPending: false,
        hasMore: !payload.last,
        totalAmount: payload.totalAmount,
        dividendYieldList:
          state.page !== 0
            ? [...state.dividendYieldList, ...payload.list.content]
            : payload.list.content,
      };
    case 'CHANGE_FILTER':
      return {
        ...state,
        filter: payload,
        page: 0,
        loadingPending: true,
        isLoading: true,
      };
    case 'CHANGE_ORDER':
      return {
        ...state,
        order: payload,
        page: 0,
        loadingPending: true,
        isLoading: true,
      };
    case 'CHANGE_PAGE':
      return { ...state, page: payload, loadingPending: true, isLoading: true };
    case 'SET_TO_LOAD':
      return { ...state, page: 0, loadingPending: true, isLoading: true };
    default:
      return state;
  }
};

export const DividendYieldStateContextProvider = ({ children }) => (
  <DividendYieldStateContext.Provider
    value={useReducer(yeldsReducer, yeldsInicialState)}
  >
    {children}
  </DividendYieldStateContext.Provider>
);

export const useDividendYieldStateContext = () =>
  useContext(DividendYieldStateContext);
