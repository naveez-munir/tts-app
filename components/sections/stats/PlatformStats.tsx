import { PLATFORM_STATS } from '@/lib/constants';

interface PlatformStatsProps {
  variant?: 'light' | 'dark';
}

/**
 * Platform Stats Component
 * Displays platform statistics (customers, operators, rating, support)
 * Reusable across sign-in, quote, and other pages
 */
export function PlatformStats({ variant = 'light' }: PlatformStatsProps) {
  const stats = [
    { value: PLATFORM_STATS.CUSTOMERS, label: 'Happy Customers' },
    { value: PLATFORM_STATS.OPERATORS, label: 'Verified Operators' },
    { value: PLATFORM_STATS.RATING, label: 'Customer Rating' },
    { value: '24/7', label: 'Support Available' },
  ];

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
    <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
      {stats.map((stat, index) => (
        <div key={index}>
          <div className={`text-3xl font-black ${textColors[variant].value}`}>
            {stat.value}
          </div>
          <div className={`mt-1 text-sm ${textColors[variant].label}`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

