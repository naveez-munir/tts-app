import { TESTIMONIALS } from '@/lib/data/testimonials';
import { SECTION_HEADERS } from '@/lib/data/landing.data';
import { TestimonialCard } from '@/components/ui/Cards';

export function TestimonialsSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
            {SECTION_HEADERS.testimonials.title}
          </h2>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
            {SECTION_HEADERS.testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

