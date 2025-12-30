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
        'bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-neutral-200',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-600 truncate">{title}</p>
          <p className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">
            {value}
          </p>
          
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-success-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-error-600" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-neutral-500">vs last month</span>
            </div>
          )}
          
          {description && (
            <p className="mt-2 text-sm text-neutral-500">{description}</p>
          )}
        </div>
        
        <div className="ml-4 p-3 bg-primary-100 rounded-lg flex-shrink-0">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </div>
  );
}

