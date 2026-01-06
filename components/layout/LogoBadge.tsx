import { cn } from '@/lib/utils';

interface LogoBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LogoBadge({ size = 'md', className }: LogoBadgeProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12 md:h-14 md:w-14',
    lg: 'h-16 w-16',
  };

  const svgSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10 md:h-11 md:w-11',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 shadow-lg ring-2 ring-white/20',
        sizeClasses[size],
        className
      )}
    >
      <svg viewBox="0 0 48 48" className={svgSizeClasses[size]} fill="none">
        {/* Outer ring decoration */}
        <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="1" opacity="0.2" />
        <circle cx="24" cy="24" r="19" stroke="white" strokeWidth="0.5" opacity="0.1" />

        {/* Luxury Car - Centered */}
        <g transform="translate(8, 18)">
          {/* Body - Sleek executive */}
          <path
            d="M0 8C0 6 1.5 4 4 4H28C30.5 4 32 6 32 8V12C32 14 30 16 28 16H4C2 16 0 14 0 12V8Z"
            fill="white"
          />
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
        <text
          x="24"
          y="42"
          textAnchor="middle"
          fill="white"
          fontSize="5"
          fontWeight="bold"
          opacity="0.4"
          letterSpacing="1"
        >
          TTS
        </text>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
    </div>
  );
}

