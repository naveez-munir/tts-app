import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  /**
   * Logo variant for different contexts:
   * - 'navbar': Compact size for header/navigation (default)
   * - 'footer': Larger size for footer branding
   */
  variant?: 'navbar' | 'footer';
  scrolled?: boolean;
}

export function Logo({ variant = 'navbar', scrolled = false }: LogoProps) {
  // Size configurations for different variants
  const sizeConfig = {
    navbar: {
      width: 220,
      height: 70,
      className: 'h-16 md:h-20',
    },
    footer: {
      width: 240,
      height: 100,
      className: 'h-20 md:h-24',
    },
  };

  const config = sizeConfig[variant];

  return (
    <Link
      href="/"
      className="inline-block transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <Image
        src="/logo.png"
        alt="Total Travel Solution Group"
        width={config.width}
        height={config.height}
        priority={variant === 'navbar'}
        className={cn(config.className, 'w-auto object-contain')}
      />
    </Link>
  );
}
