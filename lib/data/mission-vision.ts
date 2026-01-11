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
    description: 'All major destinations covered',
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
    "To revolutionise travel transfers by creating a transparent, competitive marketplace that connects customers with trusted transport operators. We're committed to delivering exceptional service, competitive pricing, and peace of mind for every journey.",
  features: MISSION_FEATURES,
  images: [],
};

export const VISION_DATA: MissionVisionData = {
  title: 'Our Vision',
  description:
    "To become the UK's most trusted and innovative travel platform, setting new standards for reliability, affordability, and customer satisfaction. We envision a future where every traveller experiences stress-free, seamless journeys.",
  features: VISION_FEATURES,
  images: [],
};

