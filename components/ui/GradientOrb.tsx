import { cn } from '@/lib/utils';

interface GradientOrbProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'accent' | 'primary' | 'secondary';
  animated?: boolean;
  animationDuration?: string;
  animationDelay?: string;
}

/**
 * Reusable decorative gradient orb component
 * Used for background visual effects across the application
 */
export function GradientOrb({
  position = 'top-right',
  size = 'md',
  color = 'accent',
  animated = false,
  animationDuration = '4s',
  animationDelay = '0s',
}: GradientOrbProps) {
  const positions = {
    'top-right': '-right-8 -top-8',
    'top-left': '-left-8 -top-8',
    'bottom-right': '-right-8 -bottom-8',
    'bottom-left': '-left-8 -bottom-8',
    center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  const sizes = {
    sm: 'h-24 w-24',
    md: 'h-32 w-32',
    lg: 'h-40 w-40',
    xl: 'h-[600px] w-[600px]',
  };

  const colors = {
    accent: 'bg-accent-400/20',
    primary: 'bg-primary-500/20',
    secondary: 'bg-secondary-400/30',
  };

  return (
    <div
      className={cn(
        'absolute rounded-full blur-3xl',
        positions[position],
        sizes[size],
        colors[color],
        animated && 'animate-pulse'
      )}
      style={
        animated
          ? { animationDuration, animationDelay }
          : undefined
      }
    />
  );
}

