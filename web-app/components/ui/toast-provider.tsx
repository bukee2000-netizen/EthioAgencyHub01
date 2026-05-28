'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Toast {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastIdCounter}`;
    setToasts(prev => [...prev, { ...toast, id }]);

    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration || 4000);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const colors = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-300',
    warning: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300',
  };
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg dark:shadow-soft-dark min-w-80 max-w-sm transition-all ${colors[toast.type]}`}
      role="alert"
    >
      <span className="text-lg flex-shrink-0">{icons[toast.type]}</span>
      <div className="flex-1">
        <p className="font-bold text-sm">{toast.title}</p>
        <p className="text-sm opacity-80 mt-1">{toast.description}</p>
        {toast.action && (
          <button
            onClick={() => { toast.action?.onClick(); onClose(toast.id); }}
            className="mt-2 text-sm font-medium underline hover:opacity-70"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button onClick={() => onClose(toast.id)} className="text-lg opacity-50 hover:opacity-100">×</button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) return { toasts: [], addToast: () => {}, removeToast: () => {} };
  return context;
}