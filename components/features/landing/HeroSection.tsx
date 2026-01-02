import { HeroContent } from './HeroContent';
import { QuickQuoteForm } from './QuickQuoteForm';

/**
 * Hero Section Component
 *
 * Responsive layout:
 * - Mobile/Tablet: Stacked layout (content + form)
 * - Desktop: Asymmetric split (60% content + 40% form)
 *
 * Height strategy:
 * - Uses min-h with viewport calculation accounting for header
 * - Ensures consistent visual experience across screen sizes
 */
export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Gradient Orbs - Reduced size on mobile for performance */}
      <div
        className="absolute right-0 top-0 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-accent-400/30 to-primary-500/20 blur-3xl sm:h-[400px] sm:w-[400px] lg:h-[600px] lg:w-[600px]"
        style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
      />
      <div
        className="absolute bottom-0 left-0 h-[300px] w-[300px] translate-y-1/2 -translate-x-1/2 rounded-full bg-gradient-to-tr from-secondary-400/30 to-primary-500/20 blur-3xl sm:h-[400px] sm:w-[400px] lg:h-[600px] lg:w-[600px]"
        style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '2s' }}
      />

      {/* Main Content Container */}
      <div className="container relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <HeroContent />

          {/* Right Content - Quick Quote Form (visible on all screens) */}
          <div className="relative">
            <QuickQuoteForm />
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile (conflicts with WhatsApp), shown on larger screens */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce sm:block lg:bottom-8">
        <span className="sr-only">Scroll down for more content</span>
        <svg
          className="h-5 w-5 text-white/40 lg:h-6 lg:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
