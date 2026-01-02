import Link from 'next/link';
import { CTA_STATS } from '@/lib/data/landing.data';
import { getIcon } from '@/lib/utils/Icons';
import { StatCard } from '@/components/ui/Cards';

/**
 * CTA Section Component
 * Overlapping Sections Design - White section with dark floating card
 * Creates visual continuity between testimonials and footer
 */
export function CTASection() {
  return (
    <section className="relative bg-white pb-32 pt-16 sm:pb-40 sm:pt-20 lg:pb-48 lg:pt-24">
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Floating CTA Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 p-8 shadow-2xl sm:p-12 lg:p-16">
          {/* Animated gradient orbs */}
          <div
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary-400/30 blur-3xl"
            aria-hidden="true"
          />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          </div>

          <div className="relative">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Side - Content */}
              <div className="flex flex-col justify-center">
                {/* Badge */}
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-500 px-4 py-2 shadow-lg">
                  <span className="h-5 w-5 text-white">{getIcon('star-filled')}</span>
                  <span className="text-sm font-bold text-white">4.8/5 Rating</span>
                </div>

                <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  Ready to Book?
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-white/90 sm:text-xl">
                  Get instant quotes, competitive prices, and professional service. Your journey
                  starts here.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/quote#quote-form"
                    className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:bg-accent-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-primary-700"
                  >
                    Get Instant Quote
                    <span className="h-5 w-5 transition-transform group-hover:translate-x-1">
                      {getIcon('arrow-right')}
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Right Side - Stats Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {CTA_STATS.map((stat, index) => (
                  <StatCard key={index} stat={stat} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

