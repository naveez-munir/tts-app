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
      'Enjoy competitive, transparent pricing on all taxi bookings across the UK — no hidden charges, no surprises.',
  },
  {
    icon: 'shield',
    title: 'Trusted UK Operators',
    description:
      'All drivers are licenced, insured, and carefully vetted in line with UK transport regulations, so you can book with confidence.',
  },
  {
    icon: 'clock',
    title: '24/7 Support',
    description:
      'Our UK-based team is available 24/7 to help with bookings, changes, or any queries — whenever you need us.',
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
    title: 'UK-Wide Taxi Coverage',
    description:
      'Book taxis anywhere in the UK — including London, Manchester, Birmingham, Heathrow, Gatwick, Luton, and beyond.',
  },
];

