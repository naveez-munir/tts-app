'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Users, Briefcase, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { PhoneInput, isValidPhoneNumber } from '@/components/ui/PhoneInput';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { AddressAutocomplete, AddressValue } from '@/components/ui/AddressAutocomplete';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { RouteMapPreview } from '@/components/ui/RouteMapPreview';
import { MultiStopInput, StopData } from '@/components/ui/MultiStopInput';
import { getVehicleIcon } from '@/components/ui/VehicleIcons';
import {
  VEHICLE_TYPES as FALLBACK_VEHICLE_TYPES,
  SERVICE_TYPES,
  PASSENGER_OPTIONS,
  LUGGAGE_OPTIONS,
} from '@/lib/data/quote.data';
import type { VehicleType as VehicleTypeData } from '@/types/landing.types';
import { calculateSingleQuote, calculateReturnQuote, calculateAllVehiclesQuote } from '@/lib/api/quote.api';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';
import { VehicleType, ServiceType } from '@/lib/types/enums';
import { getFlippedServiceType } from '@/lib/utils/service-type';
import type { SingleJourneyQuote, ReturnJourneyQuote, VehicleQuoteItem } from '@/lib/types/quote.types';
import type { User } from '@/lib/types/auth.types';

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

interface QuoteFormSectionProps {
  resultUrl?: string;
  user?: User | null; // Logged-in user - will auto-fill contact details and skip step 4
  vehicleTypes?: VehicleTypeData[]; // Dynamic vehicle types from API (optional, falls back to static)
}

