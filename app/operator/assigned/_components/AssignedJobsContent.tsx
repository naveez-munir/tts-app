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
import { jobApi } from '@/lib/api';
import type { Job } from '@/lib/types';

export default function AssignedJobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [driverDetails, setDriverDetails] = useState<Record<string, any>>({});
  const [submittingDriver, setSubmittingDriver] = useState<string | null>(null);
  const [completingJob, setCompletingJob] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobApi.getOperatorAssignedJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to load assigned jobs. Please try again.');
      console.error('Error fetching assigned jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmitDriverDetails = async (jobId: string) => {
    const details = driverDetails[jobId];
    if (!details?.driverName || !details?.driverPhone || !details?.vehicleRegistration) {
      alert('Please fill in all required driver details');
      return;
    }

    setSubmittingDriver(jobId);
    try {
      await jobApi.submitDriverDetails(jobId, details);
      await fetchJobs();
      setExpandedJob(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit driver details');
    } finally {
      setSubmittingDriver(null);
    }
  };

  const handleCompleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to mark this job as completed?')) return;

    setCompletingJob(jobId);
    try {
      await jobApi.markJobCompleted(jobId);
      await fetchJobs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to complete job');
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
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-600">{error}</p>
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
                  <div className="space-y-3">
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
                    <Input
                      label="Vehicle Registration *"
                      placeholder="AB21 CDE"
                      value={driverDetails[job.id]?.vehicleRegistration || ''}
                      onChange={(e) => updateDriverDetails(job.id, 'vehicleRegistration', e.target.value)}
                    />
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
              <div className="grid gap-4 md:grid-cols-2">
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
              <div className="grid gap-4 md:grid-cols-2">
                {completedJobs.map((job) => renderJobCard(job, true))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

