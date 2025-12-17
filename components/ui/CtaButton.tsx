import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: 'arrow-right' | 'arrow-down' | 'none';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Reusable CTA (Call-to-Action) button component
 * Uses theme colors: accent-500, accent-600, primary-600, white
 */
export function CTAButton({
  href,
  children,
  variant = 'primary',
  icon = 'arrow-right',
  size = 'md',
  fullWidth = false,
  onClick,
  className,
}: CTAButtonProps) {
  const variants = {
    primary:
      'bg-accent-500 text-white shadow-lg shadow-accent-500/30 hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-600/40',
    secondary:
      'border-2 border-white/30 bg-white/5 text-white backdrop-blur-md ring-1 ring-white/10 hover:bg-white/10 hover:border-white/40',
    outline:
      'border-2 border-primary-600 bg-transparent text-primary-600 hover:bg-primary-600 hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const icons = {
    'arrow-right': (
      <svg
        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    ),
    'arrow-down': (
      <svg
        className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    ),
    none: null,
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 active:scale-95',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
      {icons[icon]}
    </Link>
  );
}

