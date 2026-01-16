'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar, Users, Briefcase, PoundSterling, AlertCircle, RefreshCw } from 'lucide-react';
import { KPICard } from '@/components/features/admin/KPICard';
import { AlertsSection } from '@/components/features/admin/AlertsSection';
import { ActivityFeed } from '@/components/features/admin/ActivityFeed';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { getDashboard, DashboardStats } from '@/lib/api/admin.api';
import { formatCurrency } from '@/lib/utils/date';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDashboard();
      setStats(data);
    } catch (err: unknown) {
      console.error('Failed to fetch dashboard:', err);
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading) {
    return <LoadingOverlay message="Loading dashboard..." />;
  }

  if (!stats || error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Dashboard</h2>
          <p className="mt-1 text-neutral-600">{error || 'Failed to load dashboard data'}</p>
        </div>
        <Button onClick={fetchDashboard} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  // Transform recent activity from backend
  const activities = (stats.recentActivity ?? []).map((activity, index) => ({
    id: `activity-${index}`,
    type: activity.type === 'BOOKING' ? 'booking' as const : 'operator' as const,
    title: activity.description,
    description: activity.type,
    timestamp: activity.timestamp,
  }));

  // Extract alert counts from alerts array
  const alertCounts = {
    escalatedJobs: stats.alerts?.find(a => a.type === 'NO_BIDS') ? stats.kpis.jobsWithNoBids : 0,
    pendingOperators: stats.kpis.pendingOperatorApprovals,
    failedPayments: 0, // Not tracked in backend alerts currently
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-600">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          title="Total Bookings"
          value={stats.kpis.totalBookings}
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Active Operators"
          value={stats.kpis.activeOperators}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Pending Approvals"
          value={stats.kpis.pendingOperatorApprovals}
          icon={Briefcase}
          description="Operators awaiting review"
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(stats.kpis.totalRevenue)}
          icon={PoundSterling}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Alerts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <AlertsSection
          escalatedJobs={alertCounts.escalatedJobs}
          pendingOperators={alertCounts.pendingOperators}
          failedPayments={alertCounts.failedPayments}
        />
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}

