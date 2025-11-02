
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType.INCOME | TransactionType.EXPENSE;
}

export interface Account {
  id: string;
  name:string;
  balance: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  accountId: string;
  categoryId?: string;
  toAccountId?: string; // For transfers
}

export type AppState = {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
};

export type Action =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'SET_STATE'; payload: AppState };
