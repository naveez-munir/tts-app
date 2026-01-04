'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { quoteApi } from '@/lib/api';
import type { PlacePrediction, GeocodingResult } from '@/lib/types';

export interface AddressValue {
  address: string;
  postcode: string | null;
  lat: number;
  lng: number;
  placeId: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: AddressValue) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

/**
 * Address Autocomplete Component
 * Fetches suggestions from backend API and shows dropdown
 */
export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter address',
  label,
  error,
  className,
  inputClassName,
  disabled = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Generate session token for autocomplete (reduces API costs)
  const sessionTokenRef = useRef<string>(
    Math.random().toString(36).substring(2, 15)
  );

  // Fetch suggestions from API
  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await quoteApi.getAutocomplete(
        input,
        sessionTokenRef.current
      );
      setSuggestions(results);
      setIsOpen(results.length > 0);
    } catch (err) {
      console.error('Autocomplete error:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setActiveIndex(-1);

    // Debounce API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  // Handle selection
  const handleSelect = async (prediction: PlacePrediction) => {
    setIsLoading(true);
    try {
      const details = await quoteApi.getPlaceDetails(prediction.placeId);
      if (details) {
        onChange(prediction.description);
        onSelect({
          address: details.formattedAddress || prediction.description,
          postcode: details.postcode,
          lat: details.lat,
          lng: details.lng,
          placeId: prediction.placeId,
        });
        // Generate new session token for next search
        sessionTokenRef.current = Math.random().toString(36).substring(2, 15);
      }
    } catch (err) {
      console.error('Place details error:', err);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setSuggestions([]);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const inputId = label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-neutral-700"
        >
          {label}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            'w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-base text-neutral-800 placeholder-neutral-400 transition-all duration-200',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            inputClassName
          )}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-500" />
          </div>
        )}
      </div>

      {/* Error message - high contrast for visibility on dark backgrounds */}
      {error && (
        <p className="mt-1.5 rounded bg-error-100 px-2 py-1 text-sm font-medium text-error-700">
          {error}
        </p>
      )}

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          {suggestions.map((prediction, index) => (
            <li
              key={prediction.placeId}
              onClick={() => handleSelect(prediction)}
              className={cn(
                'flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors',
                index === activeIndex
                  ? 'bg-primary-50 text-primary-700'
                  : 'hover:bg-neutral-50'
              )}
            >
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-neutral-400" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-neutral-800">
                  {prediction.mainText}
                </div>
                <div className="text-sm text-neutral-500">
                  {prediction.secondaryText}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

