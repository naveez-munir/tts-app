import type { SimpleStat } from '@/types/landing.types';

/**
 * Stats Grid Component
 * Reusable stats section for displaying key metrics
 */

interface StatsGridProps {
  stats: readonly SimpleStat[] | SimpleStat[];
  columns?: 2 | 3 | 4;
  variant?: 'light' | 'dark';
}

export function StatsGrid({ stats, columns = 4, variant = 'dark' }: StatsGridProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  const textColors = {
    light: {
      value: 'text-primary-600',
      label: 'text-neutral-600',
    },
    dark: {
      value: 'text-accent-400',
      label: 'text-white/80',
    },
  };

  return (
    <div className={`grid gap-8 ${gridCols[columns]}`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className={`text-4xl font-bold sm:text-5xl ${textColors[variant].value}`}>
            {stat.value}
          </div>
          <div className={`mt-2 text-base sm:text-lg ${textColors[variant].label}`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

