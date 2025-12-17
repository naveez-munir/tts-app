/**
 * FAQ Section Component
 * Displays frequently asked questions
 */

import type { FAQ } from '@/types/landing.types';

interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: FAQ[];
}

export function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 py-16 sm:py-20 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-primary-400/20 blur-3xl" />

      <div className="container relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-primary-100 sm:text-xl">
            {subtitle}
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-white/15 sm:p-8">
              <h3 className="text-xl font-semibold text-white">
                {faq.question}
              </h3>
              <p className="mt-3 text-justify text-base leading-relaxed text-primary-100">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

