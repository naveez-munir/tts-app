import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  titleClassName?: string;
  subtitleClassName?: string;
}

/**
 * Reusable section header component
 * Provides consistent typography and spacing for section titles
 * Uses theme colors: neutral-900, neutral-600
 */
export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={alignments[align]}>
      <h2
        className={cn(
          'text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl',
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-lg text-neutral-600 sm:text-xl',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

