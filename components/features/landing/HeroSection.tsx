import { HeroContent } from './HeroContent';
import { QuickQuoteForm } from './QuickQuoteForm';

/**
 * Hero Section Component
 *
 * Asymmetric split layout with integrated booking form
 * 60% content (left) + 40% quick quote form (right)
 */
export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 animate-pulse rounded-full bg-gradient-to-br from-accent-400/30 to-primary-500/20 blur-3xl" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/2 -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-tr from-secondary-400/30 to-primary-500/20 blur-3xl" style={{ animationDuration: '4s', animationDelay: '2s' }} />

      <div className="container relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 xl:gap-20">
          {/* Left Content - 60% */}
          <HeroContent />

          {/* Right Content - 40% Quick Quote Form */}
          <div className="relative hidden lg:block">
            <QuickQuoteForm />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="h-6 w-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
