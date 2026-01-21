'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, Briefcase, Car, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getCurrentUser } from '@/lib/api/auth.api';
import { createBooking, createReturnBooking } from '@/lib/api/booking.api';
import type { User } from '@/lib/types/auth.types';
import type { SingleJourneyQuote, ReturnJourneyQuote, StopPoint } from '@/lib/types/quote.types';
import { ServiceType, VehicleType } from '@/lib/types/enums';
import { getFlippedServiceType } from '@/lib/utils/service-type';
import { PaymentSection } from '@/app/checkout/_components/PaymentSection';
import { getVehicleLabel } from '@/lib/hooks';

const MAX_BOOKING_ATTEMPTS = 3;

interface QuoteData {
  journeyType: 'one-way' | 'return';
  pickup: { address: string; postcode: string | null; lat: number; lng: number };
  dropoff: { address: string; postcode: string | null; lat: number; lng: number };
  stops?: StopPoint[];
  serviceType: string;
  pickupDatetime: string;
  returnDatetime?: string;
  flightNumber?: string;
  passengers: number;
  luggage: number;
  vehicleType: string;
  childSeats: number;
  boosterSeats: number;
  wheelchairAccess: boolean;
  pets: boolean;
  meetAndGreet: boolean;
  specialNotes?: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  quote: SingleJourneyQuote | ReturnJourneyQuote;
}

function isReturnQuote(quote: SingleJourneyQuote | ReturnJourneyQuote): quote is ReturnJourneyQuote {
  return 'outbound' in quote;
}

interface BookingInfo {
  type: 'single' | 'return';
  bookingId?: string;
  bookingGroupId?: string;
  bookingReference?: string;
  groupReference?: string;
}

