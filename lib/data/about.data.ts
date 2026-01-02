import type { AboutPageData, MissionVisionData } from '@/types/landing.types';

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

/**
 * Mission & Vision Section Data
 */
export const missionData: MissionVisionData = {
  title: 'Our Mission',
  description:
    'To revolutionize airport transfers by creating a transparent, competitive marketplace that connects customers with trusted transport operators. We deliver exceptional service, competitive pricing, and peace of mind for every journey.',
  features: [
    {
      title: 'Transparent Pricing',
      description: 'No hidden fees, clear upfront costs',
      icon: 'currency',
    },
    {
      title: 'Vetted Operators',
      description: 'Licensed and insured professionals',
      icon: 'badge',
    },
    {
      title: '24/7 Support',
      description: 'Always here to help you',
      icon: 'clock',
    },
  ],
  images: [],
};

export const visionData: MissionVisionData = {
  title: 'Our Vision',
  description:
    "To become the UK's most trusted and innovative airport transfer platform, setting new standards for reliability, affordability, and customer satisfaction. We envision a future where every traveler experiences stress-free, seamless journeys.",
  features: [
    {
      title: 'UK-Wide Coverage',
      description: 'All major airports covered',
      icon: 'map',
    },
    {
      title: 'Tech-Driven',
      description: 'Seamless digital experience',
      icon: 'computer',
    },
    {
      title: 'Eco-Friendly',
      description: 'Sustainable transport options',
      icon: 'leaf',
    },
  ],
  images: [],
};

