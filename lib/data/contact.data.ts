/**
 * Contact Page Data
 */

import type { ContactPageData } from '@/types/landing.types';

export const contactPageData: ContactPageData = {
  hero: {
    title: 'Get in Touch',
    subtitle: 'We\'re here to help with your airport transfer needs',
  },
  contactInfo: [
    {
      type: 'email',
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours',
      value: 'support@totaltravelsolution.co.uk',
      href: 'mailto:support@totaltravelsolution.co.uk',
      icon: 'mail',
    },
    {
      type: 'phone',
      title: 'Call Us',
      description: 'Available 24/7 for urgent inquiries',
      value: '+44 20 1234 5678',
      href: 'tel:+442012345678',
      icon: 'phone',
    },
    {
      type: 'hours',
      title: 'Support Hours',
      description: '24/7 phone support for urgent matters',
      value: 'Email: Mon-Sun, 24 hours',
      icon: 'clock',
    },
  ],
  form: {
    title: 'Send Us a Message',
    subtitle: 'Fill out the form below and we\'ll get back to you as soon as possible',
    inquiryTypes: [
      { value: 'general', label: 'General Inquiry' },
      { value: 'booking', label: 'Booking Support' },
      { value: 'payment', label: 'Payment Issue' },
      { value: 'cancellation', label: 'Cancellation Request' },
      { value: 'feedback', label: 'Feedback' },
      { value: 'other', label: 'Other' },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers to common questions',
    items: [
      {
        question: 'How do I book an airport transfer?',
        answer: 'Simply click "Get Quote" in the header, enter your journey details (pickup location, drop-off location, date/time, and passenger count), and you\'ll receive an instant quote. Confirm your booking and pay securely online to complete the process.',
      },
      {
        question: 'When will I receive my driver details?',
        answer: 'After your booking is confirmed and paid, we\'ll assign a professional driver to your journey. You\'ll receive driver details (name, phone number, and vehicle registration) via email and SMS at least 24 hours before your pickup time.',
      },
      {
        question: 'What is your cancellation policy?',
        answer: 'You can cancel your booking up to 24 hours before the scheduled pickup time for a full refund. Cancellations made within 24 hours may be subject to a cancellation fee. Please contact our support team to process your cancellation.',
      },
      {
        question: 'Are your drivers licensed and insured?',
        answer: 'Yes, all transport operators on our platform are thoroughly vetted. They must provide valid operating licenses, insurance documentation, and meet our strict quality standards before being approved to accept bookings.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, and Google Pay. All payments are processed securely through Stripe with 3D Secure authentication for your protection.',
      },
      {
        question: 'What if my flight is delayed?',
        answer: 'For airport pickups, we include 60 minutes of complimentary waiting time from your scheduled pickup time. If your flight is delayed, please contact your assigned driver directly using the phone number provided in your booking confirmation.',
      },
    ],
  },
};

