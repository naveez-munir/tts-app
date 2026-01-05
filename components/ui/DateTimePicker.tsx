'use client';

import { forwardRef, useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { X } from 'lucide-react';

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  placeholder?: string;
  minDate?: Date;
  disabled?: boolean;
  inputClassName?: string;
}

const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, placeholder, error, disabled, inputClassName }, ref) => (
    <input
      ref={ref}
      type="text"
      value={value || ''}
      onClick={onClick}
      placeholder={placeholder}
      readOnly
      disabled={disabled}
      className={`
        min-h-[44px] w-full rounded-lg border px-4 py-2.5 text-base
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500/50
        disabled:cursor-not-allowed disabled:opacity-60
        ${error
          ? 'border-error-500 bg-error-50 text-error-900 placeholder-error-400'
          : 'border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 hover:border-neutral-400'
        }
        ${inputClassName || ''}
      `}
    />
  )
);

CustomInput.displayName = 'CustomInput';

// Generate hour options (0-23)
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

// Generate minute options (0, 5, 10, 15...)
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

export function DateTimePicker({
  value,
  onChange,
  error,
  placeholder = 'Select date & time',
  minDate = new Date(),
  disabled = false,
  inputClassName = '',
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [selectedHour, setSelectedHour] = useState<string>('12');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');

  // Initialize time from value prop
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setSelectedHour(value.getHours().toString().padStart(2, '0'));
      setSelectedMinute(value.getMinutes().toString().padStart(2, '0'));
    }
  }, [value]);

  // Handle date selection from calendar
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };


  // Handle Done button - combine date + time
  const handleDone = () => {
    if (selectedDate) {
      const combined = new Date(selectedDate);
      combined.setHours(parseInt(selectedHour, 10));
      combined.setMinutes(parseInt(selectedMinute, 10));
      combined.setSeconds(0);
      combined.setMilliseconds(0);
      onChange(combined);
    }
    setIsOpen(false);
  };

  // Format display value
  const displayValue = value
    ? `${value.getDate().toString().padStart(2, '0')}/${(value.getMonth() + 1).toString().padStart(2, '0')}/${value.getFullYear()} ${value.getHours().toString().padStart(2, '0')}:${value.getMinutes().toString().padStart(2, '0')}`
    : '';

  return (
    <div className="w-full">
      {/* Input Field */}
      <input
        type="text"
        value={displayValue}
        onClick={() => !disabled && setIsOpen(true)}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        className={`
          min-h-[44px] w-full rounded-lg border px-4 py-2.5 text-base
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500/50
          disabled:cursor-not-allowed disabled:opacity-60
          ${error
            ? 'border-error-500 bg-error-50 text-error-900 placeholder-error-400'
            : 'border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 hover:border-neutral-400'
          }
          ${inputClassName || ''}
        `}
      />

      {/* Custom Time Picker Modal - Only show when picker is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative w-[95vw] max-w-[450px] rounded-xl bg-white shadow-2xl overflow-hidden">
            {/* Calendar + Time Side by Side - Same Layout on All Devices */}
            <div className="flex">
              {/* Calendar */}
              <div className="datepicker-inline-wrapper flex-1 min-w-0">
                <ReactDatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={minDate}
                  inline
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={20}
                />
              </div>

              {/* Time Selection - Right Side */}
              <div className="relative flex flex-col border-l border-neutral-200 bg-white p-3 sm:p-4 w-[140px] sm:w-[170px] shrink-0">
                {/* Close Icon - Top Right of Time Section */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-2 top-2 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X size={16} />
                </button>

                <div className="mb-2 sm:mb-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-neutral-600">Time</div>

                {/* Hour and Minute Side by Side */}
                <div className="mb-3 sm:mb-4 space-y-2 sm:space-y-3">
                  <div>
                    <label className="mb-1 block text-[11px] sm:text-xs font-semibold text-neutral-600">Hour</label>
                    <select
                      value={selectedHour}
                      onChange={(e) => setSelectedHour(e.target.value)}
                      className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm font-semibold text-neutral-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    >
                      {HOURS.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] sm:text-xs font-semibold text-neutral-600">Min</label>
                    <select
                      value={selectedMinute}
                      onChange={(e) => setSelectedMinute(e.target.value)}
                      className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm font-semibold text-neutral-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    >
                      {MINUTES.map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Done Button */}
                <button
                  type="button"
                  onClick={handleDone}
                  className="w-full rounded-md bg-accent-600 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-error-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

