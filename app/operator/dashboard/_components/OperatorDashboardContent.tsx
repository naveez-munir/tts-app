'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Gavel,
  CheckCircle,
  Wallet,
  Star,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Clock,
  Timer,
  RefreshCw,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { getOperatorDashboard, operatorApi } from '@/lib/api';
import { OperatorApprovalStatus } from '@/lib/types/enums';
import { getContextualErrorMessage, isNotFoundError } from '@/lib/utils/error-handler';
import type { OperatorDashboard, OperatorProfile } from '@/lib/types';

/**
 * Normalize operator profile from snake_case API response to camelCase
 */
function normalizeProfile(data: Record<string, unknown>): OperatorProfile {
  return {
    id: (data.id as string) || '',
    userId: (data.userId ?? data.user_id ?? '') as string,
    companyName: (data.companyName ?? data.company_name ?? '') as string,
    registrationNumber: (data.registrationNumber ?? data.registration_number ?? '') as string,
    vatNumber: (data.vatNumber ?? data.vat_number ?? null) as string | null,
    approvalStatus: (data.approvalStatus ?? data.approval_status ?? 'PENDING') as OperatorProfile['approvalStatus'],
    reputationScore: Number(data.reputationScore ?? data.reputation_score ?? 0),
    totalJobs: Number(data.totalJobs ?? data.total_jobs ?? 0),
    completedJobs: Number(data.completedJobs ?? data.completed_jobs ?? 0),
    bankAccountName: (data.bankAccountName ?? data.bank_account_name ?? null) as string | null,
    bankAccountNumber: (data.bankAccountNumber ?? data.bank_account_number ?? null) as string | null,
    bankSortCode: (data.bankSortCode ?? data.bank_sort_code ?? null) as string | null,
    operatingLicenseNumber: (data.operatingLicenseNumber ?? data.operating_license_number ?? null) as string | null,
    councilRegistration: (data.councilRegistration ?? data.council_registration ?? null) as string | null,
    businessAddress: (data.businessAddress ?? data.business_address ?? null) as string | null,
    businessPostcode: (data.businessPostcode ?? data.business_postcode ?? null) as string | null,
    emergencyContactName: (data.emergencyContactName ?? data.emergency_contact_name ?? null) as string | null,
    emergencyContactPhone: (data.emergencyContactPhone ?? data.emergency_contact_phone ?? null) as string | null,
    fleetSize: data.fleetSize != null ? Number(data.fleetSize) : (data.fleet_size != null ? Number(data.fleet_size) : null),
    createdAt: (data.createdAt ?? data.created_at ?? '') as string,
    updatedAt: (data.updatedAt ?? data.updated_at ?? '') as string,
    vehicles: (data.vehicles ?? data.vehicles) as OperatorProfile['vehicles'],
    documents: (data.documents ?? data.documents) as OperatorProfile['documents'],
    serviceAreas: (data.serviceAreas ?? data.service_areas) as OperatorProfile['serviceAreas'],
  };
}

/**
 * Normalize operator dashboard from snake_case API response to camelCase
 */
