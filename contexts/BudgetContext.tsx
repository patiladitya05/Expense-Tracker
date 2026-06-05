'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Budget } from '@/types';
import { generateSeedBudgets } from '@/lib/seed-data';

interface BudgetContextType {
  budgets: Budget[];
  updateBudgetLimit: (category: string, limit: number) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const loadBudgets = () => {
      const stored = localStorage.getItem('expenses_budgets');
      if (stored) {
        setBudgets(JSON.parse(stored));
      } else {
        const seedData = generateSeedBudgets();
        setBudgets(seedData);
        localStorage.setItem('expenses_budgets', JSON.stringify(seedData));
      }
    };

    loadBudgets();
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const updateBudgetLimit = (category: string, limit: number) => {
    setBudgets(prev =>
      prev.map(b => (b.category === category ? { ...b, limit } : b))
    );
  };

  return (
    <BudgetContext.Provider value={{ budgets, updateBudgetLimit }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};
