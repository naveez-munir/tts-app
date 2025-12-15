import { DarkFeatureCard } from '@/components/ui/Cards';
import type { Feature } from '@/types/landing.types';

interface WhyChooseUsSectionProps {
  features: readonly Feature[] | Feature[];
}

/**
 * Why Choose Us Section Component
 * Displays key benefits and features using DarkFeatureCard
 */
export function WhyChooseUsSection({ features }: WhyChooseUsSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 py-16 sm:py-20 lg:py-24">
      {/* Animated gradient orbs */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary-400/30 blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Why Choose TransferHub?
          </h2>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">
            The smart way to book airport transfers across the UK
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {features.map((feature, index) => (
            <DarkFeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

