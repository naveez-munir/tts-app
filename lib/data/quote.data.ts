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
      description: 'All drivers are licenced, insured, and background-checked',
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
    luggage: '3 large, 2 hand',
    maxPassengers: 4,
    maxLuggage: 3,
    description: 'Ford Mondeo, VW Passat or similar. Up to 3 passengers + 3 suitcases (23kg), or 4 passengers + hand luggage only.',
    priceMultiplier: 1.0,
  },
  {
    value: 'ESTATE',
    label: 'Estate',
    passengers: '1-4',
    luggage: '4 large, 2 hand',
    maxPassengers: 4,
    maxLuggage: 4,
    description: 'Volvo Estate, VW Passat Estate or similar. Up to 4 passengers + 4 suitcases (23kg).',
    priceMultiplier: 1.05,
  },
  {
    value: 'GREEN_CAR',
    label: 'Green Car (Electric)',
    passengers: '1-4',
    luggage: '2 large, 2 hand',
    maxPassengers: 4,
    maxLuggage: 2,
    description: 'Tesla Model 3, BMW i4 or similar. Eco-friendly electric vehicle for up to 3 passengers + 2 suitcases, or 4 passengers + hand luggage.',
    priceMultiplier: 0.97,
  },
  {
    value: 'MPV',
    label: 'People Carrier',
    passengers: '5-6',
    luggage: '5 large, 4 hand',
    maxPassengers: 6,
    maxLuggage: 5,
    description: 'VW Sharan, Ford Galaxy or similar. Up to 5 passengers + 5 suitcases (23kg), or 6 passengers + hand luggage only.',
    priceMultiplier: 1.65,
  },
  {
    value: 'EXECUTIVE',
    label: 'Executive',
    passengers: '1-4',
    luggage: '3 large, 2 hand',
    maxPassengers: 4,
    maxLuggage: 3,
    description: 'Mercedes E-Class, BMW 5 Series or similar. Premium sedan for up to 3 passengers + 3 suitcases, or 4 passengers + hand luggage.',
    priceMultiplier: 1.65,
  },
  {
    value: 'EXECUTIVE_LUXURY',
    label: 'Executive Luxury',
    passengers: '1-3',
    luggage: '2 large, 2 hand',
    maxPassengers: 3,
    maxLuggage: 2,
    description: 'Mercedes S-Class, BMW 7 Series or similar. Luxury sedan for up to 3 passengers + 2 suitcases.',
    priceMultiplier: 2.75,
  },
  {
    value: 'EXECUTIVE_PEOPLE_CARRIER',
    label: 'Executive People Carrier',
    passengers: '5-6',
    luggage: '5 large, 4 hand',
    maxPassengers: 6,
    maxLuggage: 5,
    description: 'Mercedes V-Class, VW Caravelle or similar. Up to 5 passengers + 5 suitcases (23kg), or 6 passengers + hand luggage.',
    priceMultiplier: 1.95,
  },
  {
    value: 'MINIBUS',
    label: '8-Seater Minibus',
    passengers: '1-8',
    luggage: '8 large, 8 hand',
    maxPassengers: 8,
    maxLuggage: 8,
    description: 'VW Transporter, Mercedes Sprinter or similar. Up to 8 passengers + 8 suitcases (23kg).',
    priceMultiplier: 2.1,
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

