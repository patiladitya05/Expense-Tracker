'use client';

import React from 'react';
import { Transaction } from '@/types';
import { formatCurrency, getCategoryIcon } from '@/lib/expense-utils';
import { format, parse } from 'date-fns';

interface TransactionRowProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  onDelete,
  showDelete = false 
}) => {
  const transactionDate = parse(transaction.date, 'yyyy-MM-dd', new Date());

  return (
    <tr className="border-b border-border hover:bg-secondary/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getCategoryIcon(transaction.category)}</div>
          <div>
            <p className="font-medium text-foreground">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{transaction.category}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">
        {format(transactionDate, 'MMM d, yyyy')}
      </td>
      <td className="px-6 py-4 text-right">
        <span className={`font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>
      </td>
      {showDelete && (
        <td className="px-6 py-4 text-right">
          <button
            onClick={() => onDelete?.(transaction.id)}
            className="text-destructive hover:text-destructive/80 font-medium text-sm"
          >
            Delete
          </button>
        </td>
      )}
    </tr>
  );
};
