import { FEATURES } from '@/lib/data/features';
import { SECTION_HEADERS } from '@/lib/data/landing.data';
import { FeatureCard } from '@/components/ui/Cards';

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-neutral-100 py-16 sm:py-20 lg:py-24"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
            {SECTION_HEADERS.features.title}
          </h2>
          <p className="mt-3 text-base text-neutral-600 sm:mt-4 sm:text-lg">
            {SECTION_HEADERS.features.subtitle}
          </p>
        </header>

        {/* Features Grid - Equal height cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

