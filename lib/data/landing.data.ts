import type { TrustIndicator, StatItem } from '@/types/landing.types';

/**
 * Trust indicators for hero section and other areas
 */
export const TRUST_INDICATORS: TrustIndicator[] = [
  {
    icon: 'star-filled',
    text: '4.8/5 Rating',
  },
  {
    icon: 'users',
    text: '10,000+ Customers',
  },
  {
    icon: 'check-circle',
    text: 'UK-Wide Coverage',
  },
];

/**
 * CTA section stats
 */
export const CTA_STATS: StatItem[] = [
  {
    icon: 'users-group',
    value: '10,000+',
    label: 'Happy Customers',
  },
  {
    icon: 'shield-check',
    value: '500+',
    label: 'Trusted Operators',
  },
  {
    icon: 'clock',
    value: '24/7',
    label: 'Support Available',
  },
  {
    icon: 'lightning',
    value: 'Instant',
    label: 'Quote Generation',
  },
];

/**
 * Section headers data
 */
export const SECTION_HEADERS = {
  features: {
    title: 'Why Choose Total Travel Solution?',
    subtitle: 'The smart way to book airport transfers across the UK',
  },
  howItWorks: {
    title: 'How It Works',
    subtitle: 'Book your airport transfer in 4 simple steps',
  },
  testimonials: {
    title: 'What Our Customers Say',
    subtitle: "Don't just take our word for it - hear from our satisfied customers",
  },
  missionVision: {
    title: 'Our Mission & Vision',
    subtitle: 'Transforming airport transfers across the UK',
  },
} as const;

