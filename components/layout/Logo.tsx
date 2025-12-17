import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  scrolled?: boolean;
}

export function Logo({ scrolled = false }: LogoProps) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <div
        className={cn(
          'relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary-600 to-secondary-900 shadow-lg transition-all group-hover:shadow-xl md:h-12 md:w-12',
          scrolled ? 'shadow-primary-600/30' : 'shadow-primary-600/20'
        )}
      >
        <span className="text-base font-black text-white md:text-lg">TTS</span>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            'text-lg font-black leading-none transition-colors md:text-xl',
            scrolled ? 'text-neutral-900' : 'text-white'
          )}
        >
          Total Travel Solution
        </span>
        <span
          className={cn(
            'text-xs font-semibold leading-none transition-colors',
            scrolled ? 'text-primary-600' : 'text-accent-400'
          )}
        >
          Airport Transfers
        </span>
      </div>
    </Link>
  );
}

