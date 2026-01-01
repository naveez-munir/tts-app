'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { AddressAutocomplete, AddressValue } from '@/components/ui/AddressAutocomplete';
import {
  VEHICLE_TYPES,
  SERVICE_TYPES,
  PASSENGER_OPTIONS,
  LUGGAGE_OPTIONS,
} from '@/lib/data/quote.data';
import { calculateSingleQuote, calculateReturnQuote } from '@/lib/api/quote.api';
import { VehicleType } from '@/lib/types/enums';
import type { SingleJourneyQuote, ReturnJourneyQuote } from '@/lib/types/quote.types';

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
 * Quote Form Section Component
 * Multi-step form for getting a transfer quote
 */
export function QuoteFormSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Journey type
  const [journeyType, setJourneyType] = useState<'one-way' | 'return'>('one-way');

  // Location data (with geocoding info)
  const [pickup, setPickup] = useState<LocationData>(emptyLocation);
  const [dropoff, setDropoff] = useState<LocationData>(emptyLocation);

  // Form fields
  const [formData, setFormData] = useState({
    serviceType: 'AIRPORT_PICKUP',
    pickupDatetime: '',
    returnDatetime: '',
    flightNumber: '',
    passengers: '1',
    luggage: '2',
    vehicleType: 'SALOON',
    // Special requirements
    childSeats: '0',
    wheelchairAccess: false,
    pets: false,
    meetAndGreet: false,
    specialNotes: '',
    // Contact Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalSteps = 4;

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

    const pickupDatetime = searchParams.get('pickupDatetime');
    const returnDatetime = searchParams.get('returnDatetime');
    const vehicleType = searchParams.get('vehicleType');

    setFormData((prev) => ({
      ...prev,
      pickupDatetime: pickupDatetime || '',
      returnDatetime: returnDatetime || '',
      vehicleType: vehicleType || 'SALOON',
    }));
  }, [searchParams]);

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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!pickup.lat || !pickup.lng) {
        newErrors.pickup = 'Please select a pickup location';
      }
      if (!dropoff.lat || !dropoff.lng) {
        newErrors.dropoff = 'Please select a drop-off location';
      }
      if (!formData.pickupDatetime) {
        newErrors.pickupDatetime = 'Pickup date & time is required';
      } else {
        const pickupDate = new Date(formData.pickupDatetime);
        if (pickupDate <= new Date()) {
          newErrors.pickupDatetime = 'Pickup must be in the future';
        }
      }
      if (journeyType === 'return') {
        if (!formData.returnDatetime) {
          newErrors.returnDatetime = 'Return date & time is required';
        } else {
          const returnDate = new Date(formData.returnDatetime);
          const pickupDate = new Date(formData.pickupDatetime);
          if (returnDate <= pickupDate) {
            newErrors.returnDatetime = 'Return must be after pickup';
          }
        }
      }
    }

    if (step === 4) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const vehicleType = formData.vehicleType as VehicleType;
      const pickupDatetime = new Date(formData.pickupDatetime).toISOString();

      let quoteResult: SingleJourneyQuote | ReturnJourneyQuote;

      if (journeyType === 'one-way') {
        // Single journey quote
        quoteResult = await calculateSingleQuote({
          pickupLat: pickup.lat!,
          pickupLng: pickup.lng!,
          dropoffLat: dropoff.lat!,
          dropoffLng: dropoff.lng!,
          vehicleType,
          pickupDatetime,
          meetAndGreet: formData.meetAndGreet,
        });
      } else {
        // Return journey quote
        const returnDatetime = new Date(formData.returnDatetime).toISOString();
        quoteResult = await calculateReturnQuote({
          outbound: {
            pickupLat: pickup.lat!,
            pickupLng: pickup.lng!,
            dropoffLat: dropoff.lat!,
            dropoffLng: dropoff.lng!,
            vehicleType,
            pickupDatetime,
            meetAndGreet: formData.meetAndGreet,
          },
          returnJourney: {
            // Swap pickup and dropoff for return
            pickupLat: dropoff.lat!,
            pickupLng: dropoff.lng!,
            dropoffLat: pickup.lat!,
            dropoffLng: pickup.lng!,
            vehicleType,
            pickupDatetime: returnDatetime,
            meetAndGreet: false,
          },
        });
      }

      // Build complete booking data to store in sessionStorage
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
        serviceType: formData.serviceType,
        pickupDatetime: formData.pickupDatetime,
        returnDatetime: formData.returnDatetime,
        flightNumber: formData.flightNumber,
        passengers: parseInt(formData.passengers),
        luggage: parseInt(formData.luggage),
        vehicleType: formData.vehicleType,
        childSeats: parseInt(formData.childSeats),
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

      // Redirect to quote result page
      router.push('/quote/result');
    } catch (error) {
      console.error('Quote calculation failed:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to calculate quote. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
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

            <AddressAutocomplete
              label="Drop-off Location"
              value={dropoff.text}
              onChange={(text) => setDropoff({ ...dropoff, text })}
              onSelect={handleDropoffSelect}
              placeholder="Enter drop-off address or postcode"
              error={errors.dropoff}
            />

            <div className={journeyType === 'return' ? 'grid gap-4 sm:grid-cols-2' : ''}>
              <Input
                type="datetime-local"
                label="Pickup Date & Time"
                value={formData.pickupDatetime}
                onChange={(e) => setFormData({ ...formData, pickupDatetime: e.target.value })}
                error={errors.pickupDatetime}
              />

              {journeyType === 'return' && (
                <Input
                  type="datetime-local"
                  label="Return Date & Time"
                  value={formData.returnDatetime}
                  onChange={(e) => setFormData({ ...formData, returnDatetime: e.target.value })}
                  error={errors.returnDatetime}
                />
              )}
            </div>

            {(formData.serviceType === 'AIRPORT_PICKUP' || formData.serviceType === 'AIRPORT_DROPOFF') && (
              <Input
                label="Flight Number (Optional)"
                placeholder="e.g., BA123"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
              />

              <Select
                label="Number of Luggage"
                options={LUGGAGE_OPTIONS}
                value={formData.luggage}
                onChange={(e) => setFormData({ ...formData, luggage: e.target.value })}
              />
            </div>

            {/* Special Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-800">Special Requirements</h3>

              <Select
                label="Child Seats Required"
                options={[
                  { value: '0', label: 'No child seats needed' },
                  { value: '1', label: '1 child seat' },
                  { value: '2', label: '2 child seats' },
                  { value: '3', label: '3 child seats' },
                ]}
                value={formData.childSeats}
                onChange={(e) => setFormData({ ...formData, childSeats: e.target.value })}
              />

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

        {/* Step 3: Vehicle Selection */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Choose Your Vehicle</h2>
              <p className="mt-1 text-neutral-600">Select the vehicle type that suits your needs</p>
            </div>

            <div className="space-y-4">
              {VEHICLE_TYPES.map((vehicle) => (
                <label
                  key={vehicle.value}
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all ${
                    formData.vehicleType === vehicle.value
                      ? 'border-accent-500 bg-accent-50 ring-2 ring-accent-200'
                      : 'border-neutral-200 bg-white hover:border-accent-300 hover:bg-accent-50/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicleType"
                    value={vehicle.value}
                    checked={formData.vehicleType === vehicle.value}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="mt-1 h-5 w-5 text-accent-600 focus:ring-2 focus:ring-accent-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-neutral-900">{vehicle.label}</h3>
                      <span className={`text-sm font-semibold ${formData.vehicleType === vehicle.value ? 'text-accent-700' : 'text-neutral-600'}`}>
                        {vehicle.priceMultiplier === 1.0 ? 'Standard' : `+${((vehicle.priceMultiplier - 1) * 100).toFixed(0)}%`}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{vehicle.description}</p>
                    <div className="mt-2 flex gap-4 text-xs text-neutral-500">
                      <span>👥 {vehicle.passengers} passengers</span>
                      <span>🧳 {vehicle.luggage}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
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

            <Input
              type="tel"
              label="Phone Number"
              placeholder="+44 7700 900000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
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
          <div className="mt-4 rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
            <p className="text-sm text-red-700">{submitError}</p>
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

