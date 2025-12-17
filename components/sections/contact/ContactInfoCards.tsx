import { ContactCard } from '@/components/ui/Cards';
import type { ContactInfo } from '@/types/landing.types';

/**
 * Contact Info Cards Component
 * Displays contact information in card format
 * Uses ContactCard component for consistent styling
 */

interface ContactInfoCardsProps {
  contactInfo: ContactInfo[];
}

export function ContactInfoCards({ contactInfo }: ContactInfoCardsProps) {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">Get in Touch</h2>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">Multiple ways to reach our team</p>
        </div>

        {/* Cards Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {contactInfo.map((info, index) => (
            <ContactCard key={index} contact={info} />
          ))}
        </div>
      </div>
    </section>
  );
}

