/**
 * Requirements Section - Operator Page
 * Displays requirements to join the operator network
 * Fully responsive: mobile-first design
 */

import { getIcon } from '@/lib/utils/Icons';
import type { RequirementCategory } from '@/types/landing.types';

interface RequirementsSectionProps {
  title: string;
  subtitle: string;
  items: RequirementCategory[];
}

export function RequirementsSection({ title, subtitle, items }: RequirementsSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary-900 sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">{subtitle}</p>
        </div>

        {/* Requirements Grid */}
        <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-3 lg:gap-10">
          {items.map((category, index) => (
            <div key={index} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              {/* Category Title */}
              <h3 className="mb-6 text-xl font-semibold text-primary-900 sm:text-2xl">{category.category}</h3>

              {/* Requirements List */}
              <ul className="space-y-4">
                {category.requirements.map((requirement, reqIndex) => (
                  <li key={reqIndex} className="flex items-start gap-3">
                    <span className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-600 sm:h-6 sm:w-6">
                      {getIcon('check-circle')}
                    </span>
                    <span className="text-base leading-relaxed text-neutral-700 sm:text-lg">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-10 text-center sm:mt-12">
          <p className="text-base text-neutral-600 sm:text-lg">
            Don&apos;t meet all requirements yet?{' '}
            <a
              href="/contact"
              className="font-semibold text-secondary-600 underline decoration-secondary-300 decoration-2 underline-offset-4 transition-colors hover:text-secondary-700 hover:decoration-secondary-400"
            >
              Contact us
            </a>{' '}
            and we&apos;ll help you get started.
          </p>
        </div>
      </div>
    </section>
  );
}

