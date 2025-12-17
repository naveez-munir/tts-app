/**
 * Benefits Section - Operator Page
 * Displays benefits of joining the operator network
 * Fully responsive: mobile-first design
 */

import { getIcon, type IconName } from '@/lib/utils/Icons';
import type { Feature } from '@/types/landing.types';

interface BenefitsSectionProps {
  title: string;
  subtitle: string;
  items: Feature[];
}

export function BenefitsSection({ title, subtitle, items }: BenefitsSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary-900 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
            {subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-12 grid gap-8 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {items.map((benefit, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-secondary-300 hover:shadow-lg sm:p-8"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 p-3 text-secondary-600 transition-colors duration-300 group-hover:bg-secondary-600 group-hover:text-white sm:h-14 sm:w-14">
                {getIcon(benefit.icon as IconName)}
              </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-semibold text-primary-900 sm:text-2xl">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-justify text-base leading-relaxed text-neutral-600 sm:text-lg">
                  {benefit.description}
                </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

