'use client';

import React, { useMemo, useState } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { useBudgets } from '@/contexts/BudgetContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { calculateBudgetStatus, formatCurrency, getCategoryIcon } from '@/lib/expense-utils';
import { ProgressBar } from '@/components/ProgressBar';
import { Toast } from '@/components/Toast';

export default function BudgetPage() {
  const { budgets, updateBudgetLimit } = useBudgets();
  const { transactions } = useTransactions();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const budgetStatus = useMemo(() => {
    return calculateBudgetStatus(transactions, budgets);
  }, [transactions, budgets]);

  const handleEditClick = (category: string, currentLimit: number) => {
    setEditingCategory(category);
    setEditValue(currentLimit.toString());
  };

  const handleSave = (category: string) => {
    const value = parseFloat(editValue);
    if (isNaN(value) || value <= 0) {
      setToast({ message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    updateBudgetLimit(category, value);
    setEditingCategory(null);
    setToast({ message: 'Budget updated successfully', type: 'success' });
  };

  const getTotalBudget = () => {
    return budgetStatus.reduce((sum, b) => sum + b.limit, 0);
  };

  const getTotalSpent = () => {
    return budgetStatus.reduce((sum, b) => sum + b.spent, 0);
  };

  const getOverBudgetCount = () => {
    return budgetStatus.filter(b => b.spent > b.limit).length;
  };

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budget Management</h1>
          <p className="text-muted-foreground">Set and track your spending limits</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-6 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(getTotalBudget())}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(getTotalSpent())}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Over Budget</p>
            <p className="text-2xl font-bold text-destructive">{getOverBudgetCount()} categories</p>
          </div>
        </div>

        {/* Budget Cards */}
        <div className="space-y-4">
          {budgetStatus.map(budget => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = budget.spent > budget.limit;
            const isWarning = percentage >= 75 && !isOverBudget;

            return (
              <div key={budget.category} className="bg-card p-6 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryIcon(budget.category)}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">{budget.category}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>

                  {editingCategory === budget.category ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-3 py-1 rounded border border-border bg-input text-foreground"
                        step="100"
                        min="0"
                      />
                      <button
                        onClick={() => handleSave(budget.category)}
                        className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="px-3 py-1 rounded border border-border hover:bg-secondary text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(budget.category, budget.limit)}
                      className="px-4 py-2 rounded border border-border hover:bg-secondary font-medium text-sm transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <ProgressBar
                  value={budget.spent}
                  max={budget.limit}
                  color={isOverBudget ? 'destructive' : isWarning ? 'warning' : 'success'}
                  showLabel={true}
                />

                {/* Status Message */}
                {isOverBudget && (
                  <p className="text-sm text-destructive mt-2 font-medium">
                    Over budget by {formatCurrency(budget.spent - budget.limit)}
                  </p>
                )}
                {isWarning && (
                  <p className="text-sm text-yellow-600 mt-2 font-medium">
                    Approaching limit ({formatCurrency(budget.limit - budget.spent)} remaining)
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-2">Budget Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Review your budgets monthly and adjust based on your spending patterns</li>
            <li>• Set realistic limits that reflect your income and priorities</li>
            <li>• Categories highlighted in yellow are at 75% of their limit</li>
            <li>• Categories highlighted in red have exceeded their limit</li>
          </ul>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </LayoutWrapper>
  );
}
