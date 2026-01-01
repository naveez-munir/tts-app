'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowLeftRight, Calendar, Users, Car, Plane, CreditCard, RefreshCw, XCircle, Edit3, Briefcase, Luggage } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { refundBooking, cancelBooking, updateBooking } from '@/lib/api/admin.api';
import { formatDateTime, formatCurrency } from '@/lib/utils/date';

interface BookingDetails {
  id: string;
  booking_reference: string;
  status: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  passenger_count: number;
  luggage_count: number;
  vehicle_type: string;
  flight_number: string | null;
  special_requirements: string | null;
  quoted_price: number;
  is_return_journey: boolean;
  booking_group_id: string | null;
  linked_booking?: { id: string; booking_reference: string; pickup_datetime: string; status: string } | null;
  customer: { name: string; email: string; phone: string };
  job: { id: string; status: string; winning_bid: number | null; operator_name: string | null } | null;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({ pickupDatetime: '', passengerCount: 1, luggageCount: 0, specialRequirements: '' });

  useEffect(() => {
    // Mock data for development
    const mockBooking: BookingDetails = {
      id: bookingId,
      booking_reference: 'TTS-ABC123',
      status: 'PAID',
      pickup_location: 'Heathrow Airport Terminal 5',
      dropoff_location: '10 Downing Street, London',
      pickup_datetime: '2025-01-25T14:30:00Z',
      passenger_count: 2,
      luggage_count: 3,
      vehicle_type: 'EXECUTIVE',
      flight_number: 'BA123',
      special_requirements: 'Child seat required',
      quoted_price: 85.00,
      is_return_journey: false,
      booking_group_id: 'group-123',
      linked_booking: { id: 'booking-2', booking_reference: 'TTS-ABC124', pickup_datetime: '2025-01-28T10:00:00Z', status: 'PAID' },
      customer: { name: 'John Smith', email: 'john@email.com', phone: '+44 7700 900000' },
      job: { id: 'job-1', status: 'ASSIGNED', winning_bid: 65.00, operator_name: 'London Express Cars' },
    };
    setBooking(mockBooking);
    setEditForm({
      pickupDatetime: mockBooking.pickup_datetime.slice(0, 16),
      passengerCount: mockBooking.passenger_count,
      luggageCount: mockBooking.luggage_count,
      specialRequirements: mockBooking.special_requirements || '',
    });
    setIsLoading(false);
  }, [bookingId]);

