'use client';

import React, { useMemo, useState } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { useTransactions } from '@/contexts/TransactionContext';
import { getTransactionsByMonth, getMonthlyExpensesByCategory, formatCurrency } from '@/lib/expense-utils';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const { transactions } = useTransactions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const monthlyTransactions = useMemo(() => {
    return getTransactionsByMonth(transactions, selectedYear, selectedMonth);
  }, [transactions, selectedYear, selectedMonth]);

  const monthlyExpenses = useMemo(() => {
    return getMonthlyExpensesByCategory(transactions, selectedYear, selectedMonth);
  }, [transactions, selectedYear, selectedMonth]);

  const monthlyStats = useMemo(() => {
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: monthlyTransactions.length,
    };
  }, [monthlyTransactions]);

  const yearlyData = useMemo(() => {
    const months: Record<number, { income: number; expense: number; transactions: number }> = {};

    for (let m = 0; m < 12; m++) {
      const monthTransactions = getTransactionsByMonth(transactions, selectedYear, m);
      months[m] = {
        income: monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0),
        expense: monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0),
        transactions: monthTransactions.length,
      };
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames.map((name, index) => ({
      month: name,
      ...months[index],
    }));
  }, [transactions, selectedYear]);

  const expenseData = useMemo(() => {
    return Object.entries(monthlyExpenses)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyExpenses]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Analyze your spending and income patterns</p>
        </div>

        {/* Month/Year Selector */}
        <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Monthly Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card p-6 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Income</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(monthlyStats.income)}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Expenses</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(monthlyStats.expense)}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Balance</p>
            <p className={`text-2xl font-bold ${monthlyStats.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(monthlyStats.balance)}
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Transactions</p>
            <p className="text-2xl font-bold text-primary">{monthlyStats.transactionCount}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Yearly Trend */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Yearly Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Math.round(value)}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="var(--color-success)" strokeWidth={2} />
                <Line type="monotone" dataKey="expense" stroke="var(--color-destructive)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Expenses This Month */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Top Expenses - {months[selectedMonth]}</h2>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${Math.round(value)}`} />
                  <Bar dataKey="amount" fill="var(--color-destructive)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No expenses this month
              </div>
            )}
          </div>
        </div>

        {/* Monthly Transaction Details */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Monthly Transaction Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Month</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Income</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Expenses</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Balance</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Count</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((data, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{data.month} {selectedYear}</td>
                    <td className="px-6 py-4 text-right text-success">{formatCurrency(data.income)}</td>
                    <td className="px-6 py-4 text-right text-destructive">{formatCurrency(data.expense)}</td>
                    <td className={`px-6 py-4 text-right font-semibold ${data.income - data.expense >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(data.income - data.expense)}
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">{data.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
