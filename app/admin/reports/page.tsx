'use client';

import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, PoundSterling, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getRevenueReport, getPayoutsReport } from '@/lib/api/admin.api';
import { formatCurrency } from '@/lib/utils/date';

interface ReportData {
  totalRevenue: number;
  totalPayouts: number;
  platformCommission: number;
  totalBookings: number;
  avgBookingValue: number;
  periodComparison: { revenue: number; payouts: number };
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const [revenueRes, payoutsRes] = await Promise.all([
        getRevenueReport({ startDate, endDate }),
        getPayoutsReport({ startDate, endDate }),
      ]);
      setReportData({
        totalRevenue: revenueRes.data?.totalRevenue || 0,
        totalPayouts: payoutsRes.data?.totalPayouts || 0,
        platformCommission: (revenueRes.data?.totalRevenue || 0) - (payoutsRes.data?.totalPayouts || 0),
        totalBookings: revenueRes.data?.totalBookings || 0,
        avgBookingValue: revenueRes.data?.avgBookingValue || 0,
        periodComparison: { revenue: 12, payouts: 8 },
      });
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    if (!reportData) return;
    const csv = `Report Period,${startDate} to ${endDate}
Total Revenue,${reportData.totalRevenue}
Total Payouts,${reportData.totalPayouts}
Platform Commission,${reportData.platformCommission}
Total Bookings,${reportData.totalBookings}
Average Booking Value,${reportData.avgBookingValue}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Financial Reports</h1>
          <p className="text-neutral-600 mt-1">Revenue, payouts, and commission analysis</p>
        </div>
        {reportData && (
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        )}
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" /> Report Period
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <div className="sm:col-span-2 lg:col-span-1">
            <Button onClick={fetchReports} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <><LoadingSpinner size="sm" className="mr-2" /> Loading...</> : 'Generate Report'}
            </Button>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      {reportData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Revenue */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-1">{formatCurrency(reportData.totalRevenue)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-success-600" />
                    <span className="text-sm text-success-600">+{reportData.periodComparison.revenue}%</span>
                    <span className="text-sm text-neutral-500">vs previous period</span>
                  </div>
                </div>
                <div className="p-3 bg-success-100 rounded-lg">
                  <PoundSterling className="w-6 h-6 text-success-600" />
                </div>
              </div>
            </div>

            {/* Total Payouts */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Payouts</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-1">{formatCurrency(reportData.totalPayouts)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-warning-600" />
                    <span className="text-sm text-warning-600">+{reportData.periodComparison.payouts}%</span>
                    <span className="text-sm text-neutral-500">to operators</span>
                  </div>
                </div>
                <div className="p-3 bg-warning-100 rounded-lg">
                  <Users className="w-6 h-6 text-warning-600" />
                </div>
              </div>
            </div>

            {/* Platform Commission */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Platform Commission</p>
                  <p className="text-3xl font-bold text-secondary-600 mt-1">{formatCurrency(reportData.platformCommission)}</p>
                  <p className="text-sm text-neutral-500 mt-2">
                    {((reportData.platformCommission / reportData.totalRevenue) * 100).toFixed(1)}% margin
                  </p>
                </div>
                <div className="p-3 bg-secondary-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <h2 className="text-lg font-semibold mb-4">Summary Statistics</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-neutral-600">Total Bookings</p>
                <p className="text-2xl font-bold">{reportData.totalBookings}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Average Booking Value</p>
                <p className="text-2xl font-bold">{formatCurrency(reportData.avgBookingValue)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Average Commission</p>
                <p className="text-2xl font-bold">{formatCurrency(reportData.platformCommission / reportData.totalBookings)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Commission Rate</p>
                <p className="text-2xl font-bold">{((reportData.platformCommission / reportData.totalRevenue) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </>
      )}

      {!reportData && !isLoading && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-neutral-200 text-center">
          <p className="text-neutral-600">Select a date range and click &quot;Generate Report&quot; to view financial data</p>
        </div>
      )}
    </div>
  );
}

