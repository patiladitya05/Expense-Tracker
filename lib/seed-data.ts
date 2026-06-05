import { Transaction, Budget } from '@/types';
import { format, subDays } from 'date-fns';

export const generateSeedTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const categories = {
    income: ['Salary', 'Freelance', 'Investment'] as const,
    expense: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Shopping', 'Other'] as const,
  };

  const expenseDescriptions: Record<string, string[]> = {
    'Food': ['Groceries', 'Restaurant', 'Coffee', 'Lunch', 'Dinner'],
    'Transport': ['Fuel', 'Auto Rickshaw', 'Bus Fare', 'Parking', 'Car Maintenance'],
    'Entertainment': ['Movie Tickets', 'Gaming', 'Spotify', 'Concert', 'Books'],
    'Utilities': ['Electricity', 'Water', 'Internet', 'Phone Bill'],
    'Healthcare': ['Doctor Visit', 'Medicine', 'Gym', 'Dental'],
    'Education': ['Online Course', 'Books', 'Tuition', 'Training'],
    'Shopping': ['Clothes', 'Electronics', 'Home Decor', 'Shoes'],
    'Other': ['Gifts', 'Donations', 'Misc'],
  };

  const incomeDescriptions: Record<string, string[]> = {
    'Salary': ['Monthly Salary', 'Bonus'],
    'Freelance': ['Project Payment', 'Consulting', 'Contract Work'],
    'Investment': ['Stock Dividend', 'Interest Income', 'Rental Income'],
  };

  // Generate 30 transactions over the last 90 days
  for (let i = 0; i < 30; i++) {
    const isIncome = Math.random() < 0.2;
    const date = subDays(new Date(), Math.floor(Math.random() * 90));

    if (isIncome) {
      const category = categories.income[Math.floor(Math.random() * categories.income.length)];
      const descriptions = incomeDescriptions[category];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const amount = Math.floor(Math.random() * 50000) + 10000;

      transactions.push({
        id: `trans-${i}`,
        description,
        amount,
        type: 'income',
        category: category as any,
        date: format(date, 'yyyy-MM-dd'),
      });
    } else {
      const category = categories.expense[Math.floor(Math.random() * categories.expense.length)];
      const descriptions = expenseDescriptions[category];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const amount = Math.floor(Math.random() * 5000) + 100;

      transactions.push({
        id: `trans-${i}`,
        description,
        amount,
        type: 'expense',
        category: category as any,
        date: format(date, 'yyyy-MM-dd'),
        notes: Math.random() > 0.7 ? 'Personal' : undefined,
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const generateSeedBudgets = (): Budget[] => {
  return [
    { category: 'Food', limit: 15000, spent: 0 },
    { category: 'Transport', limit: 8000, spent: 0 },
    { category: 'Entertainment', limit: 5000, spent: 0 },
    { category: 'Utilities', limit: 5000, spent: 0 },
    { category: 'Healthcare', limit: 10000, spent: 0 },
    { category: 'Education', limit: 20000, spent: 0 },
    { category: 'Shopping', limit: 15000, spent: 0 },
  ];
};
