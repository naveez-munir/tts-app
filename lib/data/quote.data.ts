import type {
  QuotePageData,
  VehicleType,
  ServiceType,
  SelectOption,
} from '@/types/landing.types';

/**
 * Quote Page Data
 * Content for the get quote page
 */

export const QUOTE_PAGE_DATA: QuotePageData = {
  hero: {
    badge: 'Instant Quote',
    title: 'Get Your Transfer Quote',
    subtitle:
      'Enter your journey details below to receive an instant, transparent quote with no hidden fees',
  },
  formSteps: [
    {
      step: 1,
      title: 'Journey Details',
      description: 'Where and when do you need to travel?',
    },
    {
      step: 2,
      title: 'Passenger Info',
      description: 'How many passengers and luggage?',
    },
    {
      step: 3,
      title: 'Vehicle Selection',
      description: 'Choose your preferred vehicle type',
    },
    {
      step: 4,
      title: 'Contact Details',
      description: 'How can we reach you?',
    },
  ],
  whyChooseUs: [
    {
      icon: 'shield-check',
      title: 'Fixed Pricing',
      description: 'No surge pricing or hidden fees - the price you see is what you pay',
    },
    {
      icon: 'clock',
      title: 'On-Time Guarantee',
      description: 'We monitor flight times and traffic to ensure punctual service',
    },
    {
      icon: 'users',
      title: 'Professional Drivers',
      description: 'All drivers are licensed, insured, and background-checked',
    },
    {
      icon: 'headphones',
      title: '24/7 Support',
      description: 'Our customer support team is available around the clock',
    },
  ],
  trustIndicators: [
    {
      icon: 'star',
      value: '4.8/5',
      label: 'Customer Rating',
    },
    {
      icon: 'users',
      value: '10,000+',
      label: 'Happy Customers',
    },
    {
      icon: 'map-pin',
      value: 'UK-Wide',
      label: 'Coverage',
    },
    {
      icon: 'shield',
      value: '100%',
      label: 'Secure Payments',
    },
  ],
};

export const VEHICLE_TYPES: VehicleType[] = [
  {
    value: 'SALOON',
    label: 'Saloon',
    passengers: '1-4',
    luggage: '2 large, 2 hand',
    description: 'Standard sedan - perfect for individuals or small groups',
    priceMultiplier: 1.0,
  },
  {
    value: 'ESTATE',
    label: 'Estate',
    passengers: '1-4',
    luggage: '4 large, 2 hand',
    description: 'Estate car with extra luggage space',
    priceMultiplier: 1.15,
  },
  {
    value: 'MPV',
    label: 'MPV / People Carrier',
    passengers: '5-6',
    luggage: '4 large, 4 hand',
    description: '7-seater for families or groups',
    priceMultiplier: 1.35,
  },
  {
    value: 'EXECUTIVE',
    label: 'Executive',
    passengers: '1-4',
    luggage: '2 large, 2 hand',
    description: 'Premium sedan for business travel',
    priceMultiplier: 1.5,
  },
  {
    value: 'MINIBUS',
    label: 'Minibus',
    passengers: '7-16',
    luggage: '10+ large',
    description: 'Large group transport',
    priceMultiplier: 2.0,
  },
];

export const SERVICE_TYPES: ServiceType[] = [
  { value: 'AIRPORT_PICKUP', label: 'Airport Pickup' },
  { value: 'AIRPORT_DROPOFF', label: 'Airport Drop-off' },
  { value: 'POINT_TO_POINT', label: 'Point to Point' },
];

export const PASSENGER_OPTIONS: SelectOption[] = Array.from({ length: 16 }, (_, i) => ({
  value: String(i + 1),
  label: i + 1 === 1 ? '1 passenger' : `${i + 1} passengers`,
}));

export const LUGGAGE_OPTIONS: SelectOption[] = Array.from({ length: 11 }, (_, i) => ({
  value: String(i),
  label: i === 0 ? 'No luggage' : i === 1 ? '1 bag' : `${i} bags`,
}));

