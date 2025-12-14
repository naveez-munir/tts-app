'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

/**
 * Contact Form Section Component
 * Reusable contact form with validation and submission
 */

interface InquiryType {
  value: string;
  label: string;
}

interface ContactFormSectionProps {
  title: string;
  subtitle: string;
  inquiryTypes: readonly InquiryType[];
}

export function ContactFormSection({ title, subtitle, inquiryTypes }: ContactFormSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    bookingReference: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'general',
        bookingReference: '',
        message: '',
      });
    }, 1500);
  };

  return (
    <section className="bg-neutral-50 py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
            {subtitle}
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg sm:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Phone and Inquiry Type Row */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+44 20 1234 5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Select
                label="Inquiry Type"
                options={inquiryTypes}
                value={formData.inquiryType}
                onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                required
              />
            </div>

            {/* Booking Reference (Optional) */}
            <Input
              label="Booking Reference (Optional)"
              type="text"
              placeholder="e.g., TH123456"
              value={formData.bookingReference}
              onChange={(e) => setFormData({ ...formData, bookingReference: e.target.value })}
            />

            {/* Message */}
            <Textarea
              label="Message"
              placeholder="Please provide details about your inquiry..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              required
            />

            {/* Submit Button */}
            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="rounded-lg bg-success-50 p-4 text-center">
                  <p className="text-sm font-semibold text-success-700">
                    ✓ Message sent successfully! We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="rounded-lg bg-error-50 p-4 text-center">
                  <p className="text-sm font-semibold text-error-700">
                    ✗ Failed to send message. Please try again or email us directly.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

