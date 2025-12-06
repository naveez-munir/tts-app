import { cn } from '@/lib/utils';

interface IconContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gradient-accent' | 'gradient-primary' | 'gradient-secondary' | 'glass' | 'solid';
  shape?: 'circle' | 'rounded' | 'square';
  className?: string;
}

/**
 * Reusable icon container component
 * Provides consistent styling for icons across the application
 * Uses theme colors for all variants
 */
export function IconContainer({
  children,
  size = 'md',
  variant = 'glass',
  shape = 'circle',
  className,
}: IconContainerProps) {
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
  };

  const variants = {
    'gradient-accent': 'bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-lg shadow-accent-500/30',
    'gradient-primary': 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg',
    'gradient-secondary': 'bg-gradient-to-br from-secondary-400 to-secondary-600 text-white shadow-lg',
    glass: 'bg-white/20 backdrop-blur-sm text-white shadow-lg',
    solid: 'bg-primary-600 text-white shadow-lg',
  };

  const shapes = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-md',
  };

  return (
    <div
      className={cn(
        'flex flex-shrink-0 items-center justify-center transition-transform group-hover:scale-110',
        sizes[size],
        variants[variant],
        shapes[shape],
        className
      )}
    >
      {children}
    </div>
  );
}

