import type { Step } from '@/types/landing.types';

/**
 * How It Works steps data
 * Icons are referenced by name and rendered in the component
 */
export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: '→',
    title: 'Get a Quote',
    description:
      'Enter your pick-up and drop-off locations, travel date, and passenger details. Receive an instant, fixed price quote in seconds.',
    icon: 'calculator',
  },
  {
    number: '→',
    title: 'Book & Pay Securely',
    description:
      'Confirm your journey details and pay securely online. Your booking is instantly confirmed with a unique reference number.',
    icon: 'credit-card',
  },
  {
    number: '→',
    title: 'Receive Driver Details',
    description:
      "We'll assign a licenced, professional driver and send you their details, including name, contact number, and vehicle registration.",
    icon: 'user',
  },
  {
    number: '✓',
    title: 'Enjoy Your Journey',
    description:
      'Your driver will arrive at the agreed location and time. Sit back, relax, and enjoy a smooth, comfortable journey.',
    icon: 'check',
  },
];