  const handleRefund = async () => {
    if (!booking) return;
    try {
      setIsProcessing(true);
      await refundBooking(bookingId, { amount: booking.quoted_price, reason: 'Admin initiated refund' });
      setBooking((prev) => prev ? { ...prev, status: 'REFUNDED' } : null);
      setShowRefundDialog(false);
    } catch (error) {
      console.error('Failed to process refund:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsProcessing(true);
      await cancelBooking(bookingId);
      setBooking((prev) => prev ? { ...prev, status: 'CANCELLED' } : null);
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      await updateBooking(bookingId, {
        pickupDatetime: new Date(editForm.pickupDatetime).toISOString(),
        passengerCount: editForm.passengerCount,
        luggageCount: editForm.luggageCount,
        specialRequirements: editForm.specialRequirements || undefined,
      });
      setBooking((prev) => prev ? {
        ...prev,
        pickup_datetime: new Date(editForm.pickupDatetime).toISOString(),
        passenger_count: editForm.passengerCount,
        luggage_count: editForm.luggageCount,
        special_requirements: editForm.specialRequirements || null,
      } : null);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const canModify = booking?.status === 'PENDING_PAYMENT' || booking?.status === 'PAID';
  const canCancel = booking?.status !== 'CANCELLED' && booking?.status !== 'REFUNDED' && booking?.status !== 'COMPLETED';
  const canRefund = booking?.status === 'PAID' || booking?.status === 'ASSIGNED';

  if (isLoading) return <LoadingOverlay message="Loading booking details..." />;
  if (!booking) return <div className="text-center py-12 text-error-600">Booking not found</div>;

  const margin = booking.job?.winning_bid ? booking.quoted_price - booking.job.winning_bid : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-100 rounded-lg w-fit"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 font-mono">{booking.booking_reference}</h1>
            <StatusBadge variant={getStatusVariant(booking.status)}>{booking.status.replace('_', ' ')}</StatusBadge>
          </div>
          <p className="text-neutral-600">Pickup: {formatDateTime(booking.pickup_datetime)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canModify && <Button variant="outline" onClick={() => setShowEditModal(true)}><Edit3 className="w-4 h-4 mr-2" /> Modify</Button>}
          {canCancel && <Button variant="outline" onClick={() => setShowCancelDialog(true)}><XCircle className="w-4 h-4 mr-2" /> Cancel</Button>}
          {canRefund && <Button variant="outline" onClick={() => setShowRefundDialog(true)}><RefreshCw className="w-4 h-4 mr-2" /> Refund</Button>}
        </div>
      </div>

      {/* Return Journey Link */}
      {booking.linked_booking && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-primary-800">{booking.is_return_journey ? 'Outbound Journey' : 'Return Journey'}: {booking.linked_booking.booking_reference}</p>
                <p className="text-sm text-primary-600">{formatDateTime(booking.linked_booking.pickup_datetime)} • {booking.linked_booking.status}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/bookings/${booking.linked_booking!.id}`)}>View</Button>
          </div>
        </div>
      )}

      {/* Operator Assignment */}
      {booking.job && (
        <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-secondary-600" />
            <div>
              <p className="font-medium text-secondary-800">Assigned to: {booking.job.operator_name || 'Pending'}</p>
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
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full" />
                <div className="w-0.5 h-12 bg-neutral-200" />
                <div className="w-3 h-3 bg-error-500 rounded-full" />
              </div>
              <div className="flex-1 space-y-4">
                <div><p className="text-sm text-neutral-500">Pickup</p><p className="font-medium">{booking.pickup_location}</p></div>
                <div><p className="text-sm text-neutral-500">Drop-off</p><p className="font-medium">{booking.dropoff_location}</p></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-neutral-400" /><span className="text-sm">{formatDateTime(booking.pickup_datetime)}</span></div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-neutral-400" /><span className="text-sm">{booking.passenger_count} passengers</span></div>
              <div className="flex items-center gap-2"><Luggage className="w-4 h-4 text-neutral-400" /><span className="text-sm">{booking.luggage_count} luggage</span></div>
              <div className="flex items-center gap-2"><Car className="w-4 h-4 text-neutral-400" /><span className="text-sm">{booking.vehicle_type}</span></div>
            </div>
            {booking.flight_number && <div className="flex items-center gap-2 pt-2"><Plane className="w-4 h-4 text-neutral-400" /><span className="text-sm">Flight: {booking.flight_number}</span></div>}
            {booking.special_requirements && <div className="pt-2"><p className="text-sm text-neutral-500">Special Requirements</p><p className="text-sm">{booking.special_requirements}</p></div>}
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
              <div className="flex justify-between"><dt className="text-neutral-600">Customer Paid</dt><dd className="font-semibold">{formatCurrency(booking.quoted_price)}</dd></div>
              {booking.job?.winning_bid && <div className="flex justify-between"><dt className="text-neutral-600">Operator Bid</dt><dd>{formatCurrency(booking.job.winning_bid)}</dd></div>}
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
      <ConfirmDialog isOpen={showRefundDialog} onClose={() => setShowRefundDialog(false)} onConfirm={handleRefund} title="Process Refund" message={`Refund ${formatCurrency(booking.quoted_price)} to ${booking.customer.name}? This action cannot be undone.`} confirmText="Process Refund" variant="warning" isLoading={isProcessing} />
      <ConfirmDialog isOpen={showCancelDialog} onClose={() => setShowCancelDialog(false)} onConfirm={handleCancel} title="Cancel Booking" message={`Are you sure you want to cancel booking ${booking.booking_reference}? The customer will be notified.`} confirmText="Cancel Booking" variant="danger" isLoading={isProcessing} />
    </div>
  );
}