export function DashboardCheckoutContent() {
  const router = useRouter();
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);

  const getRetryCount = () => {
    if (typeof window === 'undefined') return 0;
    const stored = sessionStorage.getItem('bookingRetryCount');
    return stored ? parseInt(stored, 10) : 0;
  };
  const [retryCount, setRetryCount] = useState(getRetryCount());

  useEffect(() => {
    const stored = sessionStorage.getItem('quoteData');
    if (!stored) {
      router.push('/dashboard/book');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setQuoteData(parsed);
    } catch {
      router.push('/dashboard/book');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/sign-in?returnUrl=/dashboard/book/checkout');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  const createBookingForPayment = useCallback(async () => {
    if (!quoteData || !user || bookingInfo) {
      return;
    }

    const currentRetryCount = getRetryCount();

    if (currentRetryCount >= MAX_BOOKING_ATTEMPTS) {
      setError(
        `Failed to create booking after ${MAX_BOOKING_ATTEMPTS} attempts. Please try again later or contact support.`
      );
      return;
    }

    const newRetryCount = currentRetryCount + 1;
    setRetryCount(newRetryCount);
    sessionStorage.setItem('bookingRetryCount', String(newRetryCount));

    setIsCreatingBooking(true);
    setError(null);

    try {
      const quote = quoteData.quote;
      // Build special requirements string (wheelchair, pets, and notes only)
      const specialReqs: string[] = [];
      if (quoteData.wheelchairAccess) specialReqs.push('Wheelchair access required');
      if (quoteData.pets) specialReqs.push('Travelling with pets');
      if (quoteData.specialNotes) specialReqs.push(quoteData.specialNotes);

      if (quoteData.journeyType === 'one-way') {
        const singleQuote = quote as SingleJourneyQuote;
        const booking = await createBooking({
          pickupAddress: quoteData.pickup.address,
          pickupPostcode: quoteData.pickup.postcode || '',
          pickupLat: quoteData.pickup.lat,
          pickupLng: quoteData.pickup.lng,
          dropoffAddress: quoteData.dropoff.address,
          dropoffPostcode: quoteData.dropoff.postcode || '',
          dropoffLat: quoteData.dropoff.lat,
          dropoffLng: quoteData.dropoff.lng,
          pickupDatetime: new Date(quoteData.pickupDatetime).toISOString(),
          passengerCount: quoteData.passengers,
          luggageCount: quoteData.luggage,
          vehicleType: quoteData.vehicleType as VehicleType,
          serviceType: quoteData.serviceType as ServiceType,
          flightNumber: quoteData.flightNumber,
          specialRequirements: specialReqs.length > 0 ? specialReqs.join('; ') : undefined,
          childSeats: quoteData.childSeats || 0,
          boosterSeats: quoteData.boosterSeats || 0,
          hasMeetAndGreet: quoteData.meetAndGreet || false,
          stops: quoteData.stops || [],
          customerName: `${quoteData.customerDetails.firstName} ${quoteData.customerDetails.lastName}`,
          customerEmail: quoteData.customerDetails.email,
          customerPhone: quoteData.customerDetails.phone,
          customerPrice: singleQuote.totalPrice,
          isReturnJourney: false,
        });

        setBookingInfo({
          type: 'single',
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
        });
        setRetryCount(0);
        sessionStorage.removeItem('bookingRetryCount');
      } else {
        const returnQuote = quote as ReturnJourneyQuote;
        const bookingGroup = await createReturnBooking({
          isReturnJourney: true,
          outbound: {
            pickupAddress: quoteData.pickup.address,
            pickupPostcode: quoteData.pickup.postcode || '',
            pickupLat: quoteData.pickup.lat,
            pickupLng: quoteData.pickup.lng,
            dropoffAddress: quoteData.dropoff.address,
            dropoffPostcode: quoteData.dropoff.postcode || '',
            dropoffLat: quoteData.dropoff.lat,
            dropoffLng: quoteData.dropoff.lng,
            pickupDatetime: new Date(quoteData.pickupDatetime).toISOString(),
            passengerCount: quoteData.passengers,
            luggageCount: quoteData.luggage,
            vehicleType: quoteData.vehicleType as VehicleType,
            serviceType: quoteData.serviceType as ServiceType,
            flightNumber: quoteData.flightNumber,
            specialRequirements: specialReqs.length > 0 ? specialReqs.join('; ') : undefined,
            childSeats: quoteData.childSeats || 0,
            boosterSeats: quoteData.boosterSeats || 0,
            hasMeetAndGreet: quoteData.meetAndGreet || false,
            stops: quoteData.stops || [],
            customerName: `${quoteData.customerDetails.firstName} ${quoteData.customerDetails.lastName}`,
            customerEmail: quoteData.customerDetails.email,
            customerPhone: quoteData.customerDetails.phone,
            customerPrice: returnQuote.outbound.totalPrice,
          },
          returnJourney: {
            pickupAddress: quoteData.dropoff.address,
            pickupPostcode: quoteData.dropoff.postcode || '',
            pickupLat: quoteData.dropoff.lat,
            pickupLng: quoteData.dropoff.lng,
            dropoffAddress: quoteData.pickup.address,
            dropoffPostcode: quoteData.pickup.postcode || '',
            dropoffLat: quoteData.pickup.lat,
            dropoffLng: quoteData.pickup.lng,
            pickupDatetime: new Date(quoteData.returnDatetime!).toISOString(),
            passengerCount: quoteData.passengers,
            luggageCount: quoteData.luggage,
            vehicleType: quoteData.vehicleType as VehicleType,
            serviceType: getFlippedServiceType(quoteData.serviceType as ServiceType),
            specialRequirements: specialReqs.length > 0 ? specialReqs.join('; ') : undefined,
            childSeats: quoteData.childSeats || 0,
            boosterSeats: quoteData.boosterSeats || 0,
            hasMeetAndGreet: quoteData.meetAndGreet || false,
            stops: [],
            customerName: `${quoteData.customerDetails.firstName} ${quoteData.customerDetails.lastName}`,
            customerEmail: quoteData.customerDetails.email,
            customerPhone: quoteData.customerDetails.phone,
            customerPrice: returnQuote.returnJourney.totalPrice,
          },
          totalPrice: returnQuote.totalPrice,
          discountAmount: returnQuote.discountAmount,
        });

        setBookingInfo({
          type: 'return',
          bookingGroupId: bookingGroup.id,
          groupReference: bookingGroup.groupReference,
        });
        setRetryCount(0);
        sessionStorage.removeItem('bookingRetryCount');
      }
    } catch (err) {
      const currentRetryCount = getRetryCount();
      console.error(`Booking creation failed (attempt ${currentRetryCount}/${MAX_BOOKING_ATTEMPTS}):`, err);

      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking.';
      const attemptsRemaining = MAX_BOOKING_ATTEMPTS - currentRetryCount;

      if (attemptsRemaining > 0) {
        setError(`${errorMessage} Retrying... (${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining)`);
      } else {
        setError(`${errorMessage} Maximum retry attempts reached. Please try again later or contact support.`);
      }
    } finally {
      setIsCreatingBooking(false);
    }
  }, [quoteData, user, bookingInfo]);

  useEffect(() => {
    if (user && quoteData && !bookingInfo && !isCreatingBooking && !loading) {
      createBookingForPayment();
    }
  }, [user, quoteData, bookingInfo, isCreatingBooking, loading, createBookingForPayment]);

  const handleRetryBooking = () => {
    setRetryCount(0);
    sessionStorage.removeItem('bookingRetryCount');
    setError(null);
    createBookingForPayment();
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!quoteData || !bookingInfo) return;

    if (bookingInfo.type === 'single') {
      sessionStorage.setItem('bookingConfirmation', JSON.stringify({
        type: 'single',
        bookingReference: bookingInfo.bookingReference,
        bookingId: bookingInfo.bookingId,
        paymentIntentId,
      }));
    } else {
      sessionStorage.setItem('bookingConfirmation', JSON.stringify({
        type: 'return',
        groupReference: bookingInfo.groupReference,
        bookingGroupId: bookingInfo.bookingGroupId,
        paymentIntentId,
      }));
    }

    sessionStorage.removeItem('quoteData');
    router.push('/dashboard/book/confirmation');
  };

  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // getVehicleLabel imported from lib/hooks

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!quoteData || !user) return null;

  const quote = quoteData.quote;
  const totalPrice = isReturnQuote(quote) ? quote.totalPrice : quote.totalPrice;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Complete Your Booking</h1>
        <p className="mt-1 text-neutral-600">Enter your payment details to confirm your booking</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 ring-1 ring-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-700">{error}</p>
                  {retryCount >= MAX_BOOKING_ATTEMPTS && (
                    <Button variant="outline" size="sm" onClick={handleRetryBooking} className="mt-3">
                      Try Again
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {isCreatingBooking ? (
            <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
              <h2 className="text-lg font-bold text-neutral-900">Creating Your Booking...</h2>
              <p className="mt-2 text-sm text-neutral-600">Please wait while we prepare your booking</p>
            </div>
          ) : bookingInfo ? (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
              <PaymentSection
                user={user}
                totalPrice={totalPrice}
                bookingId={bookingInfo.bookingId}
                bookingGroupId={bookingInfo.bookingGroupId}
                onSuccess={handlePaymentSuccess}
                isProcessing={isProcessing}
              />
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
            <h2 className="mb-4 text-lg font-bold text-neutral-900">Order Summary</h2>

            <div className="mb-4 flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-accent-500" />
                <div className="h-10 w-0.5 bg-neutral-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-primary-500" />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-xs text-neutral-500">From</p>
                  <p className="text-sm font-medium text-neutral-900 line-clamp-1">{quoteData.pickup.address}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500">To</p>
                  <p className="text-sm font-medium text-neutral-900 line-clamp-1">{quoteData.dropoff.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-neutral-400" />
                <span className="text-neutral-600">{formatDateTime(quoteData.pickupDatetime)}</span>
              </div>
              {quoteData.journeyType === 'return' && quoteData.returnDatetime && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <span className="text-neutral-600">Return: {formatDateTime(quoteData.returnDatetime)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-neutral-400" />
                <span className="text-neutral-600">{getVehicleLabel(quoteData.vehicleType)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-neutral-400" />
                <span className="text-neutral-600">{quoteData.passengers} passenger(s)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-neutral-400" />
                <span className="text-neutral-600">{quoteData.luggage} luggage</span>
              </div>
            </div>

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-neutral-900">Total</span>
                <span className="text-2xl font-black text-accent-600">£{totalPrice.toFixed(2)}</span>
              </div>
              {quoteData.journeyType === 'return' && (
                <p className="mt-1 text-xs text-accent-600">Includes 5% return discount</p>
              )}
            </div>

            <div className="mt-4 border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Lock className="h-4 w-4 text-accent-500" />
                <span>Secure SSL payment</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                <CheckCircle className="h-4 w-4 text-accent-500" />
                <span>Instant confirmation</span>
              </div>
            </div>

            <Link
              href="/dashboard/book/review"
              className="mt-4 block text-center text-sm text-neutral-600 hover:text-primary-600"
            >
              Edit Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

