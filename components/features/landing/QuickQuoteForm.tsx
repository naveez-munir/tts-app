'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AddressAutocomplete, AddressValue } from '@/components/ui/AddressAutocomplete';
import { DateTimePicker } from '@/components/ui/DateTimePicker';

const VEHICLE_OPTIONS = [
  { value: 'SALOON', label: 'Saloon (1-4 passengers)' },
  { value: 'ESTATE', label: 'Estate (1-4 passengers)' },
  { value: 'GREEN_CAR', label: 'Green Car - Electric (1-4 passengers)' },
  { value: 'MPV', label: 'People Carrier (5-6 passengers)' },
  { value: 'EXECUTIVE', label: 'Executive (1-4 passengers)' },
  { value: 'EXECUTIVE_LUXURY', label: 'Executive Luxury (1-3 passengers)' },
  { value: 'EXECUTIVE_PEOPLE_CARRIER', label: 'Executive People Carrier (5-6 passengers)' },
  { value: 'MINIBUS', label: '8-Seater Minibus (1-8 passengers)' },
] as const;

interface LocationData {
  text: string;
  address: string;
  postcode: string | null;
  lat: number | null;
  lng: number | null;
  placeId: string;
}

const emptyLocation: LocationData = {
  text: '',
  address: '',
  postcode: null,
  lat: null,
  lng: null,
  placeId: '',
};

/**
 * Quick Quote Form Component
 * Displays a compact booking form for the hero section
 */
