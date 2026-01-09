import { HOW_IT_WORKS_STEPS } from '@/lib/data/steps';
import { SECTION_HEADERS } from '@/lib/data/landing.data';
import { StepCard } from '@/components/ui/Cards';

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 py-16 sm:py-20 lg:py-24"
    >
      {/* Decorative gradient orbs */}
      <div
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary-400/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {SECTION_HEADERS.howItWorks.title}
          </h2>
          <p className="mt-3 text-base text-white/90 sm:mt-4 sm:text-lg">
            {SECTION_HEADERS.howItWorks.subtitle}
          </p>
        </header>

        {/* Steps Grid - Equal height cards with connecting lines on desktop */}
        <div className="mt-10 grid gap-6 overflow-visible sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <StepCard
              key={index}
              step={step}
              isLast={index === HOW_IT_WORKS_STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

