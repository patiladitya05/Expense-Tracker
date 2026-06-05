'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { generateSeedTransactions } from '@/lib/seed-data';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  isLoading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      const stored = localStorage.getItem('expenses_transactions');
      if (stored) {
        setTransactions(JSON.parse(stored));
      } else {
        const seedData = generateSeedTransactions();
        setTransactions(seedData);
        localStorage.setItem('expenses_transactions', JSON.stringify(seedData));
      }
      setIsLoading(false);
    };

    loadTransactions();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('expenses_transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `trans-${Date.now()}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...transaction, id } : t))
    );
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction, isLoading }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
