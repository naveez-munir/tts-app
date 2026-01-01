'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { MapPin, Calendar, Users, Briefcase, Car, Plane, ArrowRight, CheckCircle } from 'lucide-react';
import type { SingleJourneyQuote, ReturnJourneyQuote } from '@/lib/types/quote.types';

interface QuoteData {
  journeyType: 'one-way' | 'return';
  pickup: { address: string; postcode: string | null; lat: number; lng: number };
  dropoff: { address: string; postcode: string | null; lat: number; lng: number };
  serviceType: string;
  pickupDatetime: string;
  returnDatetime?: string;
  flightNumber?: string;
  passengers: number;
  luggage: number;
  vehicleType: string;
  childSeats: number;
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

export function QuoteResultContent() {
  const router = useRouter();
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('quoteData');
    if (stored) {
      try {
        setQuoteData(JSON.parse(stored));
      } catch {
        router.push('/quote');
      }
    } else {
      router.push('/quote');
    }
    setLoading(false);
  }, [router]);

  const handleProceedToBook = () => {
    router.push('/checkout');
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

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      AIRPORT_PICKUP: 'Airport Pickup',
      AIRPORT_DROPOFF: 'Airport Drop-off',
      POINT_TO_POINT: 'Point to Point',
    };
    return labels[type] || type;
  };

  const getVehicleLabel = (type: string) => {
    const labels: Record<string, string> = {
      SALOON: 'Saloon',
      ESTATE: 'Estate',
      MPV: 'MPV / People Carrier',
      EXECUTIVE: 'Executive',
      MINIBUS: 'Minibus',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!quoteData) return null;

  const quote = quoteData.quote;
  const totalPrice = isReturnQuote(quote) ? quote.totalPrice : quote.totalPrice;
  const distance = isReturnQuote(quote)
    ? (quote.outbound.distance?.distanceMiles || 0) + (quote.returnJourney.distance?.distanceMiles || 0)
    : quote.distance?.distanceMiles || 0;

  return (
    <>
      <Header variant="solid" />
      <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
              <CheckCircle className="h-8 w-8 text-accent-600" />
            </div>
            <h1 className="text-3xl font-black text-neutral-900">Your Quote is Ready!</h1>
            <p className="mt-2 text-neutral-600">
              Review your journey details and proceed to book
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Journey Summary - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Journey Details Card */}
              <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200">
                <h2 className="mb-4 text-lg font-bold text-neutral-900">Journey Details</h2>
                
                {/* Route */}
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-accent-500" />
                    <div className="h-16 w-0.5 bg-neutral-300" />
                    <div className="h-3 w-3 rounded-full bg-primary-500" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs font-medium uppercase text-neutral-500">Pickup</p>
                      <p className="font-semibold text-neutral-900">{quoteData.pickup.address}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase text-neutral-500">Drop-off</p>
                      <p className="font-semibold text-neutral-900">{quoteData.dropoff.address}</p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-500">Pickup</p>
                      <p className="text-sm font-medium">{formatDateTime(quoteData.pickupDatetime)}</p>
                    </div>
                  </div>

                  {quoteData.journeyType === 'return' && quoteData.returnDatetime && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-neutral-400" />
                      <div>
                        <p className="text-xs text-neutral-500">Return</p>
                        <p className="text-sm font-medium">{formatDateTime(quoteData.returnDatetime)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-500">Vehicle</p>
                      <p className="text-sm font-medium">{getVehicleLabel(quoteData.vehicleType)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-500">Service</p>
                      <p className="text-sm font-medium">{getServiceTypeLabel(quoteData.serviceType)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-500">Passengers</p>
                      <p className="text-sm font-medium">{quoteData.passengers}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-500">Luggage</p>
                      <p className="text-sm font-medium">{quoteData.luggage} pieces</p>
                    </div>
                  </div>

                  {quoteData.flightNumber && (
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-neutral-400" />
                      <div>
                        <p className="text-xs text-neutral-500">Flight</p>
                        <p className="text-sm font-medium">{quoteData.flightNumber}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Requirements */}
                {(quoteData.meetAndGreet || quoteData.childSeats > 0 || quoteData.wheelchairAccess || quoteData.pets) && (
                  <div className="mt-4 border-t border-neutral-100 pt-4">
                    <p className="mb-2 text-sm font-medium text-neutral-700">Special Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {quoteData.meetAndGreet && (
                        <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
                          Meet & Greet
                        </span>
                      )}
                      {quoteData.childSeats > 0 && (
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                          {quoteData.childSeats} Child Seat{quoteData.childSeats > 1 ? 's' : ''}
                        </span>
                      )}
                      {quoteData.wheelchairAccess && (
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                          Wheelchair Access
                        </span>
                      )}
                      {quoteData.pets && (
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                          Pets
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Details Card */}
              <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200">
                <h2 className="mb-4 text-lg font-bold text-neutral-900">Contact Details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-neutral-500">Name</p>
                    <p className="font-medium text-neutral-900">
                      {quoteData.customerDetails.firstName} {quoteData.customerDetails.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Email</p>
                    <p className="font-medium text-neutral-900">{quoteData.customerDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Phone</p>
                    <p className="font-medium text-neutral-900">{quoteData.customerDetails.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-neutral-200">
                <h2 className="mb-4 text-lg font-bold text-neutral-900">Price Summary</h2>

                {isReturnQuote(quote) ? (
                  <>
                    {/* Return Journey Breakdown */}
                    <div className="space-y-3 border-b border-neutral-100 pb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Outbound Journey</span>
                        <span className="font-medium">£{quote.outbound.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Return Journey</span>
                        <span className="font-medium">£{quote.returnJourney.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Subtotal</span>
                        <span className="font-medium">£{quote.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-accent-600">
                        <span>Return Discount ({quote.discountPercent}%)</span>
                        <span className="font-medium">-£{quote.discountAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Single Journey Breakdown */}
                    <div className="space-y-3 border-b border-neutral-100 pb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Base Fare</span>
                        <span className="font-medium">£{quote.baseFare.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Distance ({quote.distance?.distanceMiles.toFixed(1)} mi)</span>
                        <span className="font-medium">£{quote.distanceCharge.toFixed(2)}</span>
                      </div>
                      {quote.timeSurcharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Time Surcharge</span>
                          <span className="font-medium">£{quote.timeSurcharge.toFixed(2)}</span>
                        </div>
                      )}
                      {quote.holidaySurcharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Holiday Surcharge</span>
                          <span className="font-medium">£{quote.holidaySurcharge.toFixed(2)}</span>
                        </div>
                      )}
                      {quote.meetAndGreetFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-600">Meet & Greet</span>
                          <span className="font-medium">£{quote.meetAndGreetFee.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Total */}
                <div className="mt-4 flex justify-between">
                  <span className="text-lg font-bold text-neutral-900">Total</span>
                  <span className="text-2xl font-black text-accent-600">£{totalPrice.toFixed(2)}</span>
                </div>

                {/* Distance Info */}
                <p className="mt-2 text-xs text-neutral-500">
                  Estimated distance: {distance.toFixed(1)} miles
                </p>

                {/* CTA Button */}
                <Button
                  variant="accent"
                  className="mt-6 w-full"
                  onClick={handleProceedToBook}
                >
                  Proceed to Book
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Edit Quote Link */}
                <Link
                  href="/quote"
                  className="mt-3 block text-center text-sm text-neutral-600 hover:text-primary-600"
                >
                  Edit Quote Details
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 border-t border-neutral-100 pt-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <CheckCircle className="h-4 w-4 text-accent-500" />
                    <span>No hidden fees</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                    <CheckCircle className="h-4 w-4 text-accent-500" />
                    <span>Free cancellation up to 24hrs</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                    <CheckCircle className="h-4 w-4 text-accent-500" />
                    <span>Secure payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

