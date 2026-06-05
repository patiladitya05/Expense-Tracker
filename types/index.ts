export type TransactionType = 'income' | 'expense';
export type Category = 'Salary' | 'Freelance' | 'Investment' | 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Healthcare' | 'Education' | 'Shopping' | 'Other';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
  notes?: string;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}
