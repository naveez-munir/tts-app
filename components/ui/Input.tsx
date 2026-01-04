import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes, useMemo } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

/**
 * Reusable input component with theme colors
 * Supports error states, labels, and all standard input props
 * Automatically prevents past dates for datetime-local inputs
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, type, min, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // Auto-set min datetime for datetime-local inputs to prevent past dates
    const minValue = useMemo(() => {
      if (type === 'datetime-local' && !min) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }
      return min;
    }, [type, min]);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-semibold text-neutral-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          min={minValue}
          className={cn(
            'w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-base text-neutral-800 placeholder-neutral-400 transition-all duration-200',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className
          )}
          {...props}
        />
        {/* Error message - high contrast for visibility on dark backgrounds */}
        {error && (
          <p className="mt-1.5 rounded bg-error-100 px-2 py-1 text-sm font-medium text-error-700">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

