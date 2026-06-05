import React from 'react';
import { formatCurrency } from '@/lib/expense-utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: string;
  color: 'primary' | 'success' | 'destructive';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon, color }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    destructive: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{formatCurrency(amount)}</p>
    </div>
  );
};
