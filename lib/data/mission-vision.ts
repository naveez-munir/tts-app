import type { MissionVisionData, MissionFeature } from '@/types/landing.types';

/**
 * Mission and Vision content data
 */

export const MISSION_FEATURES: MissionFeature[] = [
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
];

export const VISION_FEATURES: MissionFeature[] = [
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
];

export const MISSION_DATA: MissionVisionData = {
  title: 'Our Mission',
  description:
    "To revolutionize airport transfers by creating a transparent, competitive marketplace that connects customers with trusted transport operators. We're committed to delivering exceptional service, competitive pricing, and peace of mind for every journey.",
  features: MISSION_FEATURES,
  images: [
    {
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=450&fit=crop&q=80',
      alt: 'Modern airport terminal with travelers',
    },
    {
      src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=450&fit=crop&q=80',
      alt: 'Luxury executive vehicle',
    },
    {
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop&q=80',
      alt: 'Professional chauffeur driver',
    },
  ],
};

export const VISION_DATA: MissionVisionData = {
  title: 'Our Vision',
  description:
    "To become the UK's most trusted and innovative airport transfer platform, setting new standards for reliability, affordability, and customer satisfaction. We envision a future where every traveler experiences stress-free, seamless journeys.",
  features: VISION_FEATURES,
  images: [
    {
      src: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&h=450&fit=crop&q=80',
      alt: 'UK map and coverage network',
    },
    {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=450&fit=crop&q=80',
      alt: 'Technology and digital booking platform',
    },
    {
      src: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=450&fit=crop&q=80',
      alt: 'Eco-friendly electric vehicle',
    },
  ],
};

