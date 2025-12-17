/**
 * Earnings Section - Operator Page
 * Displays earnings potential and payment highlights
 * Fully responsive: mobile-first design
 */

import { getIcon } from '@/lib/utils/Icons';

interface EarningsSectionProps {
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

export function EarningsSection({ title, subtitle, description, highlights }: EarningsSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 py-16 sm:py-20 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-secondary-400/20 blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left Column - Text Content */}
          <div>
            {/* Icon Badge */}
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-3 backdrop-blur-sm sm:h-16 sm:w-16">
              <span className="h-6 w-6 text-accent-300 sm:h-8 sm:w-8">{getIcon('trend-up')}</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h2>

            {/* Subtitle */}
            <p className="mt-4 text-lg text-primary-100 sm:text-xl">{subtitle}</p>

            {/* Description */}
            <p className="mt-6 text-justify text-base leading-relaxed text-primary-100 sm:text-lg">{description}</p>

            {/* CTA Button */}
            <div className="mt-8">
              <a
                href="/operators/register"
                className="inline-flex items-center justify-center rounded-lg bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-accent-700 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg"
              >
                Start Earning Today
              </a>
            </div>
          </div>

          {/* Right Column - Highlights */}
          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm sm:p-8 lg:p-10">
            <h3 className="mb-6 text-xl font-semibold text-white sm:text-2xl">Payment Highlights</h3>

            <ul className="space-y-4">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-300 sm:h-6 sm:w-6">
                    {getIcon('check-circle')}
                  </span>
                  <span className="text-base leading-relaxed text-primary-50 sm:text-lg">{highlight}</span>
                </li>
              ))}
            </ul>

            {/* Earnings Example Box */}
            <div className="mt-8 rounded-xl border border-white/20 bg-white/5 p-6">
              <p className="text-sm font-medium uppercase tracking-wide text-primary-200">Example Earnings</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white sm:text-5xl">£2,500</span>
                <span className="text-lg text-primary-200">- £5,000+</span>
              </div>
              <p className="mt-2 text-sm text-primary-200">Average monthly earnings for full-time operators</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

