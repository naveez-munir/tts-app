import Link from 'next/link';
import { TrustIndicators } from './TrustIndicators';

/**
 * Hero Content Component
 * Left side content: badge, heading, subheading, trust indicators, and CTAs
 */
export function HeroContent() {
  return (
    <div className="space-y-8 text-center lg:text-left">
      {/* Badge */}
      <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md ring-1 ring-white/20">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
        </span>
        <span className="text-sm font-semibold text-white">UK's Leading Transfer Platform</span>
      </div>

      {/* Main Heading */}
      <h1 className="space-y-3">
        <span className="block text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
          Airport Transfers
        </span>
        <span className="block bg-gradient-to-r from-accent-300 via-accent-400 to-accent-500 bg-clip-text text-4xl font-black leading-tight tracking-tight text-transparent sm:text-5xl lg:text-6xl xl:text-7xl">
          Made Simple
        </span>
      </h1>

      {/* Subheading */}
      <p className="mx-auto max-w-2xl text-base leading-relaxed text-primary-100 sm:text-lg lg:mx-0 lg:text-xl">
        Book reliable airport transfers across the UK. <span className="font-bold text-white">Best prices guaranteed</span>, professional service, hassle-free booking.
      </p>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* CTA Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
        <Link
          href="/quote#quote-form"
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-accent-500/30 active:scale-95 sm:text-lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Get Instant Quote
            <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </Link>

        <Link
          href="#how-it-works"
          className="group rounded-xl border-2 border-white/30 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/10 active:scale-95 sm:text-lg"
        >
          <span className="flex items-center justify-center gap-2">
            Learn More
            <svg className="h-5 w-5 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}

