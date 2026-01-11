/**
 * Operators Page Data
 * Content for the "For Operators" / "Join Our Network" page
 * NOTE: Does NOT expose bidding system - focuses on recruitment messaging
 */

import type { OperatorsPageData } from '@/types/landing.types';

export const operatorsPageData: OperatorsPageData = {
  hero: {
    title: 'Join Our Network of Professional Transport Operators',
    subtitle: 'Connect with customers across the UK and grow your business with Total Travel Solution',
  },

  stats: [
    { value: '500+', label: 'Active Operators' },
    { value: '£2,500+', label: 'Avg. Monthly Earnings' },
    { value: '10,000+', label: 'Jobs Monthly' },
    { value: '4.8/5', label: 'Operator Satisfaction' },
  ],

  benefits: {
    title: 'Why Join Total Travel Solution?',
    subtitle: 'Grow your business with a trusted platform',
    items: [
      {
        icon: 'briefcase',
        title: 'Steady Stream of Jobs',
        description: 'Get matched with transfer jobs in your service area. Access thousands of customers looking for reliable transport.',
      },
      {
        icon: 'calendar',
        title: 'Flexible Schedule',
        description: "You're in control. Accept jobs that fit your schedule and availability. Work as much or as little as you want.",
      },
      {
        icon: 'shield-check',
        title: 'Guaranteed Payment',
        description: 'Get paid on time, every time. Weekly payouts directly to your bank account. No chasing customers for payment.',
      },
      {
        icon: 'users',
        title: 'Professional Support',
        description: '24/7 operator support team ready to help. Technical assistance, customer service backup, and dispute resolution.',
      },
      {
        icon: 'chart-bar',
        title: 'Business Growth Tools',
        description: 'Dashboard to track earnings, manage jobs, and view performance metrics. Build your reputation with customer ratings.',
      },
      {
        icon: 'star',
        title: 'Quality Customers',
        description: 'All customers are verified and pre-paid. No-shows are covered. Focus on providing excellent service.',
      },
    ],
  },

  howItWorks: {
    title: 'How It Works',
    subtitle: 'Simple process to start earning',
    steps: [
      {
        number: 1,
        title: 'Apply Online',
        description: 'Complete our simple registration form with your business details, vehicle information, and service areas.',
        icon: 'clipboard-list',
      },
      {
        number: 2,
        title: 'Get Verified',
        description: 'Upload your operating licence, insurance documents, and vehicle details. Our team reviews within 48 hours.',
        icon: 'shield-check',
      },
      {
        number: 3,
        title: 'Receive Jobs',
        description: 'Get notified of available jobs in your area via email and SMS. Review job details and accept those that suit you.',
        icon: 'bell',
      },
      {
        number: 4,
        title: 'Complete & Earn',
        description: 'Provide excellent service, complete the journey, and get paid weekly. Build your reputation with 5-star ratings.',
        icon: 'currency-pound',
      },
    ],
  },

  requirements: {
    title: 'Requirements to Join',
    subtitle: 'What you need to become a Total Travel Solution operator',
    items: [
      {
        category: 'Licensing & Insurance',
        requirements: [
          'Valid Private Hire or Hackney Carriage licence',
          'Comprehensive vehicle insurance with hire & reward cover',
          'Public liability insurance (minimum £5 million)',
          'Valid MOT certificate (if vehicle is over 3 years old)',
        ],
      },
      {
        category: 'Vehicle Standards',
        requirements: [
          'Vehicle must be less than 10 years old',
          'Clean, well-maintained, and roadworthy condition',
          'Air conditioning and heating systems working',
          'Adequate luggage space for passenger requirements',
        ],
      },
      {
        category: 'Driver Requirements',
        requirements: [
          'Valid UK driving licence (held for minimum 3 years)',
          'Enhanced DBS check (we can arrange this for you)',
          'Professional appearance and customer service skills',
          'Smartphone for job notifications and navigation',
        ],
      },
    ],
  },

  earnings: {
    title: 'Earnings Potential',
    subtitle: 'Transparent pricing and reliable income',
    description: 'Your earnings depend on the jobs you complete. Transfer typically depends on distance and vehicle type. Operators working full time can earn excellent pay each week.',
    highlights: [
      'Keep majority of each fare',
      'Weekly payouts every Friday',
      'No hidden fees or charges',
      'Bonus opportunities for top-rated operators',
      'Premium rates for executive vehicles',
      'Additional earnings from return journeys',
    ],
  },

  testimonials: [
    {
      name: 'James Mitchell',
      role: 'Executive Car Operator, London',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      quote: 'Total Travel Solution has transformed my business. Steady flow of quality customers, guaranteed payments, and excellent support. I\'ve increased my monthly income by 40% since joining.',
    },
    {
      name: 'Sarah Thompson',
      role: 'MPV Operator, Manchester',
      avatar: 'https://i.pravatar.cc/150?img=45',
      rating: 5,
      quote: 'The flexibility is amazing. I can accept jobs around my family schedule. The platform is easy to use and payments are always on time. Highly recommend to fellow operators.',
    },
    {
      name: 'David Patel',
      role: 'Minibus Operator, Birmingham',
      avatar: 'https://i.pravatar.cc/150?img=33',
      rating: 5,
      quote: 'Professional platform with real support. No more empty miles or time-wasters. Every customer is verified and pre-paid. This is the future of professional transfers.',
    },
  ],

  cta: {
    title: 'Ready to Grow Your Business?',
    subtitle: 'Join 500+ professional operators earning with Total Travel Solution',
    primaryButton: {
      text: 'Apply Now',
      href: '/operators/register',
    },
    secondaryButton: {
      text: 'Learn More',
      href: '/contact',
    },
  },
};

