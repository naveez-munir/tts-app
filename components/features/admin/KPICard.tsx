import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className,
}: KPICardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-4 shadow-sm border border-neutral-200',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide truncate">{title}</p>
          <p className="mt-1 text-xl sm:text-2xl font-bold text-neutral-900">
            {value}
          </p>

          {trend && (
            <div className="mt-1.5 flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-success-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-error-600" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-neutral-400">vs last month</span>
            </div>
          )}

          {description && (
            <p className="mt-1.5 text-xs text-neutral-500">{description}</p>
          )}
        </div>

        <div className="p-2.5 bg-primary-50 rounded-lg flex-shrink-0">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
      </div>
    </div>
  );
}