export function QuoteFormSection({ resultUrl = '/quote/result', user, vehicleTypes }: QuoteFormSectionProps) {
  // Use provided vehicle types or fall back to static data
  const VEHICLE_TYPES = vehicleTypes && vehicleTypes.length > 0 ? vehicleTypes : FALLBACK_VEHICLE_TYPES;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [vehicleQuotes, setVehicleQuotes] = useState<VehicleQuoteItem[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);

  const [journeyType, setJourneyType] = useState<'one-way' | 'return'>('one-way');

  // Location data (with geocoding info)
  const [pickup, setPickup] = useState<LocationData>(emptyLocation);
  const [dropoff, setDropoff] = useState<LocationData>(emptyLocation);
  const [stops, setStops] = useState<StopData[]>([]);

  // Form fields
  const [formData, setFormData] = useState({
    serviceType: 'AIRPORT_PICKUP',
    flightNumber: '',
    passengers: '1',
    luggage: '2',
    vehicleType: 'SALOON',
    childSeats: '0',
    boosterSeats: '0',
    wheelchairAccess: false,
    pets: false,
    meetAndGreet: false,
    specialNotes: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [pickupDatetime, setPickupDatetime] = useState<Date | null>(null);
  const [returnDatetime, setReturnDatetime] = useState<Date | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // If user is logged in, skip step 4 (contact details)
  const totalSteps = user ? 3 : 4;

  // Auto-fill contact details for logged-in users
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
      }));
    }
  }, [user]);

  // Pre-fill form from URL params (coming from hero form)
  useEffect(() => {
    const journeyTypeParam = searchParams.get('journeyType');
    if (journeyTypeParam === 'return') {
      setJourneyType('return');
    }

    const pickupAddress = searchParams.get('pickupAddress');
    const pickupLat = searchParams.get('pickupLat');
    const pickupLng = searchParams.get('pickupLng');
    const pickupPostcode = searchParams.get('pickupPostcode');
    const pickupPlaceId = searchParams.get('pickupPlaceId');

    if (pickupAddress && pickupLat && pickupLng) {
      setPickup({
        text: pickupAddress,
        address: pickupAddress,
        postcode: pickupPostcode || null,
        lat: parseFloat(pickupLat),
        lng: parseFloat(pickupLng),
        placeId: pickupPlaceId || '',
      });
    }

    const dropoffAddress = searchParams.get('dropoffAddress');
    const dropoffLat = searchParams.get('dropoffLat');
    const dropoffLng = searchParams.get('dropoffLng');
    const dropoffPostcode = searchParams.get('dropoffPostcode');
    const dropoffPlaceId = searchParams.get('dropoffPlaceId');

    if (dropoffAddress && dropoffLat && dropoffLng) {
      setDropoff({
        text: dropoffAddress,
        address: dropoffAddress,
        postcode: dropoffPostcode || null,
        lat: parseFloat(dropoffLat),
        lng: parseFloat(dropoffLng),
        placeId: dropoffPlaceId || '',
      });
    }

    const pickupDatetimeParam = searchParams.get('pickupDatetime');
    const returnDatetimeParam = searchParams.get('returnDatetime');
    const vehicleType = searchParams.get('vehicleType');

    if (pickupDatetimeParam) {
      setPickupDatetime(new Date(pickupDatetimeParam));
    }
    if (returnDatetimeParam) {
      setReturnDatetime(new Date(returnDatetimeParam));
    }

    setFormData((prev) => ({
      ...prev,
      vehicleType: vehicleType || 'SALOON',
    }));
  }, [searchParams]);

  // Memoize stopsForApi to prevent infinite re-renders in useEffect
  const stopsForApi = useMemo(
    () =>
      stops
        .filter((s) => s.lat && s.lng)
        .map((s) => ({ address: s.address, lat: s.lat!, lng: s.lng!, postcode: s.postcode || undefined })),
    [stops]
  );

  useEffect(() => {
    if (currentStep === 3 && pickup.lat && pickup.lng && dropoff.lat && dropoff.lng && pickupDatetime) {
      const fetchVehicleQuotes = async () => {
        setIsLoadingQuotes(true);
        try {
          const result = await calculateAllVehiclesQuote({
            pickupLat: pickup.lat!,
            pickupLng: pickup.lng!,
            dropoffLat: dropoff.lat!,
            dropoffLng: dropoff.lng!,
            pickupDatetime: pickupDatetime.toISOString(),
            isReturnJourney: journeyType === 'return',
            returnDatetime: returnDatetime?.toISOString(),
            meetAndGreet: formData.meetAndGreet,
            childSeats: parseInt(formData.childSeats) || 0,
            boosterSeats: parseInt(formData.boosterSeats) || 0,
            stops: stopsForApi,
            passengers: parseInt(formData.passengers),
            luggage: parseInt(formData.luggage),
          });
          setVehicleQuotes(result.vehicleQuotes);
        } catch (error) {
          console.error('Failed to fetch vehicle quotes:', error);
          setVehicleQuotes([]);
        } finally {
          setIsLoadingQuotes(false);
        }
      };

      fetchVehicleQuotes();
    }
  }, [currentStep, pickup.lat, pickup.lng, dropoff.lat, dropoff.lng, pickupDatetime, returnDatetime, journeyType, formData.meetAndGreet, formData.childSeats, formData.boosterSeats, stopsForApi, formData.passengers, formData.luggage]);

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

  // Find first available vehicle that can accommodate passengers and luggage
  const getFirstAvailableVehicle = (passengers: number, luggage: number): string => {
    const available = VEHICLE_TYPES.find(
      (v) => passengers <= v.maxPassengers && luggage <= v.maxLuggage
    );
    return available?.value || 'SALOON';
  };

  // Handle passenger/luggage change with auto-select
  const handlePassengerChange = (newPassengers: string) => {
    const passengers = parseInt(newPassengers);
    const luggage = parseInt(formData.luggage);
    const currentVehicle = VEHICLE_TYPES.find((v) => v.value === formData.vehicleType);

    // Check if current vehicle can still accommodate
    const isCurrentValid = currentVehicle &&
      passengers <= currentVehicle.maxPassengers &&
      luggage <= currentVehicle.maxLuggage;

    if (isCurrentValid) {
      setFormData({ ...formData, passengers: newPassengers });
    } else {
      // Auto-select first available vehicle
      const newVehicle = getFirstAvailableVehicle(passengers, luggage);
      setFormData({ ...formData, passengers: newPassengers, vehicleType: newVehicle });
    }
  };

  const handleLuggageChange = (newLuggage: string) => {
    const passengers = parseInt(formData.passengers);
    const luggage = parseInt(newLuggage);
    const currentVehicle = VEHICLE_TYPES.find((v) => v.value === formData.vehicleType);

    // Check if current vehicle can still accommodate
    const isCurrentValid = currentVehicle &&
      passengers <= currentVehicle.maxPassengers &&
      luggage <= currentVehicle.maxLuggage;

    if (isCurrentValid) {
      setFormData({ ...formData, luggage: newLuggage });
    } else {
      // Auto-select first available vehicle
      const newVehicle = getFirstAvailableVehicle(passengers, luggage);
      setFormData({ ...formData, luggage: newLuggage, vehicleType: newVehicle });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!pickup.lat || !pickup.lng) {
        newErrors.pickup = 'Please select a pickup location';
      }
      if (!dropoff.lat || !dropoff.lng) {
        newErrors.dropoff = 'Please select a drop-off location';
      }
      if (!pickupDatetime) {
        newErrors.pickupDatetime = 'Pickup date & time is required';
      } else {
        if (pickupDatetime <= new Date()) {
          newErrors.pickupDatetime = 'Pickup must be in the future';
        }
      }
      if (journeyType === 'return') {
        if (!returnDatetime) {
          newErrors.returnDatetime = 'Return date & time is required';
        } else if (pickupDatetime && returnDatetime <= pickupDatetime) {
          newErrors.returnDatetime = 'Return must be after pickup';
        }
      }
      if (formData.serviceType === 'AIRPORT_PICKUP' && !formData.flightNumber.trim()) {
        newErrors.flightNumber = 'Flight number is required for airport pickup';
      }
    }

    if (step === 3) {
      const selectedVehicle = VEHICLE_TYPES.find(v => v.value === formData.vehicleType);
      const passengerCount = parseInt(formData.passengers);
      const luggageCount = parseInt(formData.luggage);

      if (selectedVehicle) {
        if (passengerCount > selectedVehicle.maxPassengers || luggageCount > selectedVehicle.maxLuggage) {
          newErrors.vehicleType = 'Please select a vehicle that can accommodate your passengers and luggage';
        }
      }
    }

    if (step === 4) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      else if (!isValidPhoneNumber(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (validateStep(currentStep)) {
      // Clear errors before moving to next step to ensure clean slate
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    // Clear errors when going back to previous step
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const vehicleType = formData.vehicleType as VehicleType;
      const pickupDatetimeISO = pickupDatetime!.toISOString();

      let quoteResult: SingleJourneyQuote | ReturnJourneyQuote;

      const childSeatsCount = parseInt(formData.childSeats) || 0;
      const boosterSeatsCount = parseInt(formData.boosterSeats) || 0;

      if (journeyType === 'one-way') {
        quoteResult = await calculateSingleQuote({
          pickupLat: pickup.lat!,
          pickupLng: pickup.lng!,
          dropoffLat: dropoff.lat!,
          dropoffLng: dropoff.lng!,
          vehicleType,
          pickupDatetime: pickupDatetimeISO,
          serviceType: formData.serviceType as ServiceType,
          meetAndGreet: formData.meetAndGreet,
          childSeats: childSeatsCount,
          boosterSeats: boosterSeatsCount,
          stops: stopsForApi,
        });
      } else {
        const returnDatetimeISO = returnDatetime!.toISOString();
        quoteResult = await calculateReturnQuote({
          outbound: {
            pickupLat: pickup.lat!,
            pickupLng: pickup.lng!,
            dropoffLat: dropoff.lat!,
            dropoffLng: dropoff.lng!,
            vehicleType,
            pickupDatetime: pickupDatetimeISO,
            serviceType: formData.serviceType as ServiceType,
            meetAndGreet: formData.meetAndGreet,
            childSeats: childSeatsCount,
            boosterSeats: boosterSeatsCount,
            stops: stopsForApi,
          },
          returnJourney: {
            pickupLat: dropoff.lat!,
            pickupLng: dropoff.lng!,
            dropoffLat: pickup.lat!,
            dropoffLng: pickup.lng!,
            vehicleType,
            pickupDatetime: returnDatetimeISO,
            serviceType: getFlippedServiceType(formData.serviceType as ServiceType),
            meetAndGreet: false,
            childSeats: childSeatsCount,
            boosterSeats: boosterSeatsCount,
          },
        });
      }

      const bookingData = {
        journeyType,
        pickup: {
          address: pickup.address,
          postcode: pickup.postcode,
          lat: pickup.lat,
          lng: pickup.lng,
        },
        dropoff: {
          address: dropoff.address,
          postcode: dropoff.postcode,
          lat: dropoff.lat,
          lng: dropoff.lng,
        },
        stops: stopsForApi,
        serviceType: formData.serviceType,
        pickupDatetime: pickupDatetime?.toISOString() || '',
        returnDatetime: returnDatetime?.toISOString() || '',
        flightNumber: formData.flightNumber,
        passengers: parseInt(formData.passengers),
        luggage: parseInt(formData.luggage),
        vehicleType: formData.vehicleType,
        childSeats: parseInt(formData.childSeats),
        boosterSeats: parseInt(formData.boosterSeats),
        wheelchairAccess: formData.wheelchairAccess,
        pets: formData.pets,
        meetAndGreet: formData.meetAndGreet,
        specialNotes: formData.specialNotes,
        customerDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        quote: quoteResult,
      };

      // Store in sessionStorage for the result page
      sessionStorage.setItem('quoteData', JSON.stringify(bookingData));

      router.push(resultUrl);
    } catch (error: unknown) {
      console.error('Quote calculation failed:', error);
      const errorMessage = getContextualErrorMessage(error, 'submit');
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex flex-1 items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-md transition-all ${
                  step <= currentStep
                    ? 'bg-gradient-to-br from-accent-500 to-accent-600 text-white'
                    : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`mx-2 h-1 flex-1 rounded transition-all ${
                    step < currentStep ? 'bg-gradient-to-r from-accent-500 to-accent-600' : 'bg-neutral-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm font-semibold text-neutral-600">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-neutral-200 sm:p-10">
        {/* Step 1: Journey Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Journey Details</h2>
              <p className="mt-1 text-neutral-600">Where and when do you need to travel?</p>
            </div>

            {/* Journey Type Toggle */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-neutral-700">
                Journey Type
              </label>
              <div className="flex rounded-lg border border-neutral-300 p-1">
                <button
                  type="button"
                  onClick={() => setJourneyType('one-way')}
                  className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${
                    journeyType === 'one-way'
                      ? 'bg-primary-500 text-white shadow'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  One Way
                </button>
                <button
                  type="button"
                  onClick={() => setJourneyType('return')}
                  className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${
                    journeyType === 'return'
                      ? 'bg-primary-500 text-white shadow'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Return Journey
                </button>
              </div>
              {journeyType === 'return' && (
                <p className="mt-2 text-sm text-accent-600 font-medium">
                  ✓ 5% discount applied for return journeys
                </p>
              )}
            </div>

            <Select
              label="Service Type"
              options={SERVICE_TYPES}
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            />

            <AddressAutocomplete
              label="Pickup Location"
              value={pickup.text}
              onChange={(text) => setPickup({ ...pickup, text })}
              onSelect={handlePickupSelect}
              placeholder="Enter pickup address or postcode"
              error={errors.pickup}
            />

            <MultiStopInput
              stops={stops}
              onChange={setStops}
              maxStops={5}
            />

            <AddressAutocomplete
              label="Drop-off Location"
              value={dropoff.text}
              onChange={(text) => setDropoff({ ...dropoff, text })}
              onSelect={handleDropoffSelect}
              placeholder="Enter drop-off address or postcode"
              error={errors.dropoff}
            />

            <div className={journeyType === 'return' ? 'grid gap-4 sm:grid-cols-2' : ''}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Pickup Date & Time
                </label>
                <DateTimePicker
                  value={pickupDatetime}
                  onChange={(date) => {
                    setPickupDatetime(date);
                    setErrors((prev) => ({ ...prev, pickupDatetime: '' }));
                  }}
                  error={errors.pickupDatetime}
                  placeholder="dd/mm/yyyy, hh:mm AM/PM"
                />
              </div>

              {journeyType === 'return' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Return Date & Time
                  </label>
                  <DateTimePicker
                    value={returnDatetime}
                    onChange={(date) => {
                      setReturnDatetime(date);
                      setErrors((prev) => ({ ...prev, returnDatetime: '' }));
                    }}
                    error={errors.returnDatetime}
                    placeholder="dd/mm/yyyy, hh:mm AM/PM"
                    minDate={pickupDatetime || new Date()}
                  />
                </div>
              )}
            </div>

            {(formData.serviceType === 'AIRPORT_PICKUP' || formData.serviceType === 'AIRPORT_DROPOFF') && (
              <Input
                label={formData.serviceType === 'AIRPORT_PICKUP' ? 'Flight Number' : 'Flight Number (Optional)'}
                placeholder="e.g., BA123"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                error={errors.flightNumber}
                required={formData.serviceType === 'AIRPORT_PICKUP'}
              />
            )}
          </div>
        )}

        {/* Step 2: Passenger Info & Special Requirements */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Passengers & Requirements</h2>
              <p className="mt-1 text-neutral-600">Tell us about your passengers and any special needs</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Select
                label="Number of Passengers"
                options={PASSENGER_OPTIONS}
                value={formData.passengers}
                onChange={(e) => handlePassengerChange(e.target.value)}
              />

              <Select
                label="Number of Luggage"
                options={LUGGAGE_OPTIONS}
                value={formData.luggage}
                onChange={(e) => handleLuggageChange(e.target.value)}
              />
            </div>

            {/* Special Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-800">Special Requirements</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Child Seats"
                  options={[
                    { value: '0', label: 'None needed' },
                    { value: '1', label: '1 child seat (+£10)' },
                    { value: '2', label: '2 child seats (+£20)' },
                    { value: '3', label: '3 child seats (+£30)' },
                  ]}
                  value={formData.childSeats}
                  onChange={(e) => setFormData({ ...formData, childSeats: e.target.value })}
                />

                <Select
                  label="Booster Seats"
                  options={[
                    { value: '0', label: 'None needed' },
                    { value: '1', label: '1 booster seat (+£5)' },
                    { value: '2', label: '2 booster seats (+£10)' },
                    { value: '3', label: '3 booster seats (+£15)' },
                  ]}
                  value={formData.boosterSeats}
                  onChange={(e) => setFormData({ ...formData, boosterSeats: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.wheelchairAccess}
                    onChange={(e) => setFormData({ ...formData, wheelchairAccess: e.target.checked })}
                    className="h-5 w-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-neutral-700">Wheelchair accessible vehicle required</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.pets}
                    onChange={(e) => setFormData({ ...formData, pets: e.target.checked })}
                    className="h-5 w-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-neutral-700">Travelling with pets</span>
                </label>

                {(formData.serviceType === 'AIRPORT_PICKUP') && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.meetAndGreet}
                      onChange={(e) => setFormData({ ...formData, meetAndGreet: e.target.checked })}
                      className="h-5 w-5 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-neutral-700">Meet & Greet service</span>
                      <span className="ml-2 text-sm text-accent-600 font-medium">+£10</span>
                      <p className="text-sm text-neutral-500">Driver meets you in arrivals with a name board</p>
                    </div>
                  </label>
                )}

              </div>

              <Input
                label="Additional Notes (Optional)"
                placeholder="Any other requirements or special instructions..."
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
              />
            </div>

            <div className="rounded-lg bg-accent-50 p-4 ring-1 ring-accent-100">
              <p className="text-sm text-neutral-700">
                <strong className="text-accent-700">Note:</strong> Please ensure the vehicle you select can accommodate your passenger and luggage count.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Vehicle Selection with Map */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Choose Your Vehicle</h2>
              <p className="mt-1 text-neutral-600">Select the vehicle type that suits your needs</p>
            </div>

            {/* Responsive Layout: Map + Vehicle Cards */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Map Section - Left on Desktop, Top on Mobile */}
              <div className="lg:w-2/5 lg:sticky lg:top-4 lg:self-start">
                <RouteMapPreview
                  pickupLat={pickup.lat}
                  pickupLng={pickup.lng}
                  dropoffLat={dropoff.lat}
                  dropoffLng={dropoff.lng}
                  pickupAddress={pickup.address || pickup.text}
                  dropoffAddress={dropoff.address || dropoff.text}
                  stops={stopsForApi}
                  className="ring-1 ring-neutral-200 shadow-md"
                />
              </div>

              {/* Vehicle Cards - Right on Desktop, Bottom on Mobile */}
              <div className="lg:w-3/5 space-y-3">
                {isLoadingQuotes && (
                  <div className="flex items-center justify-center p-8 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-accent-600 border-t-transparent"></div>
                      <p className="text-sm text-neutral-600">Calculating prices...</p>
                    </div>
                  </div>
                )}
                {VEHICLE_TYPES.map((vehicle) => {
                  const isSelected = formData.vehicleType === vehicle.value;
                  const passengerCount = parseInt(formData.passengers);
                  const luggageCount = parseInt(formData.luggage);
                  const exceedsPassengers = passengerCount > vehicle.maxPassengers;
                  const exceedsLuggage = luggageCount > vehicle.maxLuggage;
                  const isDisabled = exceedsPassengers || exceedsLuggage;
                  const vehicleQuote = vehicleQuotes.find((q) => q.vehicleType === vehicle.value);

                  return (
                    <label
                      key={vehicle.value}
                      className={`group flex rounded-xl border-2 overflow-hidden transition-all ${
                        isDisabled
                          ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 opacity-60'
                          : isSelected
                            ? 'cursor-pointer border-accent-500 bg-accent-50 ring-2 ring-accent-200 shadow-md'
                            : 'cursor-pointer border-neutral-200 bg-white hover:border-accent-300 hover:shadow-sm'
                      }`}
                    >
                      <input
                        type="radio"
                        name="vehicleType"
                        value={vehicle.value}
                        checked={isSelected}
                        onChange={(e) => !isDisabled && setFormData({ ...formData, vehicleType: e.target.value })}
                        disabled={isDisabled}
                        className="sr-only"
                      />

                      {/* Vehicle Icon */}
                      <div className={`relative w-28 sm:w-36 md:w-44 flex-shrink-0 flex items-center justify-center p-3 transition-colors ${
                        isSelected ? 'bg-accent-100' : 'bg-neutral-50 group-hover:bg-neutral-100'
                      }`}>
                        {(() => {
                          const VehicleIcon = getVehicleIcon(vehicle.value);
                          return <VehicleIcon className="w-full h-auto max-h-16" />;
                        })()}
                        {/* Selection Indicator Overlay */}
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-accent-500 rounded-full p-1 shadow-sm">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Vehicle Info */}
                      <div className="flex-1 p-3 sm:p-4 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-neutral-900 truncate">
                            {vehicle.label}
                          </h3>
                          {vehicleQuote && !isLoadingQuotes ? (
                            <div className="flex flex-col items-end">
                              <span className={`text-base sm:text-lg font-bold whitespace-nowrap ${
                                isSelected ? 'text-accent-700' : 'text-neutral-900'
                              }`}>
                                £{vehicleQuote.totalPrice.toFixed(2)}
                              </span>
                              {vehicleQuote.discountAmount && vehicleQuote.discountAmount > 0 && (
                                <span className="text-xs text-success-600 font-medium">
                                  Save £{vehicleQuote.discountAmount.toFixed(2)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
                              isSelected ? 'text-accent-700' : 'text-neutral-500'
                            }`}>
                              {vehicle.priceMultiplier === 1.0 ? 'Standard' : `+${((vehicle.priceMultiplier - 1) * 100).toFixed(0)}%`}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs sm:text-sm text-neutral-600 line-clamp-1 sm:line-clamp-2">
                          {vehicle.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 sm:gap-4 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            <span>{vehicle.passengers}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">{vehicle.luggage}</span>
                            <span className="sm:hidden">{vehicle.luggage.split(',')[0]}</span>
                          </span>
                        </div>
                        {isDisabled && (
                          <p className="mt-2 text-xs text-error-600 font-medium">
                            {exceedsPassengers && exceedsLuggage
                              ? `Max ${vehicle.maxPassengers} passengers & ${vehicle.maxLuggage} bags`
                              : exceedsPassengers
                                ? `Max ${vehicle.maxPassengers} passengers`
                                : `Max ${vehicle.maxLuggage} bags`}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {errors.vehicleType && (
              <div className="flex items-start gap-3 rounded-lg bg-error-50 p-4 ring-1 ring-error-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-error-600" />
                <p className="text-sm text-error-700">{errors.vehicleType}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Contact Details */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Contact Details</h2>
              <p className="mt-1 text-neutral-600">How can we reach you with your quote?</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={errors.firstName}
              />

              <Input
                label="Last Name"
                placeholder="Smith"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={errors.lastName}
              />
            </div>

            <Input
              type="email"
              label="Email Address"
              placeholder="john.smith@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <PhoneInput
              label="Phone Number"
              placeholder="7700 900000"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              error={errors.phone}
              required
            />

            <div className="rounded-lg bg-accent-50 p-4 ring-1 ring-accent-100">
              <p className="text-sm text-neutral-700">
                <strong className="text-accent-700">Privacy:</strong> By submitting this form, you agree to receive your quote via email and SMS. We'll never share your details with third parties.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-error-50 p-4 ring-1 ring-error-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-error-600" />
            <p className="text-sm text-error-700">{submitError}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          {currentStep < totalSteps ? (
            <Button type="button" variant="primary" onClick={handleNext} className="flex-1">
              Next Step
            </Button>
          ) : (
            <Button
              type="submit"
              variant="accent"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Calculating Quote...' : 'Get Quote'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

