'use client';

import React, { useMemo, useState } from 'react';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { TransactionRow } from '@/components/TransactionRow';
import { EmptyState } from '@/components/EmptyState';
import { useTransactions } from '@/contexts/TransactionContext';
import { Transaction } from '@/types';
import { exportToCSV } from '@/lib/expense-utils';

export default function TransactionsPage() {
  const { transactions, deleteTransaction, isLoading } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  const handleExport = () => {
    exportToCSV(filtered);
  };

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
          <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">View and manage all your transactions</p>
        </div>

        {/* Controls */}
        <div className="bg-card p-4 rounded-lg border border-border space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by description or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as 'all' | 'income' | 'expense');
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={filtered.length === 0}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {paginatedData.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map(transaction => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        onDelete={handleDelete}
                        showDelete={true}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon="💳"
              title="No Transactions Found"
              description="No transactions match your search criteria. Try adjusting your filters."
              action={{
                label: 'Add First Transaction',
                onClick: () => (window.location.href = '/add-transaction'),
              }}
            />
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
