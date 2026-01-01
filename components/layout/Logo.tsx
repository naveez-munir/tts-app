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
      {/* Circular Badge */}
      <div
        className={cn(
          'relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 shadow-lg ring-2 ring-white/20 transition-all group-hover:shadow-xl group-hover:ring-white/40 md:h-14 md:w-14',
          scrolled ? 'shadow-primary-600/30' : 'shadow-primary-600/20'
        )}
      >
        <svg viewBox="0 0 48 48" className="h-10 w-10 md:h-11 md:w-11" fill="none">
          {/* Outer ring decoration */}
          <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="1" opacity="0.2" />
          <circle cx="24" cy="24" r="19" stroke="white" strokeWidth="0.5" opacity="0.1" />

          {/* Luxury Car - Centered */}
          <g transform="translate(8, 18)">
            {/* Body - Sleek executive */}
            <path d="M0 8C0 6 1.5 4 4 4H28C30.5 4 32 6 32 8V12C32 14 30 16 28 16H4C2 16 0 14 0 12V8Z" fill="white" />
            {/* Roof - Low profile */}
            <path d="M6 4L9 -2H23L26 4H6Z" fill="white" />
            {/* Windows - Coral accent */}
            <path d="M8 3L10 -1H15V3H8Z" fill="#E11D48" opacity="0.5" />
            <path d="M16 3V-1H22L24 3H16Z" fill="#E11D48" opacity="0.5" />
            {/* Wheels */}
            <circle cx="8" cy="16" r="3" fill="#1E293B" />
            <circle cx="8" cy="16" r="1.8" fill="#94A3B8" />
            <circle cx="24" cy="16" r="3" fill="#1E293B" />
            <circle cx="24" cy="16" r="1.8" fill="#94A3B8" />
            {/* Accent details - Teal line */}
            <line x1="0" y1="10" x2="32" y2="10" stroke="#0D9488" strokeWidth="1" opacity="0.6" />
          </g>

          {/* TTS Text at bottom */}
          <text x="24" y="42" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" opacity="0.4" letterSpacing="1">TTS</text>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      {/* Text - Stacked with Poppins font */}
      <div className="flex flex-col items-start">
        <span
          className={cn(
            'font-[family-name:var(--font-poppins)] text-xl font-black tracking-tight leading-none transition-colors md:text-2xl',
            scrolled ? 'text-neutral-900' : 'text-white'
          )}
        >
          TTS
        </span>
        <span
          className={cn(
            'font-[family-name:var(--font-poppins)] text-[10px] font-semibold leading-tight transition-colors md:text-xs',
            scrolled ? 'text-neutral-600' : 'text-neutral-200'
          )}
        >
          Total Travel Solution Group
        </span>
        <span
          className={cn(
            'font-[family-name:var(--font-poppins)] mt-0.5 text-[9px] font-bold uppercase tracking-wider leading-none transition-colors md:text-[10px]',
            scrolled ? 'text-accent-600' : 'text-accent-400'
          )}
        >
          Airport Transfers
        </span>
      </div>
    </Link>
  );
}

