'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { z } from 'zod';

// UK-specific validation schema for operator registration
const OperatorRegistrationSchema = z.object({
  // Personal Details
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phoneNumber: z.string().regex(/^(\+44|0)[1-9]\d{9,10}$/, 'Invalid UK phone number (e.g., 07700900000 or +447700900000)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
  confirmPassword: z.string(),
  
  // Company Details
  companyName: z.string().min(1, 'Company name is required'),
  registrationNumber: z.string().min(1, 'Company registration number is required'),
  vatNumber: z.string().regex(/^GB\d{9}$/, 'Invalid UK VAT number (e.g., GB123456789)').optional().or(z.literal('')),
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 2;

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      // Validate personal details
      if (!formData.firstName.trim()) stepErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) stepErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) stepErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) stepErrors.email = 'Invalid email format';
      if (!formData.phoneNumber.trim()) stepErrors.phoneNumber = 'Phone number is required';
      else if (!/^(\+44|0)[1-9]\d{9,10}$/.test(formData.phoneNumber)) stepErrors.phoneNumber = 'Invalid UK phone number';
      if (!formData.password) stepErrors.password = 'Password is required';
      else if (formData.password.length < 8) stepErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) stepErrors.confirmPassword = "Passwords don't match";
    } else if (step === 2) {
      // Validate company details
      if (!formData.companyName.trim()) stepErrors.companyName = 'Company name is required';
      if (!formData.registrationNumber.trim()) stepErrors.registrationNumber = 'Registration number is required';
      if (formData.vatNumber && !/^GB\d{9}$/.test(formData.vatNumber)) {
        stepErrors.vatNumber = 'Invalid UK VAT number (format: GB123456789)';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
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
      // Validate with Zod
      const validatedData = OperatorRegistrationSchema.parse(formData);

      // Register operator via auth API
      await authApi.register({
        email: validatedData.email,
        password: validatedData.password,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber,
        role: 'OPERATOR',
        companyName: validatedData.companyName,
        registrationNumber: validatedData.registrationNumber,
        vatNumber: validatedData.vatNumber || undefined,
      });

      // Auto-login after registration
      const { user } = await authApi.login({
        email: validatedData.email,
        password: validatedData.password,
      });

      // Redirect to operator dashboard
      if (user.role === 'OPERATOR') {
        router.push('/operator/dashboard');
      }
    } catch (error: any) {
      if (error.issues) {
        // Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue: any) => {
          const field = issue.path[0];
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
      } else if (error.error) {
        // API errors
        setErrors({ general: error.error.message || 'Registration failed. Please try again.' });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2].map((step) => (
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
            Personal Details
          </span>
          <span className={currentStep === 2 ? 'text-primary-600' : 'text-neutral-500'}>
            Company Details
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

            <Input
              type="tel"
              label="Phone Number"
              placeholder="07700 900000 or +44 7700 900000"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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

            <div className="rounded-lg bg-primary-50 p-4 ring-1 ring-primary-100">
              <p className="text-sm text-neutral-700">
                <strong className="text-primary-700">Next Steps:</strong> After registration, you'll need to upload your operating license and insurance documents for verification. Our team will review within 48 hours.
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

