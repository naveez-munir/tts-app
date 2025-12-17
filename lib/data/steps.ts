import type { Step } from '@/types/landing.types';

/**
 * How It Works steps data
 * Icons are referenced by name and rendered in the component
 */
export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: '01',
    title: 'Get a Quote',
    description:
      'Enter your pickup and drop-off locations, date, and passenger details. Receive an instant price quote in seconds.',
    icon: 'calculator',
  },
  {
    number: '02',
    title: 'Book & Pay',
    description:
      'Confirm your booking details and pay securely online. Your booking is instantly confirmed with a unique reference number.',
    icon: 'credit-card',
  },
  {
    number: '03',
    title: 'Get Driver Details',
    description:
      "We'll assign a professional driver and send you their details including name, phone number, and vehicle registration.",
    icon: 'user',
  },
  {
    number: '04',
    title: 'Enjoy Your Journey',
    description:
      'Your driver will meet you at the agreed location and time. Sit back, relax, and enjoy a comfortable journey.',
    icon: 'check',
  },
];

