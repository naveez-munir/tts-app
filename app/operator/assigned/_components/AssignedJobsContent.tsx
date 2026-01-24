'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  AlertCircle,
  RefreshCw,
  Truck,
  User,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/Toast';
import { StopsIndicator } from '@/components/ui/StopsList';
import { jobApi } from '@/lib/api';
import { getVehicles } from '@/lib/api/operator.api';
import { getContextualErrorMessage, extractErrorMessage } from '@/lib/utils/error-handler';
import type { Job, Booking, Vehicle, StopResponse } from '@/lib/types';

/**
 * Normalize booking from snake_case API response to camelCase
 */
function normalizeBooking(data: Record<string, unknown>): Booking {
  return {
    id: (data.id as string) || '',
    bookingReference: (data.bookingReference ?? data.booking_reference ?? '') as string,
    customerId: (data.customerId ?? data.customer_id ?? '') as string,
    journeyType: (data.journeyType ?? data.journey_type ?? 'ONE_WAY') as Booking['journeyType'],
    bookingGroupId: (data.bookingGroupId ?? data.booking_group_id ?? null) as string | null,
    linkedBookingId: (data.linkedBookingId ?? data.linked_booking_id ?? null) as string | null,
    status: (data.status ?? 'PENDING') as Booking['status'],
    serviceType: (data.serviceType ?? data.service_type ?? 'POINT_TO_POINT') as Booking['serviceType'],
    pickupAddress: (data.pickupAddress ?? data.pickup_address ?? '') as string,
    pickupPostcode: (data.pickupPostcode ?? data.pickup_postcode ?? '') as string,
    pickupLat: Number(data.pickupLat ?? data.pickup_lat ?? 0),
    pickupLng: Number(data.pickupLng ?? data.pickup_lng ?? 0),
    dropoffAddress: (data.dropoffAddress ?? data.dropoff_address ?? '') as string,
    dropoffPostcode: (data.dropoffPostcode ?? data.dropoff_postcode ?? '') as string,
    dropoffLat: Number(data.dropoffLat ?? data.dropoff_lat ?? 0),
    dropoffLng: Number(data.dropoffLng ?? data.dropoff_lng ?? 0),
    pickupDatetime: (data.pickupDatetime ?? data.pickup_datetime ?? '') as string,
    passengerCount: Number(data.passengerCount ?? data.passenger_count ?? 1),
    luggageCount: Number(data.luggageCount ?? data.luggage_count ?? 0),
    vehicleType: (data.vehicleType ?? data.vehicle_type ?? 'SALOON') as Booking['vehicleType'],
    flightNumber: (data.flightNumber ?? data.flight_number ?? null) as string | null,
    specialRequirements: (data.specialRequirements ?? data.special_requirements ?? data.specialRequests ?? data.special_requests ?? null) as string | null,
    distanceMiles: data.distanceMiles != null ? Number(data.distanceMiles) : (data.distance_miles != null ? Number(data.distance_miles) : null),
    durationMinutes: data.durationMinutes != null ? Number(data.durationMinutes) : (data.duration_minutes != null ? Number(data.duration_minutes) : null),
    customerName: (data.customerName ?? data.customer_name ?? null) as string | null,
    customerEmail: (data.customerEmail ?? data.customer_email ?? null) as string | null,
    customerPhone: (data.customerPhone ?? data.customer_phone ?? null) as string | null,
    terminal: (data.terminal ?? null) as string | null,
    hasMeetAndGreet: Boolean(data.hasMeetAndGreet ?? data.has_meet_and_greet ?? false),
    childSeats: Number(data.childSeats ?? data.child_seats ?? 0),
    boosterSeats: Number(data.boosterSeats ?? data.booster_seats ?? 0),
    stops: (data.stops ?? []) as StopResponse[],
    customerPrice: Number(data.customerPrice ?? data.customer_price ?? data.quotedPrice ?? data.quoted_price ?? 0),
    createdAt: (data.createdAt ?? data.created_at ?? '') as string,
    updatedAt: (data.updatedAt ?? data.updated_at ?? '') as string,
  };
}

/**
 * Normalize driver details from snake_case API response to camelCase
 */
function normalizeDriverDetails(data: Record<string, unknown>): Job['driverDetails'] {
  return {
    id: (data.id as string) || '',
    jobId: (data.jobId ?? data.job_id ?? '') as string,
    driverName: (data.driverName ?? data.driver_name ?? '') as string,
    driverPhone: (data.driverPhone ?? data.driver_phone ?? '') as string,
    vehicleRegistration: (data.vehicleRegistration ?? data.vehicle_registration ?? '') as string,
    vehicleMake: (data.vehicleMake ?? data.vehicle_make ?? null) as string | null,
    vehicleModel: (data.vehicleModel ?? data.vehicle_model ?? null) as string | null,
    vehicleColor: (data.vehicleColor ?? data.vehicle_color ?? null) as string | null,
    taxiLicenceNumber: (data.taxiLicenceNumber ?? data.taxi_licence_number ?? null) as string | null,
    issuingCouncil: (data.issuingCouncil ?? data.issuing_council ?? null) as string | null,
    createdAt: (data.createdAt ?? data.created_at ?? '') as string,
    updatedAt: (data.updatedAt ?? data.updated_at ?? '') as string,
  };
}

