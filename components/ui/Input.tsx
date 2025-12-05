import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

/**
 * Reusable input component with theme colors
 * Supports error states, labels, and all standard input props
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

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
          className={cn(
            'w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-base text-neutral-800 placeholder-neutral-400 transition-all duration-200',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