export function QuickQuoteForm() {
  const router = useRouter();
  const [journeyType, setJourneyType] = useState<'one-way' | 'return'>('one-way');
  const [pickup, setPickup] = useState<LocationData>(emptyLocation);
  const [dropoff, setDropoff] = useState<LocationData>(emptyLocation);
  const [pickupDatetime, setPickupDatetime] = useState<Date | null>(null);
  const [returnDatetime, setReturnDatetime] = useState<Date | null>(null);
  const [vehicleType, setVehicleType] = useState('SALOON');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePickupSelect = (address: AddressValue) => {
    setPickup({
      text: address.address,
      address: address.address,
      postcode: address.postcode,
      lat: address.lat,
      lng: address.lng,
      placeId: address.placeId,
    });
    setErrors((prev) => ({ ...prev, pickup: '' }));
  };

  const handleDropoffSelect = (address: AddressValue) => {
    setDropoff({
      text: address.address,
      address: address.address,
      postcode: address.postcode,
      lat: address.lat,
      lng: address.lng,
      placeId: address.placeId,
    });
    setErrors((prev) => ({ ...prev, dropoff: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Accept text input as fallback if autocomplete isn't available (no lat/lng)
    if (!pickup.text.trim()) {
      newErrors.pickup = 'Please enter a pickup location';
    }
    if (!dropoff.text.trim()) {
      newErrors.dropoff = 'Please enter a drop-off location';
    }
    if (!pickupDatetime) {
      newErrors.pickupDatetime = 'Please select pickup date & time';
    } else {
      if (pickupDatetime <= new Date()) {
        newErrors.pickupDatetime = 'Pickup must be in the future';
      }
    }
    if (journeyType === 'return') {
      if (!returnDatetime) {
        newErrors.returnDatetime = 'Please select return date & time';
      } else if (pickupDatetime && returnDatetime <= pickupDatetime) {
        newErrors.returnDatetime = 'Return must be after pickup';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Build URL params to pass to quote page
    // Use text as fallback address if autocomplete wasn't used
    const params = new URLSearchParams({
      journeyType,
      pickupAddress: pickup.address || pickup.text,
      pickupPostcode: pickup.postcode || '',
      pickupLat: pickup.lat?.toString() || '',
      pickupLng: pickup.lng?.toString() || '',
      pickupPlaceId: pickup.placeId,
      dropoffAddress: dropoff.address || dropoff.text,
      dropoffPostcode: dropoff.postcode || '',
      dropoffLat: dropoff.lat?.toString() || '',
      dropoffLng: dropoff.lng?.toString() || '',
      dropoffPlaceId: dropoff.placeId,
      pickupDatetime: pickupDatetime?.toISOString() || '',
      vehicleType,
    });

    if (journeyType === 'return' && returnDatetime) {
      params.set('returnDatetime', returnDatetime.toISOString());
    }

    router.push(`/quote?${params.toString()}`);
  };

  return (
    <div className="relative">
      {/* Decorative Elements - Hidden on mobile for cleaner look */}
      <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-full bg-accent-500/20 blur-2xl sm:block" />
      <div className="absolute -bottom-4 -left-4 hidden h-32 w-32 rounded-full bg-primary-500/20 blur-2xl sm:block" />

      {/* Form Card - Responsive padding */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/15 to-white/5 p-5 shadow-2xl ring-1 ring-white/20 backdrop-blur-xl sm:rounded-3xl sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {/* Header */}
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-xl font-black text-white sm:text-2xl">Looking for a reliable taxi in the UK?</h3>
            <p className="text-xs text-primary-100 sm:text-sm">Get your instant quote and book to travel</p>
          </div>

          {/* Form */}
          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            {/* Journey Type Toggle - Min touch target 44px */}
            <div className="flex rounded-lg bg-white/10 p-1">
              <button
                type="button"
                onClick={() => setJourneyType('one-way')}
                className={`min-h-[44px] flex-1 rounded-md px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                  journeyType === 'one-way'
                    ? 'bg-white text-neutral-800 shadow'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                One Way
              </button>
              <button
                type="button"
                onClick={() => setJourneyType('return')}
                className={`min-h-[44px] flex-1 rounded-md px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                  journeyType === 'return'
                    ? 'bg-white text-neutral-800 shadow'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Return
              </button>
            </div>

            {/* Pickup Location */}
            <div>
              <AddressAutocomplete
                value={pickup.text}
                onChange={(text) => setPickup({ ...pickup, text })}
                onSelect={handlePickupSelect}
                placeholder="Pickup location"
                inputClassName="bg-white/90 text-neutral-800 placeholder-neutral-500"
                error={errors.pickup}
              />
            </div>

            {/* Dropoff Location */}
            <div>
              <AddressAutocomplete
                value={dropoff.text}
                onChange={(text) => setDropoff({ ...dropoff, text })}
                onSelect={handleDropoffSelect}
                placeholder="Drop-off location"
                inputClassName="bg-white/90 text-neutral-800 placeholder-neutral-500"
                error={errors.dropoff}
              />
            </div>

            {/* Pickup Date & Time */}
            <DateTimePicker
              value={pickupDatetime}
              onChange={(date) => {
                setPickupDatetime(date);
                setErrors((prev) => ({ ...prev, pickupDatetime: '' }));
              }}
              error={errors.pickupDatetime}
              placeholder="dd/mm/yyyy, hh:mm AM/PM"
              inputClassName="bg-white/90 text-neutral-800 placeholder-neutral-500"
            />

            {/* Return Date & Time (conditional) */}
            {journeyType === 'return' && (
              <DateTimePicker
                value={returnDatetime}
                onChange={(date) => {
                  setReturnDatetime(date);
                  setErrors((prev) => ({ ...prev, returnDatetime: '' }));
                }}
                error={errors.returnDatetime}
                placeholder="dd/mm/yyyy, hh:mm AM/PM"
                minDate={pickupDatetime || new Date()}
                inputClassName="bg-white/90 text-neutral-800 placeholder-neutral-500"
              />
            )}

            {/* Vehicle Type */}
            <Select
              options={VEHICLE_OPTIONS}
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-white/90 text-neutral-800"
            />

            {/* Submit Button - Min touch target 44px */}
            <button
              type="submit"
              className="min-h-[48px] w-full rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-accent-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-accent-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 active:scale-[0.98] sm:py-3.5 sm:text-base"
            >
              Get Instant Quote →
            </button>
          </form>

          {/* Form Benefits - Compact on mobile */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-white/20 pt-3 sm:flex-col sm:gap-2 sm:pt-4">
            <div className="flex items-center gap-1.5 text-xs text-primary-100 sm:gap-2 sm:text-sm">
              <svg className="h-3.5 w-3.5 shrink-0 text-accent-400 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant pricing</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary-100 sm:gap-2 sm:text-sm">
              <svg className="h-3.5 w-3.5 shrink-0 text-accent-400 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure booking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

