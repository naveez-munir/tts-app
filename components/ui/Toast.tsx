'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ============================================================================
// PROVIDER
// ============================================================================

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: Toast = { id, message, variant, duration };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const success = useCallback(
    (message: string, duration?: number) => addToast(message, 'success', duration),
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => addToast(message, 'error', duration ?? 7000),
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => addToast(message, 'warning', duration),
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => addToast(message, 'info', duration),
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, warning, info }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ============================================================================
// TOAST CONTAINER
// ============================================================================

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ============================================================================
// TOAST ITEM
// ============================================================================

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!toast.duration) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const variantConfig = {
    success: {
      bg: 'bg-success-50 border-success-200',
      text: 'text-success-800',
      icon: <CheckCircle className="h-5 w-5 text-success-600" />,
    },
    error: {
      bg: 'bg-error-50 border-error-200',
      text: 'text-error-800',
      icon: <AlertCircle className="h-5 w-5 text-error-600" />,
    },
    warning: {
      bg: 'bg-warning-50 border-warning-200',
      text: 'text-warning-800',
      icon: <AlertTriangle className="h-5 w-5 text-warning-600" />,
    },
    info: {
      bg: 'bg-info-50 border-info-200',
      text: 'text-info-800',
      icon: <Info className="h-5 w-5 text-info-600" />,
    },
  };

  const config = variantConfig[toast.variant];

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300',
        'min-w-[300px] max-w-[400px]',
        config.bg,
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      )}
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <p className={cn('flex-1 text-sm font-medium', config.text)}>{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-lg p-1 hover:bg-black/5"
        aria-label="Dismiss notification"
      >
        <X className={cn('h-4 w-4', config.text)} />
      </button>
    </div>
  );
}

