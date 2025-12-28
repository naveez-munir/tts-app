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
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getOperatorDashboard } from '@/lib/api';
import type { OperatorDashboard } from '@/lib/types';

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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getOperatorDashboard();
        setDashboard(data);
      } catch (err) {
        setError('Failed to load dashboard. Please try again.');
        console.error('Error fetching operator dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
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
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-600">{error || 'Something went wrong'}</p>
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

