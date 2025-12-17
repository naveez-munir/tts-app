import { FeatureCard } from '@/components/ui/Cards';
import type { Feature } from '@/types/landing.types';

/**
 * Feature Grid Component
 * Reusable grid for displaying features with icons
 * Uses FeatureCard component for consistent styling
 */

interface FeatureGridProps {
  features: readonly Feature[] | Feature[];
  columns?: 2 | 3 | 4 | 6;
  variant?: 'card' | 'minimal';
  iconColor?: 'primary' | 'accent';
}

const gridColsMap = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  6: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
};

export function FeatureGrid({
  features,
  columns = 3,
  variant = 'card',
  iconColor = 'accent',
}: FeatureGridProps) {
  const gapClass = variant === 'minimal' ? 'gap-6' : 'gap-8';

  return (
    <div className={`grid ${gapClass} ${gridColsMap[columns]}`}>
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} variant={variant} iconColor={iconColor} />
      ))}
    </div>
  );
}

