import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, Action, TransactionType } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

const initialState: AppState = {
  accounts: [],
  categories: [],
  transactions: [],
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const transaction = action.payload;
      const newTransactions = [...state.transactions, transaction];
      let newAccounts = [...state.accounts];

      if (transaction.type === TransactionType.INCOME) {
        newAccounts = newAccounts.map(acc =>
          acc.id === transaction.accountId ? { ...acc, balance: acc.balance + transaction.amount } : acc
        );
      } else if (transaction.type === TransactionType.EXPENSE) {
        newAccounts = newAccounts.map(acc =>
          acc.id === transaction.accountId ? { ...acc, balance: acc.balance - transaction.amount } : acc
        );
      } else if (transaction.type === TransactionType.TRANSFER) {
        newAccounts = newAccounts.map(acc => {
          if (acc.id === transaction.accountId) { // From account
            return { ...acc, balance: acc.balance - transaction.amount };
          }
          if (acc.id === transaction.toAccountId) { // To account
            return { ...acc, balance: acc.balance + transaction.amount };
          }
          return acc;
        });
      }

      return { ...state, transactions: newTransactions, accounts: newAccounts };
    }
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'SET_STATE':
        return action.payload;
    default:
      return state;
  }
};

export const AppContextProvider = ({ children, userKey }: { children: ReactNode, userKey: string }) => {
    const storageKey = `finance-app-state-${userKey}`;
    const [savedState, setSavedState] = useLocalStorage<AppState>(storageKey, initialState);
    
    const [state, dispatch] = useReducer(appReducer, savedState);

    useEffect(() => {
        setSavedState(state);
    }, [state, setSavedState]);


  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
