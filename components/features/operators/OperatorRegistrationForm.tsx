'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { PhoneInput, isValidPhoneNumber } from '@/components/ui/PhoneInput';
import { Button } from '@/components/ui/Button';
import { authApi, operatorApi } from '@/lib/api';
import { VEHICLE_TYPES } from '@/lib/data/quote.data';
import { z } from 'zod';

const UK_POSTCODE_AREAS = [
  'B', 'BA', 'BB', 'BD', 'BH', 'BL', 'BN', 'BR', 'BS', 'CA', 'CB', 'CF', 'CH', 'CM', 'CO', 'CR', 'CT', 'CV', 'CW',
  'DA', 'DD', 'DE', 'DG', 'DH', 'DL', 'DN', 'DT', 'DY', 'E', 'EC', 'EH', 'EN', 'EX', 'FK', 'FY', 'G', 'GL', 'GU',
  'HA', 'HD', 'HG', 'HP', 'HR', 'HS', 'HU', 'HX', 'IG', 'IP', 'IV', 'KA', 'KT', 'KW', 'KY', 'L', 'LA', 'LD', 'LE',
  'LL', 'LN', 'LS', 'LU', 'M', 'ME', 'MK', 'ML', 'N', 'NE', 'NG', 'NN', 'NP', 'NR', 'NW', 'OL', 'OX', 'PA', 'PE',
  'PH', 'PL', 'PO', 'PR', 'RG', 'RH', 'RM', 'S', 'SA', 'SE', 'SG', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SR', 'SS',
  'ST', 'SW', 'SY', 'TA', 'TD', 'TF', 'TN', 'TQ', 'TR', 'TS', 'TW', 'UB', 'W', 'WA', 'WC', 'WD', 'WF', 'WN', 'WR',
  'WS', 'WV', 'YO', 'ZE',
];

const OperatorRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phoneNumber: z.string().refine((val) => isValidPhoneNumber(val), {
    message: 'Please enter a valid phone number',
  }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
  companyName: z.string().min(1, 'Company name is required'),
  registrationNumber: z.string().min(1, 'Company registration number is required'),
  vatNumber: z.string().regex(/^GB\d{9}$/, 'Invalid UK VAT number (e.g., GB123456789)').optional().or(z.literal('')),
  serviceAreas: z.array(z.string()).min(1, 'Select at least one service area'),
  vehicleTypes: z.array(z.string()).min(1, 'Select at least one vehicle type'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof OperatorRegistrationSchema>;

export function OperatorRegistrationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    registrationNumber: '',
    vatNumber: '',
    serviceAreas: [],
    vehicleTypes: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serviceAreaInput, setServiceAreaInput] = useState('');

  const totalSteps = 3;

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) stepErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) stepErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) stepErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) stepErrors.email = 'Invalid email format';
      if (!formData.phoneNumber.trim()) stepErrors.phoneNumber = 'Phone number is required';
      else if (!isValidPhoneNumber(formData.phoneNumber)) stepErrors.phoneNumber = 'Please enter a valid phone number';
      if (!formData.password) stepErrors.password = 'Password is required';
      else if (formData.password.length < 8) stepErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = "Passwords don't match";
    } else if (step === 2) {
      if (!formData.companyName.trim()) stepErrors.companyName = 'Company name is required';
      if (!formData.registrationNumber.trim()) stepErrors.registrationNumber = 'Registration number is required';
      if (formData.vatNumber && !/^GB\d{9}$/.test(formData.vatNumber)) {
        stepErrors.vatNumber = 'Invalid UK VAT number (format: GB123456789)';
      }
    } else if (step === 3) {
      if (formData.serviceAreas.length === 0) stepErrors.serviceAreas = 'Add at least one service area';
      if (formData.vehicleTypes.length === 0) stepErrors.vehicleTypes = 'Select at least one vehicle type';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleAddServiceArea = () => {
    const area = serviceAreaInput.trim().toUpperCase();
    if (area && UK_POSTCODE_AREAS.includes(area) && !formData.serviceAreas.includes(area)) {
      setFormData({ ...formData, serviceAreas: [...formData.serviceAreas, area] });
      setServiceAreaInput('');
      setErrors({ ...errors, serviceAreas: '' });
    } else if (area && !UK_POSTCODE_AREAS.includes(area)) {
      setErrors({ ...errors, serviceAreas: 'Invalid UK postcode area' });
    }
  };

  const handleRemoveServiceArea = (area: string) => {
    setFormData({ ...formData, serviceAreas: formData.serviceAreas.filter((a) => a !== area) });
  };

  const handleToggleVehicleType = (type: string) => {
    const current = formData.vehicleTypes;
    if (current.includes(type)) {
      setFormData({ ...formData, vehicleTypes: current.filter((t) => t !== type) });
    } else {
      setFormData({ ...formData, vehicleTypes: [...current, type] });
    }
    setErrors({ ...errors, vehicleTypes: '' });
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrors({}); // Clear errors when moving to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setErrors({});

    try {
      const validatedData = OperatorRegistrationSchema.parse(formData);

      await authApi.register({
        email: validatedData.email,
        password: validatedData.password,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
        role: 'OPERATOR',
      });

      await authApi.login({
        email: validatedData.email,
        password: validatedData.password,
      });

      await operatorApi.registerOperator({
        companyName: validatedData.companyName,
        registrationNumber: validatedData.registrationNumber,
        vatNumber: validatedData.vatNumber || undefined,
        serviceAreas: validatedData.serviceAreas,
        vehicleTypes: validatedData.vehicleTypes as ('SALOON' | 'ESTATE' | 'MPV' | 'EXECUTIVE' | 'EXECUTIVE_LUXURY' | 'EXECUTIVE_PEOPLE_CARRIER' | 'GREEN_CAR' | 'MINIBUS')[],
      });

      router.push('/operator/dashboard');
    } catch (error: any) {
      if (error.issues) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue: any) => {
          const field = issue.path[0];
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (error.error) {
        setErrors({ general: error.error.message || 'Registration failed. Please try again.' });
      } else if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-1 items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                  step <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-200 text-neutral-500'
                }`}
              >
                {step}
              </div>
              {step < totalSteps && (
                <div
                  className={`mx-2 h-1 flex-1 ${
                    step < currentStep ? 'bg-primary-600' : 'bg-neutral-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-sm font-medium">
          <span className={currentStep === 1 ? 'text-primary-600' : 'text-neutral-500'}>
            Personal
          </span>
          <span className={currentStep === 2 ? 'text-primary-600' : 'text-neutral-500'}>
            Company
          </span>
          <span className={currentStep === 3 ? 'text-primary-600' : 'text-neutral-500'}>
            Services
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-neutral-200">
        {/* General Error */}
        {errors.general && (
          <div className="rounded-lg bg-error-50 p-4 text-sm text-error-700">
            {errors.general}
          </div>
        )}

        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Personal Details</h2>
              <p className="mt-1 text-neutral-600">Create your operator account</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                error={errors.firstName}
                disabled={isLoading}
                required
              />

              <Input
                label="Last Name"
                placeholder="Smith"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                error={errors.lastName}
                disabled={isLoading}
                required
              />
            </div>

            <Input
              type="email"
              label="Email Address"
              placeholder="john.smith@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              disabled={isLoading}
              required
            />

            <PhoneInput
              label="Phone Number"
              placeholder="7700 900000"
              value={formData.phoneNumber}
              onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
              error={errors.phoneNumber}
              disabled={isLoading}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Min 8 characters, 1 uppercase, 1 lowercase, 1 number"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              disabled={isLoading}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              disabled={isLoading}
              required
            />
          </div>
        )}

        {/* Step 2: Company Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Company Details</h2>
              <p className="mt-1 text-neutral-600">Tell us about your transport business</p>
            </div>

            <Input
              label="Company Name"
              placeholder="ABC Transport Ltd"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              error={errors.companyName}
              disabled={isLoading}
              required
            />

            <Input
              label="Company Registration Number"
              placeholder="12345678"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              error={errors.registrationNumber}
              disabled={isLoading}
              required
            />

            <Input
              label="VAT Number (Optional)"
              placeholder="GB123456789"
              value={formData.vatNumber}
              onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
              error={errors.vatNumber}
              disabled={isLoading}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900">Service Details</h2>
              <p className="mt-1 text-neutral-600">Define your coverage and vehicle types</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Service Areas <span className="text-error-500">*</span>
              </label>
              <p className="mb-3 text-sm text-neutral-500">
                Enter UK postcode areas you cover (e.g., SW, W1, B, M)
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter postcode area (e.g., SW)"
                  value={serviceAreaInput}
                  onChange={(e) => setServiceAreaInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddServiceArea();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddServiceArea} disabled={isLoading}>
                  Add
                </Button>
              </div>
              {errors.serviceAreas && (
                <p className="mt-1 text-sm text-error-600">{errors.serviceAreas}</p>
              )}
              {formData.serviceAreas.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-700"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveServiceArea(area)}
                        className="ml-1 rounded-full p-0.5 hover:bg-accent-200"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Vehicle Types <span className="text-error-500">*</span>
              </label>
              <p className="mb-3 text-sm text-neutral-500">
                Select the vehicle types in your fleet
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {VEHICLE_TYPES.map((vehicle) => (
                  <label
                    key={vehicle.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      formData.vehicleTypes.includes(vehicle.value)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.vehicleTypes.includes(vehicle.value)}
                      onChange={() => handleToggleVehicleType(vehicle.value)}
                      disabled={isLoading}
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-neutral-700">{vehicle.label}</span>
                      <span className="ml-2 text-xs text-neutral-500">({vehicle.passengers} pax)</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.vehicleTypes && (
                <p className="mt-1 text-sm text-error-600">{errors.vehicleTypes}</p>
              )}
            </div>

            <div className="rounded-lg bg-primary-50 p-4 ring-1 ring-primary-100">
              <p className="text-sm text-neutral-700">
                <strong className="text-primary-700">Next Steps:</strong> After registration, you&apos;ll need to upload your operating licence and insurance documents for verification. Our team will review within 48 hours.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1"
            >
              Back
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              type="button"
              variant="accent"
              size="lg"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating account...' : 'Complete Registration'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

