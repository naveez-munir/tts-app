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
 * - Content-driven height with generous padding
 * - No fixed viewport height - content determines section size
 * - Users can see there's more content below the fold
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900">
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
      <div className="container relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8 lg:pt-28 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <HeroContent />

          {/* Right Content - Quick Quote Form (visible on all screens) */}
          <div className="relative">
            <QuickQuoteForm />
          </div>
        </div>
      </div>

    </section>
  );
}
