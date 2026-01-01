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
  booking: { icon: Calendar, color: 'bg-info-100 text-info-600' },
  operator: { icon: Users, color: 'bg-secondary-100 text-secondary-600' },
  job: { icon: Briefcase, color: 'bg-warning-100 text-warning-600' },
  payment: { icon: DollarSign, color: 'bg-success-100 text-success-600' },
};

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-neutral-200', className)}>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
        <p className="text-neutral-500 text-center py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-neutral-200', className)}>
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;
          
          return (
            <div key={activity.id} className="flex gap-3">
              <div className={cn('p-2 rounded-lg flex-shrink-0', config.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 truncate">{activity.title}</p>
                <p className="text-sm text-neutral-600 truncate">{activity.description}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {formatDistanceToNow(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

