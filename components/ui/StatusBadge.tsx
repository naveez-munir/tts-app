import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
  info: 'bg-info-100 text-info-700',
  pending: 'bg-warning-100 text-warning-700',
  approved: 'bg-success-100 text-success-700',
  rejected: 'bg-error-100 text-error-700',
  suspended: 'bg-neutral-200 text-neutral-600',
};

export function StatusBadge({
  variant = 'default',
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Helper function to get badge variant from status string
export function getStatusVariant(status: string): BadgeVariant {
  const statusMap: Record<string, BadgeVariant> = {
    // Operator statuses
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended',
    ACTIVE: 'success',
    
    // Booking statuses
    PENDING_PAYMENT: 'warning',
    PAID: 'success',
    ASSIGNED: 'info',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    CANCELLED: 'error',
    REFUNDED: 'warning',
    
    // Job statuses
    OPEN: 'info',
    OPEN_FOR_BIDDING: 'info',
    BIDDING_CLOSED: 'warning',
    NO_BIDS: 'error',
    NO_BIDS_RECEIVED: 'error',

    // Bid statuses
    WON: 'success',
    LOST: 'error',
  };

  return statusMap[status] || 'default';
}

