import type { Feature } from '@/types/landing.types';

/**
 * Features data for the features section
 * Icons are referenced by name and rendered in the component
 */
export const FEATURES: Feature[] = [
  {
    icon: 'money',
    title: 'Best Prices Guaranteed',
    description:
      'Get the most competitive rates for your airport transfers. Transparent pricing with no hidden fees or surprises.',
  },
  {
    icon: 'shield',
    title: 'Trusted Operators',
    description:
      'All transport operators are thoroughly vetted, licensed, and insured. Your safety and comfort are our top priorities.',
  },
  {
    icon: 'clock',
    title: '24/7 Support',
    description:
      'Our customer support team is available around the clock to assist you with bookings, changes, or any questions you may have.',
  },
  {
    icon: 'credit-card',
    title: 'Secure Payments',
    description:
      'Pay securely with Stripe. We accept all major credit cards, Apple Pay, and Google Pay. Your payment information is always protected.',
  },
  {
    icon: 'lightning',
    title: 'Instant Quotes',
    description:
      'Get an instant price quote in seconds. No waiting, no hidden fees. What you see is what you pay.',
  },
  {
    icon: 'map',
    title: 'UK-Wide Coverage',
    description:
      'Service available across the entire UK. From major airports to remote locations, we have operators ready to serve you.',
  },
];

