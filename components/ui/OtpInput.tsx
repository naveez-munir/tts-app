'use client';

import { cn } from '@/lib/utils';
import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';

interface OtpInputProps {
  /** Number of OTP digits (default: 6) */
  length?: number;
  /** Current OTP value */
  value: string;
  /** Callback when OTP changes */
  onChange: (value: string) => void;
  /** Error message to display */
  error?: string;
  /** Label for the input group */
  label?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Auto-focus the first input on mount */
  autoFocus?: boolean;
}

/**
 * Reusable OTP input component with separate boxes for each digit
 * Features:
 * - Auto-focus to next box on input
 * - Auto-focus to previous box on backspace
 * - Paste support (fills all boxes from clipboard)
 * - Consistent styling with design system
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  error,
  label,
  disabled = false,
  autoFocus = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Convert value string to array of digits
  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, inputValue: string) => {
    // Only allow numeric input
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    
    // Build new value
    const newDigits = [...digits];
    newDigits[index] = digit;
    const newValue = newDigits.join('');
    
    onChange(newValue);

    // Auto-focus next input if digit was entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // If current box is empty, move to previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        e.preventDefault();
      }
    }
    
    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    }
    
    // Handle right arrow
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    if (pastedData) {
      onChange(pastedData);
      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    // Select the content when focused
    inputRefs.current[index]?.select();
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-semibold text-neutral-700">
          {label}
        </label>
      )}
      
      <div className="flex justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            disabled={disabled}
            autoComplete="one-time-code"
            className={cn(
              'h-12 w-10 rounded-lg border text-center text-xl font-semibold transition-all duration-200 sm:h-14 sm:w-12 sm:text-2xl',
              'bg-white text-neutral-800',
              'focus:outline-none',
              disabled && 'cursor-not-allowed bg-neutral-100 text-neutral-500',
              error
                ? 'border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-500/20'
                : focusedIndex === index
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-neutral-300 hover:border-neutral-400'
            )}
            aria-label={`Digit ${index + 1} of ${length}`}
          />
        ))}
      </div>

      {error && (
        <p className="mt-2 text-center text-sm font-medium text-error-600">
          {error}
        </p>
      )}
    </div>
  );
}

