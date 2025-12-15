import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuoteFormSection } from '@/components/features/quote/QuoteFormSection';
import { QuoteTrustIndicators } from '@/components/features/quote/QuoteTrustIndicators';
import { WhyChooseUsSection } from '@/components/features/quote/WhyChooseUsSection';
import { QUOTE_PAGE_DATA } from '@/lib/data/quote.data';
import { getIcon } from '@/lib/utils/Icons';

/**
 * Quote Page Content Component
 * Main content for the get quote page
 */
export function QuotePageContent() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 py-16 sm:py-20 lg:py-24">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>

          {/* Gradient Orbs */}
          <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 animate-pulse rounded-full bg-gradient-to-br from-accent-400/30 to-primary-500/20 blur-3xl" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/2 -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-tr from-secondary-400/30 to-primary-500/20 blur-3xl" style={{ animationDuration: '4s', animationDelay: '2s' }} />

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md ring-1 ring-white/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
                </span>
                <span className="text-sm font-semibold text-white">{QUOTE_PAGE_DATA.hero.badge}</span>
              </div>

              {/* Title */}
              <h1 className="mt-8 text-4xl font-black text-white sm:text-5xl lg:text-6xl">
                {QUOTE_PAGE_DATA.hero.title}
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100 sm:text-xl">
                {QUOTE_PAGE_DATA.hero.subtitle}
              </p>

              {/* Trust Indicators */}
              <div className="mt-12">
                <QuoteTrustIndicators indicators={QUOTE_PAGE_DATA.trustIndicators} />
              </div>
            </div>
          </div>
        </section>

        {/* Quote Form Section */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <QuoteFormSection />
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <WhyChooseUsSection features={QUOTE_PAGE_DATA.whyChooseUs} />

        {/* CTA Section */}
        <section className="bg-white py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
                Need Help?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 sm:text-xl">
                Our customer support team is available 24/7 to assist you with your booking
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="tel:+441234567890"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-accent-500/30 active:scale-95 sm:text-lg"
                >
                  <span className="h-5 w-5 transition-transform group-hover:scale-110">
                    {getIcon('phone')}
                  </span>
                  Call Us Now
                </a>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-xl border-2 border-neutral-300 bg-white px-8 py-4 text-base font-bold text-neutral-700 transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-50 active:scale-95 sm:text-lg"
                >
                  <span className="h-5 w-5 transition-transform group-hover:scale-110">
                    {getIcon('mail')}
                  </span>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

