/**
 * How It Works Section - Operator Page
 * Shows the 4-step process for operators to join and start earning
 * Fully responsive: mobile-first design
 */

import { StepCard } from '@/components/ui/Cards';
import type { Step } from '@/types/landing.types';

interface HowItWorksOperatorProps {
  title: string;
  subtitle: string;
  steps: Step[];
}

export function HowItWorksOperator({ title, subtitle, steps }: HowItWorksOperatorProps) {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 py-16 sm:py-20 lg:py-24">
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
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">{subtitle}</p>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} isLast={index === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

