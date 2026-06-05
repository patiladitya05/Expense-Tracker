import { Transaction, Budget, DashboardStats, Category } from '@/types';
import { format, parse, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getCategoryIcon = (category: Category): string => {
  const icons: Record<Category, string> = {
    'Salary': '💼',
    'Freelance': '🖥️',
    'Investment': '📈',
    'Food': '🍔',
    'Transport': '🚗',
    'Entertainment': '🎬',
    'Utilities': '💡',
    'Healthcare': '🏥',
    'Education': '📚',
    'Shopping': '🛍️',
    'Other': '📌',
  };
  return icons[category];
};

export const calculateStats = (transactions: Transaction[]): DashboardStats => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: transactions.length,
  };
};

export const calculateBudgetStatus = (
  transactions: Transaction[],
  budgets: Budget[]
): Budget[] => {
  return budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    return { ...budget, spent };
  });
};

export const getTransactionsByMonth = (
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] => {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(new Date(year, month));

  return transactions.filter(t => {
    const transactionDate = parse(t.date, 'yyyy-MM-dd', new Date());
    return isWithinInterval(transactionDate, { start: startDate, end: endDate });
  });
};

export const getMonthlyExpensesByCategory = (
  transactions: Transaction[],
  year: number,
  month: number
): Record<Category, number> => {
  const monthTransactions = getTransactionsByMonth(transactions, year, month);
  const expenses: Record<Category, number> = {} as Record<Category, number>;

  monthTransactions.forEach(t => {
    if (t.type === 'expense') {
      expenses[t.category] = (expenses[t.category] || 0) + t.amount;
    }
  });

  return expenses;
};

export const exportToCSV = (transactions: Transaction[]): void => {
  const headers = ['Date', 'Description', 'Type', 'Category', 'Amount', 'Notes'];
  const rows = transactions.map(t => [
    t.date,
    t.description,
    t.type,
    t.category,
    t.amount.toString(),
    t.notes || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
