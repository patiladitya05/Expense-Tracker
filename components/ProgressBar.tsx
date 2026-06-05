import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'success' | 'warning' | 'destructive';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  color = 'success',
  showLabel = true 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    success: 'bg-success',
    warning: 'bg-yellow-500',
    destructive: 'bg-destructive',
  };

  const getColor = (): string => {
    if (percentage >= 100) return 'destructive';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className="w-full">
      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full ${colorClasses[getColor()]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1">
          {Math.round(percentage)}% of limit
        </p>
      )}
    </div>
  );
};
