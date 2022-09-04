import { createContext, useContext, useEffect, useReducer } from "react";
import RecurringExpenseIncomeService from "../services/RecurringExpenseIncomeService";

const SET_TO_LOAD = "SET_TO_LOAD";
const LOADED = "LOADED";

export const RecurringExpenseIncomeActions = {
  setToLoad: () => ({ type: SET_TO_LOAD }),
  loaded: (resultingList) => ({ type: LOADED, payload: resultingList }),
};

const initialValue = {
  list: [],
  loadPending: true,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case LOADED:
      return { ...state, loadPending: false, list: payload };
    case SET_TO_LOAD:
      return { ...state, loadPending: true };
    default:
      return state;
  }
};

const RecurringExpenseIncomeContext = createContext();

export const RecurringExpenseIncomeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValue);

  const { loadPending } = state;

  useEffect(loadData, [loadPending]);

  function loadData() {
    RecurringExpenseIncomeService.list().then((response) =>
      dispatch(RecurringExpenseIncomeActions.loaded(response.data))
    );
  }

  return (
    <RecurringExpenseIncomeContext.Provider value={[state, dispatch]}>
      {children}
    </RecurringExpenseIncomeContext.Provider>
  );
};

export const useRecurringExpenseIncomeContext = () =>
  useContext(RecurringExpenseIncomeContext);
