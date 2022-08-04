import React from 'react';

const WatchListContext = React.createContext();

const initialState = {
  isLoading: true,
  watchListList: [],
  order: 'stock.symbol(ASC)',
};

export const setToLoadAction = () => ({type: 'SET_TO_LOAD'});
export const loadedAction = (list) => ({type: 'LOADED', payload: list});

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'SET_TO_LOAD':
      return {...state, isLoading: true};
    case 'LOADED':
      return {...state, isLoading: false, watchListList: payload};
    default:
      return state;
  }
};

const WatchListStateProvider = ({children}) => (
  <WatchListContext.Provider value={React.useReducer(reducer, initialState)}>{children}</WatchListContext.Provider>
);

export default WatchListStateProvider;

export const useWatchListContext = () => React.useContext(WatchListContext);
