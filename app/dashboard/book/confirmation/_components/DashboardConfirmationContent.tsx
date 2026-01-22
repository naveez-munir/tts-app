'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Mail, Phone, Calendar, Copy, ArrowRight, Plus } from 'lucide-react';

interface ConfirmationData {
  type: 'single' | 'return';
  bookingReference?: string;
  groupReference?: string;
  bookingId?: string;
  bookingGroupId?: string;
  paymentIntentId: string;
}

export function DashboardConfirmationContent() {
  const router = useRouter();
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('bookingConfirmation');
    if (!stored) {
      router.push('/dashboard');
      return;
    }

    try {
      setConfirmationData(JSON.parse(stored));
    } catch {
      router.push('/dashboard');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleCopyReference = () => {
    const ref = confirmationData?.bookingReference || confirmationData?.groupReference;
    if (ref) {
      navigator.clipboard.writeText(ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!confirmationData) return null;

  const reference = confirmationData.bookingReference || confirmationData.groupReference;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent-100">
          <CheckCircle className="h-12 w-12 text-accent-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Booking Confirmed!</h1>
        <p className="mt-2 text-neutral-600">Thank you for booking with TTS Airport Transfers</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-500">Your Booking Reference</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="text-2xl font-black tracking-wider text-primary-600">{reference}</span>
            <button
              onClick={handleCopyReference}
              className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              title="Copy reference"
            >
              {copied ? <CheckCircle className="h-5 w-5 text-accent-500" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-500">Please save this reference for your records</p>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-neutral-900">What happens next?</h2>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100">
              <Mail className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Confirmation Email</p>
              <p className="text-sm text-neutral-600">
                You'll receive an email confirmation with your booking details shortly
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100">
              <Calendar className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">Driver Assignment</p>
              <p className="text-sm text-neutral-600">
                We'll assign a driver to your booking and send you their details 24 hours before pickup
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100">
              <Phone className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">SMS Reminder</p>
              <p className="text-sm text-neutral-600">
                You'll receive a text message with your driver's contact details on the day of travel
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-neutral-50 p-4">
          <p className="text-sm text-neutral-600">
            <strong>Need help?</strong> Contact us at{' '}
            <a href="tel:+441234567890" className="text-primary-600 hover:underline">
              01onal 234 567 890
            </a>{' '}
            or email{' '}
            <a href="mailto:customerservice@totaltravelsolution.com" className="text-primary-600 hover:underline">
              customerservice@totaltravelsolution.com
            </a>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link href="/dashboard">
          <Button variant="primary" className="w-full sm:w-auto">
            View My Bookings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/dashboard/book">
          <Button variant="outline" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Book Another Trip
          </Button>
        </Link>
      </div>
    </div>
  );
}

