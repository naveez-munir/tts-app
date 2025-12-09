import { FEATURES } from '@/lib/data/features';
import { SECTION_HEADERS } from '@/lib/data/landing.data';
import { FeatureCard } from '@/components/ui/Cards';

export function FeaturesSection() {
  return (
    <section className="bg-neutral-50 py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
            {SECTION_HEADERS.features.title}
          </h2>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
            {SECTION_HEADERS.features.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