/**
 * Normalize job from snake_case API response to camelCase
 */
function normalizeJob(data: Record<string, unknown>): Job {
  const bookingData = data.booking as Record<string, unknown> | undefined;
  const driverData = (data.driverDetails ?? data.driver_details) as Record<string, unknown> | undefined;

  return {
    id: (data.id as string) || '',
    bookingId: (data.bookingId ?? data.booking_id ?? '') as string,
    status: (data.status ?? 'PENDING_BIDS') as Job['status'],
    biddingWindowOpensAt: (data.biddingWindowOpensAt ?? data.bidding_window_opens_at ?? '') as string,
    biddingWindowClosesAt: (data.biddingWindowClosesAt ?? data.bidding_window_closes_at ?? '') as string,
    biddingWindowDurationHours: Number(data.biddingWindowDurationHours ?? data.bidding_window_duration_hours ?? 24),
    winningBidId: (data.winningBidId ?? data.winning_bid_id ?? null) as string | null,
    assignedOperatorId: (data.assignedOperatorId ?? data.assigned_operator_id ?? null) as string | null,
    platformMargin: data.platformMargin != null ? Number(data.platformMargin) : (data.platform_margin != null ? Number(data.platform_margin) : null),
    completedAt: (data.completedAt ?? data.completed_at ?? null) as string | null,
    createdAt: (data.createdAt ?? data.created_at ?? '') as string,
    updatedAt: (data.updatedAt ?? data.updated_at ?? '') as string,
    booking: bookingData ? normalizeBooking(bookingData) : undefined,
    bids: data.bids as Job['bids'],
    driverDetails: driverData ? normalizeDriverDetails(driverData) : undefined,
  };
}

/**
 * Normalize an array of jobs
 */
function normalizeJobs(data: unknown[]): Job[] {
  return data.map((item) => normalizeJob(item as Record<string, unknown>));
}

