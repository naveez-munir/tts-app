import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  background?: 'white' | 'neutral' | 'gradient';
  className?: string;
  containerClassName?: string;
}

/**
 * Reusable section wrapper component
 * Provides consistent spacing and container width
 * Uses theme colors for backgrounds
 */
export function Section({
  children,
  background = 'white',
  className,
  containerClassName,
}: SectionProps) {
  const backgrounds = {
    white: 'bg-white',
    neutral: 'bg-neutral-50',
    gradient: 'bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900',
  };

  return (
    <section className={cn(backgrounds[background], 'py-16 sm:py-20 lg:py-24', className)}>
      <div className={cn('container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', containerClassName)}>
        {children}
      </div>
    </section>
  );
}

