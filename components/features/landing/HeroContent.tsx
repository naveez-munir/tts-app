'use client';

import { TrustIndicators } from './TrustIndicators';

/**
 * Hero Content Component
 *
 * Left side content: badge, heading, subheading, trust indicators
 *
 * Responsive design:
 * - Mobile: Centered, compact spacing
 * - Tablet: Centered, medium spacing
 * - Desktop: Left-aligned, full spacing
 *
 * Note: Primary CTA removed as QuickQuoteForm is now visible on all screens
 * Secondary "Learn More" kept as subtle scroll prompt
 */
export function HeroContent() {
  const handleScrollToHowItWorks = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <div className="space-y-5 text-center sm:space-y-6 lg:space-y-8 lg:text-left">
      {/* Badge - Touch target compliant (min 44px height with padding) */}
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2.5 backdrop-blur-md ring-1 ring-white/20 sm:gap-2.5 sm:px-4">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
        </span>
        <span className="text-xs font-semibold text-white sm:text-sm">UK&apos;s Leading Transfer Platform</span>
      </div>

      {/* Main Heading - Unified block for visual grouping */}
      <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="block text-white">Airport Transfers</span>
        <span className="block bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-transparent">
          Made Simple
        </span>
      </h1>

      {/* Subheading - Constrained line length for readability */}
      <p className="mx-auto max-w-md text-sm leading-relaxed text-primary-100 sm:max-w-lg sm:text-base lg:mx-0 lg:max-w-xl lg:text-lg">
        Book reliable airport transfers across the UK.{' '}
        <span className="font-semibold text-white">Best prices guaranteed</span>, professional service, hassle-free booking.
      </p>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Secondary CTA - Subtle scroll prompt (hidden on mobile as form is visible) */}
      <div className="hidden pt-2 sm:block lg:pt-4">
        <button
          onClick={handleScrollToHowItWorks}
          className="group inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:text-base"
        >
          <span>See how it works</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

