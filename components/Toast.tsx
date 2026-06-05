'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: 'bg-success/10 text-success border border-success/20',
    error: 'bg-destructive/10 text-destructive border border-destructive/20',
    info: 'bg-primary/10 text-primary border border-primary/20',
  };

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg ${bgColor[type]} shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      <p className="font-medium">{message}</p>
    </div>
  );
};
