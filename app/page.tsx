'use client';

import React, { useMemo } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { SummaryCard } from '@/components/SummaryCard';
import { TransactionRow } from '@/components/TransactionRow';
import { EmptyState } from '@/components/EmptyState';
import { useTransactions } from '@/contexts/TransactionContext';
import { calculateStats } from '@/lib/expense-utils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function Dashboard() {
  const { transactions, isLoading } = useTransactions();

  const stats = useMemo(() => {
    return calculateStats(transactions);
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  const expenseByCategory = useMemo(() => {
    const categoryExpenses: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(categoryExpenses).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyTrend = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!months[month]) months[month] = { income: 0, expense: 0 };
      if (t.type === 'income') {
        months[month].income += t.amount;
      } else {
        months[month].expense += t.amount;
      }
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-IN', { month: 'short' }),
        ...data,
      }));
  }, [transactions]);

  const COLORS = ['#7c3aed', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your expense tracker</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard title="Total Income" amount={stats.totalIncome} icon="💰" color="success" />
          <SummaryCard title="Total Expense" amount={stats.totalExpense} icon="💸" color="destructive" />
          <SummaryCard title="Balance" amount={stats.balance} icon="💵" color="primary" />
          <SummaryCard title="Transactions" amount={stats.transactionCount} icon="📊" color="primary" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense by Category */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Expenses by Category</h2>
            {expenseByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${Math.round(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Math.round(value)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No expense data
              </div>
            )}
          </div>

          {/* Monthly Trend */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Monthly Trend</h2>
            {monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Math.round(value)}`} />
                  <Legend />
                  <Bar dataKey="income" fill="var(--color-success)" />
                  <Bar dataKey="expense" fill="var(--color-destructive)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
            <Link href="/transactions" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {recentTransactions.map(transaction => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon="📊"
              title="No Transactions Yet"
              description="Start tracking your expenses by adding a new transaction."
              action={{
                label: 'Add Transaction',
                onClick: () => (window.location.href = '/add-transaction'),
              }}
            />
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
