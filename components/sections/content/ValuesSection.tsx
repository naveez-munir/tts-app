import { FeatureGrid } from './FeatureGrid';
import type { Feature } from '@/types/landing.types';

/**
 * Values Section Component
 * Displays company values in a grid layout
 */

interface ValuesSectionProps {
  title: string;
  subtitle: string;
  values: readonly Feature[] | Feature[];
  columns?: 2 | 3 | 4 | 6;
  variant?: 'card' | 'minimal';
  iconColor?: 'primary' | 'accent';
  backgroundColor?: 'white' | 'neutral';
}

export function ValuesSection({
  title,
  subtitle,
  values,
  columns = 4,
  variant = 'card',
  iconColor = 'primary',
  backgroundColor = 'neutral',
}: ValuesSectionProps) {
  const bgClass = backgroundColor === 'white' ? 'bg-white' : 'bg-neutral-50';

  return (
    <section className={`${bgClass} py-16 sm:py-20 lg:py-24`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
            {subtitle}
          </p>
        </div>
        <div className="mt-12">
          <FeatureGrid features={values} columns={columns} variant={variant} iconColor={iconColor} />
        </div>
      </div>
    </section>
  );
}

