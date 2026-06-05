'use client';

import React, { useState } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { useTransactions } from '@/contexts/TransactionContext';
import { Toast } from '@/components/Toast';
import { Category } from '@/types';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const categories: Record<'income' | 'expense', Category[]> = {
  income: ['Salary', 'Freelance', 'Investment'],
  expense: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Shopping', 'Other'],
};

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: 'Food' as Category,
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'type') {
      setFormData({
        ...formData,
        type: value as 'income' | 'expense',
        category: categories[value as 'income' | 'expense'][0],
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      setToast({ message: 'Please enter a description', type: 'error' });
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setToast({ message: 'Please enter a valid amount', type: 'error' });
      return;
    }

    try {
      addTransaction({
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date,
        notes: formData.notes || undefined,
      });

      setToast({ message: 'Transaction added successfully!', type: 'success' });

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      setToast({ message: 'Failed to add transaction', type: 'error' });
    }
  };

  const availableCategories = categories[formData.type];

  return (
    <LayoutWrapper>
      <div className="space-y-6 max-w-2xl">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Transaction</h1>
          <p className="text-muted-foreground">Record a new income or expense</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border border-border space-y-6">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: 'Food' }))}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.type === 'expense'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted'
              }`}
            >
              <p className="text-2xl mb-2">💸</p>
              <p className="font-semibold text-foreground">Expense</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: 'Salary' }))}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.type === 'income'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted'
              }`}
            >
              <p className="text-2xl mb-2">💰</p>
              <p className="font-semibold text-foreground">Income</p>
            </button>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <input
              id="description"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What was this transaction for?"
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional details..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
            >
              Add Transaction
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-2 rounded-lg border border-border hover:bg-secondary font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
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
