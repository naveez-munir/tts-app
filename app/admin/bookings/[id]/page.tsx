'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowLeftRight, Calendar, Users, Car, Plane, CreditCard, RefreshCw, XCircle, Edit3, Briefcase, Luggage, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { StopsList } from '@/components/ui/StopsList';
import { refundBooking, cancelBooking, updateBooking, getBookingDetails } from '@/lib/api/admin.api';
import { formatDateTime, formatCurrency } from '@/lib/utils/date';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';
import type { StopResponse } from '@/lib/types';

interface BookingDetails {
  id: string;
  bookingReference: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDatetime: string;
  passengerCount: number;
  luggageCount: number;
  vehicleType: string;
  serviceType: string;
  flightNumber: string | null;
  specialRequirements: string | null;
  childSeats: number;
  boosterSeats: number;
  hasMeetAndGreet: boolean;
  stops: StopResponse[];
  customerPrice: number;
  isReturnJourney: boolean;
  bookingGroupId: string | null;
  linkedBooking?: { id: string; bookingReference: string; pickupDatetime: string; status: string } | null;
  customer: { name: string; email: string; phone: string };
  job: { id: string; status: string; winningBid: number | null; operatorName: string | null } | null;
}

// Helper to normalize API response (handles both snake_case and camelCase)
function normalizeBookingDetails(raw: Record<string, unknown>): BookingDetails {
  const customer = raw.customer as Record<string, unknown> | undefined;
  const job = raw.job as Record<string, unknown> | undefined;
  const linkedBooking = (raw.linkedBooking ?? raw.linked_booking) as Record<string, unknown> | undefined;

  return {
    id: (raw.id as string) || '',
    bookingReference: (raw.bookingReference ?? raw.booking_reference ?? '') as string,
    status: (raw.status ?? '') as string,
    pickupAddress: (raw.pickupAddress ?? raw.pickup_address ?? raw.pickup_location ?? '') as string,
    dropoffAddress: (raw.dropoffAddress ?? raw.dropoff_address ?? raw.dropoff_location ?? '') as string,
    pickupDatetime: (raw.pickupDatetime ?? raw.pickup_datetime ?? '') as string,
    passengerCount: (raw.passengerCount ?? raw.passenger_count ?? 1) as number,
    luggageCount: (raw.luggageCount ?? raw.luggage_count ?? 0) as number,
    vehicleType: (raw.vehicleType ?? raw.vehicle_type ?? '') as string,
    serviceType: (raw.serviceType ?? raw.service_type ?? '') as string,
    flightNumber: (raw.flightNumber ?? raw.flight_number ?? null) as string | null,
    specialRequirements: (raw.specialRequirements ?? raw.special_requirements ?? null) as string | null,
    childSeats: (raw.childSeats ?? raw.child_seats ?? 0) as number,
    boosterSeats: (raw.boosterSeats ?? raw.booster_seats ?? 0) as number,
    hasMeetAndGreet: (raw.hasMeetAndGreet ?? raw.has_meet_and_greet ?? false) as boolean,
    stops: (raw.stops ?? []) as StopResponse[],
    customerPrice: (raw.customerPrice ?? raw.customer_price ?? raw.quotedPrice ?? raw.quoted_price ?? 0) as number,
    isReturnJourney: (raw.isReturnJourney ?? raw.is_return_journey ?? false) as boolean,
    bookingGroupId: (raw.bookingGroupId ?? raw.booking_group_id ?? null) as string | null,
    linkedBooking: linkedBooking ? {
      id: (linkedBooking.id as string) || '',
      bookingReference: (linkedBooking.bookingReference ?? linkedBooking.booking_reference ?? '') as string,
      pickupDatetime: (linkedBooking.pickupDatetime ?? linkedBooking.pickup_datetime ?? '') as string,
      status: (linkedBooking.status ?? '') as string,
    } : null,
    customer: {
      name: (customer?.name ?? customer?.customerName ?? ((raw.customerName as string) || '')) as string,
      email: (customer?.email ?? customer?.customerEmail ?? ((raw.customerEmail as string) || '')) as string,
      phone: (customer?.phone ?? customer?.phoneNumber ?? customer?.customerPhone ?? ((raw.customerPhone as string) || '')) as string,
    },
    job: job ? {
      id: (job.id as string) || '',
      status: (job.status ?? '') as string,
      winningBid: (job.winningBid ?? job.winning_bid ?? null) as number | null,
      operatorName: (job.operatorName ?? job.operator_name ?? null) as string | null,
    } : null,
  };
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({ pickupDatetime: '', passengerCount: 1, luggageCount: 0, specialRequirements: '' });

  const fetchBooking = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getBookingDetails(bookingId);
      const rawBooking = response.data;
      const normalizedBooking = normalizeBookingDetails(rawBooking);
      setBooking(normalizedBooking);
      setEditForm({
        pickupDatetime: normalizedBooking.pickupDatetime.slice(0, 16),
        passengerCount: normalizedBooking.passengerCount,
        luggageCount: normalizedBooking.luggageCount,
        specialRequirements: normalizedBooking.specialRequirements || '',
      });
    } catch (err: unknown) {
      console.error('Failed to fetch booking:', err);
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleRefund = async () => {
    if (!booking) return;
    try {
      setIsProcessing(true);
      setActionError(null);
      await refundBooking(bookingId, { amount: booking.customerPrice, reason: 'Admin initiated refund' });
      setBooking((prev) => prev ? { ...prev, status: 'REFUNDED' } : null);
      setShowRefundDialog(false);
    } catch (err: unknown) {
      console.error('Failed to process refund:', err);
      const errorMessage = getContextualErrorMessage(err, 'submit');
      setActionError(errorMessage);
      setShowRefundDialog(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      setActionError(null);
      await cancelBooking(bookingId);
      setBooking((prev) => prev ? { ...prev, status: 'CANCELLED' } : null);
      setShowCancelDialog(false);
    } catch (err: unknown) {
      console.error('Failed to cancel booking:', err);
      const errorMessage = getContextualErrorMessage(err, 'submit');
      setActionError(errorMessage);
      setShowCancelDialog(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      setActionError(null);
      await updateBooking(bookingId, {
        pickupDatetime: new Date(editForm.pickupDatetime).toISOString(),
        passengerCount: editForm.passengerCount,
        luggageCount: editForm.luggageCount,
        specialRequirements: editForm.specialRequirements || undefined,
      });
      setBooking((prev) => prev ? {
        ...prev,
        pickupDatetime: new Date(editForm.pickupDatetime).toISOString(),
        passengerCount: editForm.passengerCount,
        luggageCount: editForm.luggageCount,
        specialRequirements: editForm.specialRequirements || null,
      } : null);
      setShowEditModal(false);
    } catch (err: unknown) {
      console.error('Failed to update booking:', err);
      const errorMessage = getContextualErrorMessage(err, 'update');
      setActionError(errorMessage);
      setShowEditModal(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const canModify = booking?.status === 'PENDING_PAYMENT' || booking?.status === 'PAID';
  const canCancel = booking?.status !== 'CANCELLED' && booking?.status !== 'REFUNDED' && booking?.status !== 'COMPLETED';
  const canRefund = booking?.status === 'PAID' || booking?.status === 'ASSIGNED';

  if (isLoading) return <LoadingOverlay message="Loading booking details..." />;

  if (error || !booking) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Booking</h2>
          <p className="mt-1 text-neutral-600">{error || 'Booking not found'}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={fetchBooking} variant="primary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const margin = booking.job?.winningBid ? booking.customerPrice - booking.job.winningBid : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-100 rounded-lg w-fit"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 font-mono">{booking.bookingReference}</h1>
            <StatusBadge variant={getStatusVariant(booking.status)}>{booking.status.replace('_', ' ')}</StatusBadge>
          </div>
          <p className="text-neutral-600">Pickup: {formatDateTime(booking.pickupDatetime)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canModify && <Button variant="outline" onClick={() => setShowEditModal(true)}><Edit3 className="w-4 h-4 mr-2" /> Modify</Button>}
          {canCancel && <Button variant="outline" onClick={() => setShowCancelDialog(true)}><XCircle className="w-4 h-4 mr-2" /> Cancel</Button>}
          {canRefund && <Button variant="outline" onClick={() => setShowRefundDialog(true)}><RefreshCw className="w-4 h-4 mr-2" /> Refund</Button>}
        </div>
      </div>

      {/* Action Error Display */}
      {actionError && (
        <div className="flex items-center justify-between rounded-lg border border-error-200 bg-error-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-error-600" />
            <p className="text-sm text-error-700">{actionError}</p>
          </div>
          <Button onClick={() => setActionError(null)} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Return Journey Link */}
      {booking.linkedBooking && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-primary-800">{booking.isReturnJourney ? 'Outbound Journey' : 'Return Journey'}: {booking.linkedBooking.bookingReference}</p>
                <p className="text-sm text-primary-600">{formatDateTime(booking.linkedBooking.pickupDatetime)} • {booking.linkedBooking.status}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/bookings/${booking.linkedBooking!.id}`)}>View</Button>
          </div>
        </div>
      )}

      {/* Operator Assignment */}
      {booking.job && (
        <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-secondary-600" />
            <div>
              <p className="font-medium text-secondary-800">Assigned to: {booking.job.operatorName || 'Pending'}</p>
              <p className="text-sm text-secondary-600">Job Status: {booking.job.status}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Details */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">Journey Details</h2>
          <div className="space-y-4">
            {booking.stops && booking.stops.length > 0 ? (
              <StopsList
                pickupAddress={booking.pickupAddress}
                dropoffAddress={booking.dropoffAddress}
                stops={booking.stops}
              />
            ) : (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-success-500 rounded-full" />
                  <div className="w-0.5 h-12 bg-neutral-200" />
                  <div className="w-3 h-3 bg-error-500 rounded-full" />
                </div>
                <div className="flex-1 space-y-4">
                  <div><p className="text-sm text-neutral-500">Pickup</p><p className="font-medium">{booking.pickupAddress}</p></div>
                  <div><p className="text-sm text-neutral-500">Drop-off</p><p className="font-medium">{booking.dropoffAddress}</p></div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-neutral-400" /><span className="text-sm">{formatDateTime(booking.pickupDatetime)}</span></div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-neutral-400" /><span className="text-sm">{booking.passengerCount} passengers</span></div>
              <div className="flex items-center gap-2"><Luggage className="w-4 h-4 text-neutral-400" /><span className="text-sm">{booking.luggageCount} luggage</span></div>
              <div className="flex items-center gap-2"><Car className="w-4 h-4 text-neutral-400" /><span className="text-sm">{booking.vehicleType}</span></div>
            </div>
            <div className="pt-4 space-y-2">
              {booking.serviceType && <div className="flex items-center gap-2"><span className="text-xs font-medium text-neutral-500">Service Type:</span><span className="text-sm font-medium text-neutral-700">{booking.serviceType.replace(/_/g, ' ')}</span></div>}
              {booking.flightNumber && <div className="flex items-center gap-2"><Plane className="w-4 h-4 text-neutral-400" /><span className="text-sm">Flight: {booking.flightNumber}</span></div>}
            </div>
            {(booking.childSeats > 0 || booking.boosterSeats > 0 || booking.hasMeetAndGreet) && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-neutral-500 mb-2">Service Options</p>
                <div className="flex flex-wrap gap-2">
                  {booking.childSeats > 0 && <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">{booking.childSeats} Child Seat{booking.childSeats > 1 ? 's' : ''}</span>}
                  {booking.boosterSeats > 0 && <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">{booking.boosterSeats} Booster Seat{booking.boosterSeats > 1 ? 's' : ''}</span>}
                  {booking.hasMeetAndGreet && <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">Meet & Greet</span>}
                </div>
              </div>
            )}
            {booking.specialRequirements && <div className="pt-4 border-t"><p className="text-sm text-neutral-500">Special Requirements</p><p className="text-sm">{booking.specialRequirements}</p></div>}
          </div>
        </div>

        {/* Customer & Financial */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="space-y-2">
              <p className="font-medium">{booking.customer.name}</p>
              <p className="text-sm text-neutral-600">{booking.customer.email}</p>
              <p className="text-sm text-neutral-600">{booking.customer.phone}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Financial</h2>
            <dl className="space-y-3">
              <div className="flex justify-between"><dt className="text-neutral-600">{booking.status === 'PENDING_PAYMENT' ? 'Quote Amount' : 'Customer Paid'}</dt><dd className="font-semibold">{formatCurrency(booking.customerPrice)}</dd></div>
              {booking.job?.winningBid && <div className="flex justify-between"><dt className="text-neutral-600">Operator Bid</dt><dd>{formatCurrency(booking.job.winningBid)}</dd></div>}
              {margin !== null && <div className="flex justify-between border-t pt-2"><dt className="font-medium">Platform Margin</dt><dd className="font-semibold text-success-600">{formatCurrency(margin)}</dd></div>}
            </dl>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Modify Booking</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input label="Pickup Date & Time" type="datetime-local" value={editForm.pickupDatetime} onChange={(e) => setEditForm({ ...editForm, pickupDatetime: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Passengers" type="number" min={1} max={16} value={editForm.passengerCount} onChange={(e) => setEditForm({ ...editForm, passengerCount: parseInt(e.target.value) })} />
                <Input label="Luggage" type="number" min={0} value={editForm.luggageCount} onChange={(e) => setEditForm({ ...editForm, luggageCount: parseInt(e.target.value) })} />
              </div>
              <Input label="Special Requirements" value={editForm.specialRequirements} onChange={(e) => setEditForm({ ...editForm, specialRequirements: e.target.value })} />
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button type="submit" disabled={isProcessing}>{isProcessing ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <ConfirmDialog isOpen={showRefundDialog} onClose={() => setShowRefundDialog(false)} onConfirm={handleRefund} title="Process Refund" message={`Refund ${formatCurrency(booking.customerPrice)} to ${booking.customer.name}? This action cannot be undone.`} confirmText="Process Refund" variant="warning" isLoading={isProcessing} />
      <ConfirmDialog isOpen={showCancelDialog} onClose={() => setShowCancelDialog(false)} onConfirm={handleCancel} title="Cancel Booking" message={`Are you sure you want to cancel booking ${booking.bookingReference}? The customer will be notified.`} confirmText="Cancel Booking" variant="danger" isLoading={isProcessing} />
    </div>
  );
}

