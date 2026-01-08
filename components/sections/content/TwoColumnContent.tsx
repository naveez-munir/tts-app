import Image from 'next/image';
import { Building2 } from 'lucide-react';

/**
 * Two Column Content Component
 * Reusable component for image + text layouts
 */

interface TwoColumnContentProps {
  title: string;
  paragraphs: readonly string[];
  image: {
    src: string;
    alt: string;
  };
  imagePosition?: 'left' | 'right';
  backgroundColor?: 'white' | 'neutral';
}

export function TwoColumnContent({
  title,
  paragraphs,
  image,
  imagePosition = 'left',
  backgroundColor = 'white',
}: TwoColumnContentProps) {
  const bgColor = backgroundColor === 'white' ? 'bg-white' : 'bg-neutral-50';
  const hasImage = image.src && image.src.length > 0;

  return (
    <section className={`${bgColor} py-16 sm:py-20 lg:py-24`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-12 lg:grid-cols-2 lg:gap-16 ${imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
          {/* Image */}
          <div className={`relative overflow-hidden rounded-2xl shadow-xl ${imagePosition === 'right' ? 'lg:order-2' : ''}`}>
            <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200">
              {hasImage ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Building2 className="h-24 w-24 text-primary-400" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className={`flex flex-col justify-center ${imagePosition === 'right' ? 'lg:order-1' : ''}`}>
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-justify text-base leading-relaxed text-neutral-700 sm:text-lg ${index === 0 ? 'mt-6' : 'mt-4'}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

