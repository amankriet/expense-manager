export type TransactionType = "Expense" | "Income";

export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  description: string;
}

export interface TransactionFormData {
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
  description: string;
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  expenses?: Transaction[];
  error?: string;
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  expense: Transaction;
}
