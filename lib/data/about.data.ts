import type { AboutPageData } from '@/types/landing.types';

/**
 * About Page Data
 */

export const aboutPageData: AboutPageData = {
  hero: {
    title: 'About Total Travel Solution',
    subtitle: 'Connecting travelers with trusted transport operators across the UK',
  },
  stats: [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Trusted Operators' },
    { value: '4.8/5', label: 'Average Rating' },
    { value: '24/7', label: 'Support Available' },
  ],
  story: {
    title: 'Our Story',
    image: {
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
      alt: 'Modern airport terminal',
    },
    paragraphs: [
      'Total Travel Solution was founded with a simple mission: to make airport transfers transparent, affordable, and stress-free for everyone. We recognized that travelers deserved better than opaque pricing and unreliable service.',
      "By creating a marketplace that connects customers directly with vetted transport operators, we've built a platform where competition drives quality and affordability. Our technology ensures you always get the best service at the best price.",
      "Today, we're proud to serve thousands of customers across the UK, working with hundreds of professional operators who share our commitment to excellence.",
    ],
  },
  values: [
    {
      title: 'Transparency',
      description: 'Clear pricing with no hidden fees. What you see is what you pay.',
      icon: 'check-circle',
    },
    {
      title: 'Reliability',
      description: 'Professional drivers, on-time service, and 24/7 support you can count on.',
      icon: 'clock',
    },
    {
      title: 'Quality',
      description: 'Vetted operators with valid licenses, insurance, and modern vehicles.',
      icon: 'star',
    },
    {
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go the extra mile for every journey.',
      icon: 'heart',
    },
  ],
  whyChooseUs: [
    {
      title: 'Competitive Pricing',
      description:
        'Our marketplace model ensures you get the best rates from professional operators competing for your business.',
      icon: 'currency',
    },
    {
      title: 'Instant Booking',
      description:
        'Get a quote in seconds, book in minutes. Our streamlined process makes airport transfers effortless.',
      icon: 'clock',
    },
    {
      title: 'Professional Drivers',
      description:
        'All operators are thoroughly vetted with valid licenses, insurance, and excellent track records.',
      icon: 'badge',
    },
    {
      title: 'UK-Wide Coverage',
      description:
        'From Heathrow to Edinburgh, we cover all major UK airports with reliable local operators.',
      icon: 'map',
    },
    {
      title: 'Secure Payments',
      description:
        'All payments processed securely through Stripe with 3D Secure authentication for your protection.',
      icon: 'shield',
    },
    {
      title: 'Flexible Cancellation',
      description:
        'Cancel up to 24 hours before your journey for a full refund. No questions asked.',
      icon: 'refresh',
    },
  ],
};

