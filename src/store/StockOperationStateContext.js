import {createContext, useContext, useEffect, useReducer} from 'react';
import moment from 'moment';
import QueryService from '../services/QueryService';

const StockOperationContext = createContext();

const STOCK_OPERATIONS_LOADED = 'STOCK_OPERATIONS_LOADED';
const STOCK_OPERATIONS_FILTER_CHANGED = 'STOCK_OPERATIONS_FILTER_CHANGED';
const STOCK_OPERATIONS_ORDER_CHANGED = 'STOCK_OPERATIONS_ORDER_CHANGED';
const STOCK_OPERATIONS_CURRENT_PAGE_CHANGED = 'STOCK_OPERATIONS_CURRENT_PAGE_CHANGED';
const STOCK_OPERATIONS_SET_TO_LOAD = 'STOCK_OPERATIONS_SET_TO_LOAD';

export const StockOperationActions = {
  changeFilter: (filter) => ({action: STOCK_OPERATIONS_FILTER_CHANGED, payload: filter}),
  loadOperations: (operationList, totalAmount) => ({
    action: STOCK_OPERATIONS_LOADED,
    payload: {operationList, totalAmount},
  }),
  changeCurrentPage: (currentPage) => ({action: STOCK_OPERATIONS_CURRENT_PAGE_CHANGED, payload: currentPage}),
  changeOrder: (order) => ({action: STOCK_OPERATIONS_ORDER_CHANGED, payload: order}),
  setToLoad: () => ({action: STOCK_OPERATIONS_SET_TO_LOAD}),
};

let stockOperationInitialState = {
  operationList: [],
  isLoading: false,
  hasMore: true,
  totalElements: 0,
  totalAmount: 0,
  page: 0,
  pageSize: 20,
  order: 'operationDate(asc)',
  filter: {
    operationDate: [moment().startOf('month').format('DD/MM/YYYY'), moment().endOf('month').format('DD/MM/YYYY')],
  },
};

let stockOperatonReducer = (state, {action, payload}) => {
  switch (action) {
    case STOCK_OPERATIONS_LOADED:
      return {
        ...state,
        operationList:
          state.page === 0
            ? [...payload.operationList.content]
            : [...state.operationList, ...payload.operationList.content],
        totalElements: payload.numberOfElements,
        hasMore: !payload.last,
        totalAmount: payload.totalAmount,
        isLoading: false,
      };

    case STOCK_OPERATIONS_FILTER_CHANGED:
      return {...state, page: 0, filter: payload, isLoading: true};
    case STOCK_OPERATIONS_ORDER_CHANGED:
      return {...state, page: 0, order: payload, isLoading: true};
    case STOCK_OPERATIONS_CURRENT_PAGE_CHANGED:
      return {...state, page: payload, isLoading: true};
    case STOCK_OPERATIONS_SET_TO_LOAD:
      return {...state, page: 0, isLoading: true};
    default:
      return state;
  }
};

export const StockOperationContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(stockOperatonReducer, stockOperationInitialState);
  let {isLoading, filter, page, order, pageSize} = state;

  useEffect(loadOperations, [isLoading]);

  function loadOperations() {
    QueryService.query('StockOperationEntity', filter, order, page, pageSize).then((response) =>
      dispatch(StockOperationActions.loadOperations(response.data, 0))
    );
  }

  return <StockOperationContext.Provider value={[state, dispatch]}>{children}</StockOperationContext.Provider>;
};

export const useStockOperationContext = () => useContext(StockOperationContext);
