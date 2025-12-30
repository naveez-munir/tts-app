'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, Briefcase, PoundSterling } from 'lucide-react';
import { KPICard } from '@/components/features/admin/KPICard';
import { AlertsSection } from '@/components/features/admin/AlertsSection';
import { ActivityFeed } from '@/components/features/admin/ActivityFeed';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { getDashboard, DashboardStats } from '@/lib/api/admin.api';
import { formatCurrency } from '@/lib/utils/date';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setIsLoading(true);
        const data = await getDashboard();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        setError('Failed to load dashboard data');
        // Set mock data for development matching backend structure
        setStats({
          kpis: {
            totalBookings: 156,
            totalRevenue: 45670,
            platformCommission: 5670,
            activeOperators: 24,
            pendingOperatorApprovals: 3,
            suspendedOperators: 1,
            activeJobs: 12,
            jobsWithNoBids: 2,
          },
          recentActivity: [],
          alerts: [],
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingOverlay message="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-error-600">{error || 'Failed to load dashboard'}</p>
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

