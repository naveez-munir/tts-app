'use client';

/**
 * FAQ Section Component
 * Displays frequently asked questions with expandable accordion
 * Follows WCAG 2.1 accessibility guidelines
 */

import { useState, useId } from 'react';
import { getIcon } from '@/lib/utils/Icons';
import type { FAQ } from '@/types/landing.types';

interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: FAQ[];
}

interface FAQItemProps {
  faq: FAQ;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  baseId: string;
}

function FAQItem({ faq, index, isOpen, onToggle, baseId }: FAQItemProps) {
  const questionId = `${baseId}-question-${index}`;
  const answerId = `${baseId}-answer-${index}`;

  return (
    <div
      className={`overflow-hidden rounded-2xl backdrop-blur-sm ring-1 transition-all duration-300 ${
        isOpen
          ? 'bg-white/15 ring-accent-400/50 shadow-lg shadow-accent-500/10'
          : 'bg-white/10 ring-white/20 hover:bg-white/[0.12]'
      }`}
    >
      {/* Question Button */}
      <button
        id={questionId}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 sm:p-6"
      >
        <span className="text-base font-semibold text-white sm:text-lg">{faq.question}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen
              ? 'bg-accent-500 text-white rotate-180'
              : 'bg-white/10 text-white/80'
          }`}
          aria-hidden="true"
        >
          <span className="h-4 w-4">{getIcon('chevron-down')}</span>
        </span>
      </button>

      {/* Answer Panel */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={questionId}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="border-t border-white/10 pt-4">
              <p className="text-justify text-sm leading-relaxed text-primary-100 sm:text-base">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default
  const baseId = useId();

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-primary-100 sm:text-xl">{subtitle}</p>
        </div>

        <div className="mt-12 space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              baseId={baseId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

