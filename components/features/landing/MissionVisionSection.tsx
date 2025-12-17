'use client';

import Image from 'next/image';

/**
 * Mission & Vision Section Component
 * Three-column layout with image gallery and feature cards
 */
export function MissionVisionSection() {
  const missionImages = [
    {
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=450&fit=crop&q=80',
      alt: 'Modern airport terminal with travelers'
    },
    {
      src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=450&fit=crop&q=80',
      alt: 'Luxury executive vehicle'
    },
    {
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop&q=80',
      alt: 'Professional chauffeur driver'
    },
  ];

  const visionImages = [
    {
      src: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&h=450&fit=crop&q=80',
      alt: 'UK map and coverage network'
    },
    {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=450&fit=crop&q=80',
      alt: 'Technology and digital booking platform'
    },
    {
      src: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=450&fit=crop&q=80',
      alt: 'Eco-friendly electric vehicle'
    },
  ];

  const missionFeatures = [
    {
      title: 'Transparent Pricing',
      description: 'No hidden fees, clear upfront costs',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Vetted Operators',
      description: 'Licensed and insured professionals',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: '24/7 Support',
      description: 'Always here to help you',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  const visionFeatures = [
    {
      title: 'UK-Wide Coverage',
      description: 'All major airports covered',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Tech-Driven',
      description: 'Seamless digital experience',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Eco-Friendly',
      description: 'Sustainable transport options',
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-neutral-50 py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
            Our Mission & Vision
          </h2>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
            Transforming airport transfers across the UK
          </p>
        </div>

        {/* Mission Section */}
        <div className="mt-12 lg:mt-16">
          {/* Mission Images */}
          <div className="grid gap-4 sm:grid-cols-3">
            {missionImages.map((img, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-md">
                <div className="aspect-[4/3] bg-neutral-200">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Mission Content */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-neutral-700 sm:text-lg">
              To revolutionize airport transfers by creating a transparent, competitive marketplace that connects customers with trusted transport operators. We're committed to delivering exceptional service, competitive pricing, and peace of mind for every journey.
            </p>
          </div>

          {/* Mission Features */}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {missionFeatures.map((feature, index) => (
              <div key={index} className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-white">
                  {feature.icon}
                </div>
                <h4 className="mt-4 text-lg font-bold text-neutral-900">{feature.title}</h4>
                <p className="mt-2 text-sm text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Section */}
        <div className="mt-16 lg:mt-20">
          {/* Vision Images */}
          <div className="grid gap-4 sm:grid-cols-3">
            {visionImages.map((img, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-md">
                <div className="aspect-[4/3] bg-neutral-200">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Vision Content */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-neutral-700 sm:text-lg">
              To become the UK's most trusted and innovative airport transfer platform, setting new standards for reliability, affordability, and customer satisfaction. We envision a future where every traveler experiences stress-free, seamless journeys.
            </p>
          </div>

          {/* Vision Features */}
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {visionFeatures.map((feature, index) => (
              <div key={index} className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 text-white">
                  {feature.icon}
                </div>
                <h4 className="mt-4 text-lg font-bold text-neutral-900">{feature.title}</h4>
                <p className="mt-2 text-sm text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

