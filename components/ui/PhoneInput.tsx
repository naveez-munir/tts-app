'use client';

import PhoneInputWithCountry from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import type { E164Number } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export { isValidPhoneNumber };

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

// Custom input component to ensure proper styling
const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      {...props}
      ref={ref}
      className="phone-input-field"
    />
  )
);
CustomInput.displayName = 'CustomInput';

/**
 * International Phone Input Component
 * Uses react-phone-number-input with country code selector
 * Defaults to GB (United Kingdom)
 */
export function PhoneInput({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder = 'Enter phone number',
  className,
}: PhoneInputProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="ml-1 text-accent-500">*</span>}
        </label>
      )}
      <PhoneInputWithCountry
        international
        countryCallingCodeEditable={false}
        defaultCountry="GB"
        value={(value || undefined) as E164Number | undefined}
        onChange={(val) => onChange(val || '')}
        placeholder={placeholder}
        disabled={disabled}
        inputComponent={CustomInput}
        className={cn(
          'phone-input-wrapper',
          error && 'phone-input-error'
        )}
      />
      {error && (
        <p className="mt-1.5 text-sm text-accent-600">{error}</p>
      )}
    </div>
  );
}

