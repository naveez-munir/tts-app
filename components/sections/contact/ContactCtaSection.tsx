import Link from 'next/link';
import { getIcon } from '@/lib/utils/Icons';

/**
 * Contact CTA Section
 * Call-to-action section at the bottom of contact page
 * Matches the visual style of other pages' CTA sections
 */

export function ContactCTASection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-600 via-secondary-700 to-primary-900 px-6 py-12 shadow-2xl sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>

          {/* Gradient Orbs */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-400/30 blur-3xl" />

          {/* Content */}
          <div className="relative mx-auto max-w-4xl text-center">
            {/* Title */}
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Ready to Book Your Transfer?
            </h2>

            {/* Subtitle */}
            <p className="mt-4 text-lg text-secondary-100 sm:mt-6 sm:text-xl lg:text-2xl">
              Get an instant quote and experience stress-free airport transfers
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:justify-center sm:gap-6">
              {/* Primary Button */}
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-accent-700 hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg"
              >
                Get Instant Quote
                <span className="h-5 w-5">{getIcon('arrow-right')}</span>
              </Link>

              {/* Secondary Button */}
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 sm:px-8 sm:py-4 sm:text-lg"
              >
                <span className="h-5 w-5">{getIcon('info')}</span>
                Learn More About Us
              </Link>
            </div>

            {/* Trust Indicator */}
            <p className="mt-8 text-sm text-secondary-200 sm:text-base">
              ✓ Instant quotes &nbsp;•&nbsp; ✓ Trusted operators &nbsp;•&nbsp; ✓ 24/7 support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