export default function AssignedJobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [driverDetails, setDriverDetails] = useState<Record<string, any>>({});
  const [submittingDriver, setSubmittingDriver] = useState<string | null>(null);
  const [completingJob, setCompletingJob] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const toast = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobApi.getOperatorAssignedJobs();
      // Normalize snake_case API response to camelCase
      const normalized = normalizeJobs(data as unknown[]);
      setJobs(normalized);
    } catch (err: unknown) {
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
      console.error('Error fetching assigned jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const vehiclesList = await getVehicles();
      setVehicles(vehiclesList.filter((v) => v.isActive));
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchVehicles();
  }, []);

  const handleSubmitDriverDetails = async (jobId: string) => {
    const details = driverDetails[jobId];
    if (!details?.driverName || !details?.driverPhone || !details?.vehicleRegistration) {
      toast.warning('Please fill in all required driver details');
      return;
    }

    setSubmittingDriver(jobId);
    try {
      await jobApi.submitDriverDetails(jobId, details);
      toast.success('Driver details submitted successfully');
      await fetchJobs();
      setExpandedJob(null);
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setSubmittingDriver(null);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to mark this job as completed?')) return;

    setCompletingJob(jobId);
    try {
      await jobApi.markJobCompleted(jobId);
      toast.success('Job marked as completed');
      await fetchJobs();
    } catch (err: unknown) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setCompletingJob(null);
    }
  };

  const updateDriverDetails = (jobId: string, field: string, value: string) => {
    setDriverDetails((prev) => ({
      ...prev,
      [jobId]: { ...prev[jobId], [field]: value },
    }));
  };

  const handleVehicleSelect = (jobId: string, vehicleId: string) => {
    if (vehicleId === 'manual') {
      // Clear vehicle fields for manual entry
      setDriverDetails((prev) => ({
        ...prev,
        [jobId]: {
          ...prev[jobId],
          vehicleRegistration: '',
          vehicleMake: '',
          vehicleModel: '',
          vehicleColor: '',
        },
      }));
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
    if (selectedVehicle) {
      setDriverDetails((prev) => ({
        ...prev,
        [jobId]: {
          ...prev[jobId],
          vehicleRegistration: selectedVehicle.registrationPlate,
          vehicleMake: selectedVehicle.make,
          vehicleModel: selectedVehicle.model,
          vehicleColor: '', // Keep empty as it's not in Vehicle schema
        },
      }));
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'warning';
      case 'ASSIGNED':
        return 'info';
      default:
        return 'default';
    }
  };

  // Separate jobs by status
  const upcomingJobs = jobs.filter((j) => ['ASSIGNED', 'IN_PROGRESS'].includes(j.status));
  const completedJobs = jobs.filter((j) => j.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Assigned Jobs</h2>
          <p className="mt-1 text-neutral-600">{error}</p>
        </div>
        <Button onClick={fetchJobs} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const renderJobCard = (job: Job, isCompleted: boolean = false) => {
    const booking = job.booking!;
    const hasDriverDetails = !!job.driverDetails;
    const isExpanded = expandedJob === job.id;

    return (
      <div
        key={job.id}
        className="rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
      >
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="font-mono text-sm text-neutral-500">
              {booking.bookingReference}
            </span>
            <StatusBadge variant={getStatusVariant(job.status)} className="ml-2">
              {job.status.replace('_', ' ')}
            </StatusBadge>
          </div>
        </div>

        {/* Journey Details */}
        <div className="mb-4 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-success-500" />
            <p className="text-sm text-neutral-700">{booking.pickupAddress}</p>
          </div>
          {booking.stops && booking.stops.length > 0 && (
            <div className="ml-6 flex items-center gap-2">
              <StopsIndicator count={booking.stops.length} />
            </div>
          )}
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
            <p className="text-sm text-neutral-700">{booking.dropoffAddress}</p>
          </div>
        </div>

        {/* Date/Time Info */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm text-neutral-600">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(booking.pickupDatetime)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(booking.pickupDatetime)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {booking.passengerCount} passengers
          </span>
        </div>

        {/* Additional Booking Details */}
        <div className="mb-4 space-y-2">
          {(booking.childSeats > 0 || booking.boosterSeats > 0) && (
            <div className="rounded-lg bg-warning-50 px-3 py-2">
              <p className="text-sm font-medium text-warning-700">
                ⚠️ Child Safety Requirements
              </p>
              <div className="mt-1 flex gap-4 text-xs text-warning-600">
                {booking.childSeats > 0 && <span>{booking.childSeats} child seat(s)</span>}
                {booking.boosterSeats > 0 && <span>{booking.boosterSeats} booster seat(s)</span>}
              </div>
            </div>
          )}

          {booking.terminal && (
            <div className="flex items-start gap-2 text-sm text-neutral-600">
              <span className="font-medium">Terminal:</span> {booking.terminal}
            </div>
          )}

          {booking.flightNumber && (
            <div className="flex items-start gap-2 text-sm text-neutral-600">
              <span className="font-medium">Flight:</span> {booking.flightNumber}
            </div>
          )}

          {booking.hasMeetAndGreet && (
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
                Meet & Greet
              </span>
            </div>
          )}

          {(booking.distanceMiles || booking.durationMinutes) && (
            <div className="flex gap-4 text-xs text-neutral-500">
              {booking.distanceMiles && <span>Distance: {booking.distanceMiles} miles</span>}
              {booking.durationMinutes && <span>Duration: ~{booking.durationMinutes} min</span>}
            </div>
          )}

          {booking.specialRequirements && (
            <div className="rounded-lg bg-neutral-50 px-3 py-2">
              <p className="text-xs font-medium text-neutral-700">Special Requirements:</p>
              <p className="mt-1 text-xs text-neutral-600">{booking.specialRequirements}</p>
            </div>
          )}
        </div>

        {/* Driver Details Section */}
        {!isCompleted && (
          <div className="border-t border-neutral-100 pt-4">
            {hasDriverDetails ? (
              <div className="rounded-lg bg-success-50 p-3">
                <p className="mb-2 text-sm font-medium text-success-700">Driver Assigned</p>
                <div className="grid gap-2 text-sm">
                  <p><User className="mr-1 inline h-4 w-4" />{job.driverDetails!.driverName}</p>
                  <p><Phone className="mr-1 inline h-4 w-4" />{job.driverDetails!.driverPhone}</p>
                  <p><Truck className="mr-1 inline h-4 w-4" />{job.driverDetails!.vehicleRegistration}</p>
                  {job.driverDetails!.vehicleMake && (
                    <p className="text-neutral-600">Make: {job.driverDetails!.vehicleMake}</p>
                  )}
                  {job.driverDetails!.vehicleModel && (
                    <p className="text-neutral-600">Model: {job.driverDetails!.vehicleModel}</p>
                  )}
                  {job.driverDetails!.vehicleColor && (
                    <p className="text-neutral-600">Color: {job.driverDetails!.vehicleColor}</p>
                  )}
                  {job.driverDetails!.taxiLicenceNumber && (
                    <p className="text-neutral-600">Licence: {job.driverDetails!.taxiLicenceNumber}</p>
                  )}
                  {job.driverDetails!.issuingCouncil && (
                    <p className="text-neutral-600">Council: {job.driverDetails!.issuingCouncil}</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                {!isExpanded ? (
                  <Button
                    onClick={() => setExpandedJob(job.id)}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    Add Driver Details
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {/* Vehicle Selection */}
                    {vehicles.length > 0 && (
                      <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700">
                          Select Vehicle (Optional)
                        </label>
                        <select
                          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                          onChange={(e) => handleVehicleSelect(job.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="">-- Select from your fleet or enter manually --</option>
                          {vehicles.map((vehicle) => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.registrationPlate} - {vehicle.year} {vehicle.make} {vehicle.model}
                            </option>
                          ))}
                          <option value="manual">✍️ Manual Entry (Clear Fields)</option>
                        </select>
                        <p className="mt-1 text-xs text-neutral-500">
                          Select a registered vehicle to auto-fill details, or enter manually below
                        </p>
                      </div>
                    )}

                    {/* Driver Details - 2 columns on desktop */}
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        label="Driver Name *"
                        placeholder="John Smith"
                        value={driverDetails[job.id]?.driverName || ''}
                        onChange={(e) => updateDriverDetails(job.id, 'driverName', e.target.value)}
                      />
                      <Input
                        label="Driver Phone *"
                        placeholder="+44 7700 900000"
                        value={driverDetails[job.id]?.driverPhone || ''}
                        onChange={(e) => updateDriverDetails(job.id, 'driverPhone', e.target.value)}
                      />
                    </div>

                    {/* Vehicle Details - 2 columns on desktop */}
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        label="Vehicle Registration *"
                        placeholder="AB21 CDE"
                        value={driverDetails[job.id]?.vehicleRegistration || ''}
                        onChange={(e) => updateDriverDetails(job.id, 'vehicleRegistration', e.target.value)}
                      />
                      <Input
                        label="Vehicle Make"
                        placeholder="Toyota"
                        value={driverDetails[job.id]?.vehicleMake || ''}
                        onChange={(e) => updateDriverDetails(job.id, 'vehicleMake', e.target.value)}
                      />
                      <Input
                        label="Vehicle Model"
                        placeholder="Prius"
                        value={driverDetails[job.id]?.vehicleModel || ''}
                        onChange={(e) => updateDriverDetails(job.id, 'vehicleModel', e.target.value)}
                      />
                      <Input
                        label="Vehicle Color"
                        placeholder="Silver"
                        value={driverDetails[job.id]?.vehicleColor || ''}
                        onChange={(e) => updateDriverDetails(job.id, 'vehicleColor', e.target.value)}
                      />
                    </div>

                    {/* Licence Details - 2 columns on desktop */}
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        label="Taxi Licence Number"
                        placeholder="TXL123456"
                        value={driverDetails[job.id]?.taxiLicenceNumber || ''}
                        onChange={(e) => updateDriverDetails(job.id, 'taxiLicenceNumber', e.target.value)}
                      />
                      <Input
                        label="Issuing Council"
                        placeholder="Birmingham City Council"
                        value={driverDetails[job.id]?.issuingCouncil || ''}
                        onChange={(e) => updateDriverDetails(job.id, 'issuingCouncil', e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setExpandedJob(null)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleSubmitDriverDetails(job.id)}
                        disabled={submittingDriver === job.id}
                        variant="primary"
                        size="sm"
                        className="flex-1"
                      >
                        {submittingDriver === job.id ? 'Saving...' : 'Save Details'}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {hasDriverDetails && job.status !== 'COMPLETED' && (
              <Button
                onClick={() => handleCompleteJob(job.id)}
                disabled={completingJob === job.id}
                variant="outline"
                size="sm"
                className="mt-3 w-full"
              >
                {completingJob === job.id ? 'Completing...' : 'Mark as Completed'}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Assigned Jobs</h1>
          <p className="mt-1 text-neutral-600">Manage your won jobs and assign drivers</p>
        </div>
        <Button onClick={fetchJobs} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="No assigned jobs"
          description="You haven't won any jobs yet. Keep bidding on available jobs!"
        />
      ) : (
        <div className="space-y-8">
          {/* Upcoming Jobs */}
          {upcomingJobs.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                Upcoming Jobs ({upcomingJobs.length})
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {upcomingJobs.map((job) => renderJobCard(job, false))}
              </div>
            </div>
          )}

          {/* Completed Jobs */}
          {completedJobs.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                Completed Jobs ({completedJobs.length})
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {completedJobs.map((job) => renderJobCard(job, true))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

