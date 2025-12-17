import { cn } from '@/lib/utils';

interface CheckmarkListProps {
  items: readonly string[];
  iconColor?: string;
  textColor?: string;
  className?: string;
}

/**
 * Reusable checkmark list component
 * Displays a list of items with checkmark icons
 * Uses theme colors: accent-400 for icons by default
 */
export function CheckmarkList({
  items,
  iconColor = 'text-accent-400',
  textColor = 'text-white/90',
  className,
}: CheckmarkListProps) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <svg
            className={cn('mt-1 h-5 w-5 flex-shrink-0', iconColor)}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className={cn('text-sm sm:text-base', textColor)}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

