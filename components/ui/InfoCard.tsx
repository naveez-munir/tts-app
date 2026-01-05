import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InfoItem {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

interface InfoCardProps {
  title: string;
  icon?: LucideIcon;
  items: InfoItem[];
  className?: string;
  children?: React.ReactNode;
}

/**
 * InfoCard - Reusable card component for displaying key-value pairs
 * Follows 8px spacing system and consistent card patterns
 * Used for displaying grouped information in admin/operator dashboards
 */
export function InfoCard({
  title,
  icon: Icon,
  items,
  className,
  children,
}: InfoCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-6 shadow-sm border border-neutral-200',
        className
      )}
    >
      {/* Header */}
      <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-neutral-600" />}
        {title}
      </h2>

      {/* Info Items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-neutral-500 mb-1">{item.label}</p>
            <div className={cn('font-medium text-neutral-900', item.className)}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Optional children for custom content */}
      {children && <div className="mt-4 pt-4 border-t border-neutral-200">{children}</div>}
    </div>
  );
}

