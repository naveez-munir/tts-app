import { cn } from '@/lib/utils';
import { GradientOrb } from './GradientOrb';

interface GradientCardProps {
  children: React.ReactNode;
  withOrb?: boolean;
  orbSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Reusable gradient card component with optional decorative orb
 * Uses theme colors: primary-600, primary-700, secondary-900, accent-400
 */
export function GradientCard({
  children,
  withOrb = true,
  orbSize = 'lg',
  className,
}: GradientCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 p-6 shadow-md transition-all hover:shadow-xl sm:p-8',
        className
      )}
    >
      {withOrb && <GradientOrb position="top-right" size={orbSize} color="accent" />}
      <div className="relative">{children}</div>
    </div>
  );
}

