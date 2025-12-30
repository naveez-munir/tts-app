'use client';

import Link from 'next/link';
import { AlertTriangle, Users, CreditCard, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertItem {
  id: string;
  type: 'escalated' | 'pending' | 'payment';
  title: string;
  count: number;
  href: string;
}

interface AlertsSectionProps {
  escalatedJobs: number;
  pendingOperators: number;
  failedPayments: number;
  className?: string;
}

export function AlertsSection({
  escalatedJobs,
  pendingOperators,
  failedPayments,
  className,
}: AlertsSectionProps) {
  const alerts: AlertItem[] = [
    {
      id: 'escalated',
      type: 'escalated',
      title: 'Escalated Jobs (No Bids)',
      count: escalatedJobs,
      href: '/admin/jobs?status=escalated',
    },
    {
      id: 'pending',
      type: 'pending',
      title: 'Operators Pending Approval',
      count: pendingOperators,
      href: '/admin/operators?status=PENDING',
    },
    {
      id: 'payment',
      type: 'payment',
      title: 'Failed Payments',
      count: failedPayments,
      href: '/admin/bookings?status=FAILED',
    },
  ];

  const activeAlerts = alerts.filter((alert) => alert.count > 0);

  if (activeAlerts.length === 0) {
    return (
      <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-neutral-200', className)}>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Alerts</h2>
        <div className="flex items-center gap-3 p-4 bg-success-50 rounded-lg">
          <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
            <span className="text-success-600">✓</span>
          </div>
          <p className="text-success-700 font-medium">No alerts - everything is running smoothly!</p>
        </div>
      </div>
    );
  }

  const getAlertStyle = (type: AlertItem['type']) => {
    switch (type) {
      case 'escalated':
        return { bg: 'bg-error-50', icon: AlertTriangle, iconColor: 'text-error-600' };
      case 'pending':
        return { bg: 'bg-warning-50', icon: Users, iconColor: 'text-warning-600' };
      case 'payment':
        return { bg: 'bg-error-50', icon: CreditCard, iconColor: 'text-error-600' };
    }
  };

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-neutral-200', className)}>
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">
        Alerts <span className="text-error-600">({activeAlerts.length})</span>
      </h2>
      
      <div className="space-y-3">
        {activeAlerts.map((alert) => {
          const style = getAlertStyle(alert.type);
          const Icon = style.icon;
          
          return (
            <Link
              key={alert.id}
              href={alert.href}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg transition-colors hover:opacity-80',
                style.bg
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-5 h-5', style.iconColor)} />
                <div>
                  <p className="font-medium text-neutral-900">{alert.title}</p>
                  <p className="text-sm text-neutral-600">{alert.count} requiring attention</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

