/**
 * Operator Testimonials Section
 * Displays testimonials from existing operators
 * Fully responsive: mobile-first design
 */

import Image from 'next/image';
import { getIcon } from '@/lib/utils/Icons';
import type { OperatorTestimonial } from '@/types/landing.types';

interface OperatorTestimonialsProps {
  testimonials: OperatorTestimonial[];
}

export function OperatorTestimonials({ testimonials }: OperatorTestimonialsProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
            What Our Operators Say
          </h2>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
            Join hundreds of satisfied operators growing their business with TransferHub
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative flex flex-col overflow-hidden rounded-lg bg-neutral-50 p-6 shadow-sm transition-all hover:shadow-lg sm:p-8"
            >
              {/* Quote Icon */}
              <div className="absolute right-4 top-4 h-16 w-16 opacity-10 text-primary-600">
                {getIcon('quote-mark')}
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="h-5 w-5 text-accent-500">
                    {getIcon('star-filled')}
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="relative mt-4 flex-grow text-justify text-sm leading-relaxed text-neutral-700 sm:text-base">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author Info - Always at bottom */}
              <div className="mt-6 flex items-center gap-4">
                {/* Avatar */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full shadow-md">
                  <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                </div>

                {/* Details */}
                <div>
                  <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                  <div className="text-sm text-neutral-600">{testimonial.role}</div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-colors group-hover:border-primary-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