function normalizeDashboard(data: Record<string, unknown>): OperatorDashboard {
  // Handle both nested structure (profile + stats) and flat structure
  const profileData = (data.profile ?? data) as Record<string, unknown>;
  const statsData = (data.stats ?? data) as Record<string, unknown>;

  return {
    profile: normalizeProfile(profileData),
    availableJobs: Number(statsData.availableJobs ?? statsData.available_jobs ?? data.availableJobs ?? data.available_jobs ?? 0),
    activeBids: Number(statsData.activeBids ?? statsData.active_bids ?? statsData.totalBids ?? statsData.total_bids ?? data.activeBids ?? data.active_bids ?? 0),
    wonJobs: Number(statsData.wonJobs ?? statsData.won_jobs ?? statsData.wonBids ?? statsData.won_bids ?? data.wonJobs ?? data.won_jobs ?? 0),
    completedJobs: Number(statsData.completedJobs ?? statsData.completed_jobs ?? data.completedJobs ?? data.completed_jobs ?? 0),
    totalEarnings: Number(statsData.totalEarnings ?? statsData.total_earnings ?? data.totalEarnings ?? data.total_earnings ?? 0),
    pendingPayouts: Number(statsData.pendingPayouts ?? statsData.pending_payouts ?? statsData.pendingEarnings ?? statsData.pending_earnings ?? data.pendingPayouts ?? data.pending_payouts ?? 0),
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: 'primary' | 'accent' | 'success' | 'warning';
  href?: string;
}

function StatCard({ title, value, icon: Icon, trend, color, href }: StatCardProps) {
  const colorStyles = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent-100 text-accent-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
  };

  const Card = (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{value}</p>
          {trend && (
            <p className="mt-1 flex items-center gap-1 text-xs text-success-600">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${colorStyles[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{Card}</Link>;
  }
  return Card;
}

export default function OperatorDashboardContent() {
  const [dashboard, setDashboard] = useState<OperatorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingOffersCount, setPendingOffersCount] = useState(0);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOperatorDashboard();
      // Normalize snake_case API response to camelCase
      const normalized = normalizeDashboard(data as unknown as Record<string, unknown>);
      setDashboard(normalized);
    } catch (err: unknown) {
      // Handle "Operator profile not found" - show empty dashboard instead of error
      if (isNotFoundError(err)) {
        // New operator with no profile yet - show empty dashboard
        setDashboard({
          profile: {
            id: '',
            userId: '',
            companyName: 'New Operator',
            registrationNumber: '',
            vatNumber: null,
            approvalStatus: OperatorApprovalStatus.PENDING,
            reputationScore: 0,
            totalJobs: 0,
            completedJobs: 0,
            bankAccountName: null,
            bankAccountNumber: null,
            bankSortCode: null,
            operatingLicenseNumber: null,
            councilRegistration: null,
            businessAddress: null,
            businessPostcode: null,
            emergencyContactName: null,
            emergencyContactPhone: null,
            fleetSize: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            vehicles: [],
            documents: [],
            serviceAreas: [],
          },
          availableJobs: 0,
          activeBids: 0,
          wonJobs: 0,
          completedJobs: 0,
          totalEarnings: 0,
          pendingPayouts: 0,
        });
      } else {
        const errorMessage = getContextualErrorMessage(err, 'fetch');
        setError(errorMessage);
        console.error('Error fetching operator dashboard:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingOffers = async () => {
    try {
      const offers = await operatorApi.getJobOffers();
      setPendingOffersCount(offers.length);
    } catch {
      // Silently fail - not critical for dashboard
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchPendingOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Dashboard</h2>
          <p className="mt-1 text-neutral-600">{error || 'Something went wrong'}</p>
        </div>
        <Button onClick={fetchDashboard} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const { profile, stats } = dashboard as any;
  const approvalStatus = profile?.approvalStatus || stats?.approvalStatus || 'PENDING';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome back, {profile?.companyName || 'Operator'}
          </h1>
          <p className="mt-1 text-neutral-600">
            Here&apos;s an overview of your operator activity
          </p>
        </div>
        <StatusBadge
          variant={
            approvalStatus === 'APPROVED'
              ? 'success'
              : approvalStatus === 'PENDING'
                ? 'warning'
                : 'error'
          }
        >
          {approvalStatus}
        </StatusBadge>
      </div>

      {/* Pending Approval Notice */}
      {approvalStatus === 'PENDING' && (
        <div className="rounded-xl border border-warning-200 bg-warning-50 p-4">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 flex-shrink-0 text-warning-600" />
            <div>
              <h3 className="font-semibold text-warning-800">Account Pending Approval</h3>
              <p className="mt-1 text-sm text-warning-700">
                Your operator account is under review. Once approved, you&apos;ll be able to view
                and bid on available jobs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pending Job Offers Alert */}
      {pendingOffersCount > 0 && (
        <Link
          href="/operator/job-offers"
          className="block rounded-xl border-2 border-accent-300 bg-accent-50 p-4 transition-all hover:border-accent-400 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Timer className="h-6 w-6 text-accent-600" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                  {pendingOffersCount}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-accent-800">
                  {pendingOffersCount} Job Offer{pendingOffersCount !== 1 ? 's' : ''} Awaiting Response
                </h3>
                <p className="text-sm text-accent-600">
                  Action required! Accept or decline before the deadline expires.
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-accent-500" />
          </div>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Available Jobs"
          value={stats?.availableJobs || dashboard.availableJobs || 0}
          icon={Briefcase}
          color="primary"
          href="/operator/jobs"
        />
        <StatCard
          title="Active Bids"
          value={stats?.totalBids || dashboard.activeBids || 0}
          icon={Gavel}
          color="accent"
          href="/operator/bids"
        />
        <StatCard
          title="Jobs Won"
          value={stats?.wonBids || dashboard.wonJobs || 0}
          icon={CheckCircle}
          color="success"
          href="/operator/assigned"
        />
        <StatCard
          title="Reputation"
          value={`${Number(stats?.reputationScore || profile?.reputationScore || 0).toFixed(1)}/5.0`}
          icon={Star}
          color="warning"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* View Available Jobs */}
        <Link
          href="/operator/jobs"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-primary-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary-100 p-3">
              <Briefcase className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">View Available Jobs</h3>
              <p className="text-sm text-neutral-500">Browse and bid on new jobs</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Track My Bids */}
        <Link
          href="/operator/bids"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-accent-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-accent-100 p-3">
              <Gavel className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Track My Bids</h3>
              <p className="text-sm text-neutral-500">Monitor your submitted bids</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* View Earnings */}
        <Link
          href="/operator/earnings"
          className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-success-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-success-100 p-3">
              <Wallet className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">View Earnings</h3>
              <p className="text-sm text-neutral-500">Track your income and payouts</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Performance Summary */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-neutral-900">Performance Summary</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-neutral-50 p-4 text-center">
            <p className="text-3xl font-bold text-neutral-900">
              {stats?.completedJobs || profile?.completedJobs || dashboard.completedJobs || 0}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Completed Jobs</p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4 text-center">
            <p className="text-3xl font-bold text-neutral-900">
              {stats?.totalJobs || profile?.totalJobs || 0}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Total Jobs</p>
          </div>
          <div className="rounded-lg bg-neutral-50 p-4 text-center">
            <p className="text-3xl font-bold text-success-600">
              £{dashboard.totalEarnings?.toFixed(2) || '0.00'}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Total Earnings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

