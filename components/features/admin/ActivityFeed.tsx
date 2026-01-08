'use client';

import { Calendar, Users, Briefcase, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from '@/lib/utils/date';

type ActivityType = 'booking' | 'operator' | 'job' | 'payment';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

const activityConfig: Record<ActivityType, { icon: typeof Calendar; color: string }> = {
  booking: { icon: Calendar, color: 'bg-info-50 text-info-600' },
  operator: { icon: Users, color: 'bg-secondary-50 text-secondary-600' },
  job: { icon: Briefcase, color: 'bg-warning-50 text-warning-600' },
  payment: { icon: DollarSign, color: 'bg-success-50 text-success-600' },
};

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className={cn('bg-white rounded-xl p-4 shadow-sm border border-neutral-200', className)}>
        <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">Recent Activity</h2>
        <p className="text-neutral-500 text-center text-sm py-6">No recent activity</p>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl p-4 shadow-sm border border-neutral-200', className)}>
      <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-3">Recent Activity</h2>

      <div className="space-y-3">
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div key={activity.id} className="flex gap-2.5">
              <div className={cn('p-1.5 rounded-md flex-shrink-0', config.color)}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{activity.title}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="truncate">{activity.description}</span>
                  <span>•</span>
                  <span className="flex-shrink-0">{formatDistanceToNow(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

