'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  VEHICLE_TYPES,
  SERVICE_TYPES,
  PASSENGER_OPTIONS,
  LUGGAGE_OPTIONS,
} from '@/lib/data/quote.data';

/**
 * Quote Form Section Component
 * Multi-step form for getting a transfer quote
 */
export function QuoteFormSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Journey Details
    serviceType: 'AIRPORT_PICKUP',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    flightNumber: '',
    
    // Step 2: Passenger Info
    passengers: '1',
    luggage: '2',
    
    // Step 3: Vehicle Selection
    vehicleType: 'SALOON',
    
    // Step 4: Contact Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required';
      if (!formData.dropoffLocation) newErrors.dropoffLocation = 'Drop-off location is required';
      if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
      if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      // TODO: Submit form and calculate quote
      console.log('Form submitted:', formData);
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

            <Select
              label="Service Type"
              options={SERVICE_TYPES}
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            />

            <Input
              label="Pickup Location"
              placeholder="Enter pickup address or postcode"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              error={errors.pickupLocation}
            />

            <Input
              label="Drop-off Location"
              placeholder="Enter drop-off address or postcode"
              value={formData.dropoffLocation}
              onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
              error={errors.dropoffLocation}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="date"
                label="Pickup Date"
                value={formData.pickupDate}
                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                error={errors.pickupDate}
              />

              <Input
                type="time"
                label="Pickup Time"
                value={formData.pickupTime}
                onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                error={errors.pickupTime}
              />
            </div>

            {formData.serviceType === 'AIRPORT_PICKUP' && (
              <Input
                label="Flight Number (Optional)"
                placeholder="e.g., BA123"
                value={formData.flightNumber}
                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
              />
            )}
          </div>
        )}

        {/* Step 2: Passenger Info */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Passenger Information</h2>
              <p className="mt-1 text-neutral-600">How many passengers and luggage?</p>
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

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          {currentStep < totalSteps ? (
            <Button type="button" variant="primary" onClick={handleNext} className="flex-1">
              Next Step
            </Button>
          ) : (
            <Button type="submit" variant="accent" className="flex-1">
              Get Quote
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

