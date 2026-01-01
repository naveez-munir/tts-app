import { Metadata } from 'next';
import { siteConfig } from '@/lib/data/seo.data';

export const contactMetadata: Metadata = {
  title: 'Contact Us - Total Travel Solution | Get in Touch',
  description: 'Contact Total Travel Solution for airport transfer inquiries, booking support, or general questions. Available 24/7 via phone and email. Fast response guaranteed.',
  keywords: [
    'contact total travel solution',
    'airport transfer support',
    'booking help',
    'customer service',
    'transfer inquiries',
    '24/7 support',
  ],
  authors: [{ name: 'Total Travel Solution' }],
  creator: 'Total Travel Solution',
  publisher: 'Total Travel Solution',
  openGraph: {
    title: 'Contact Total Travel Solution - 24/7 Customer Support',
    description: 'Get in touch with Total Travel Solution for airport transfer inquiries, booking support, or questions. Available 24/7 via phone and email.',
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image-contact.jpg`,
        width: 1200,
        height: 630,
        alt: 'Contact Total Travel Solution - Customer Support',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Total Travel Solution - 24/7 Customer Support',
    description: 'Get in touch with Total Travel Solution for airport transfer inquiries and support.',
    images: [`${siteConfig.url}/twitter-image-contact.jpg`],
    creator: '@totaltravelsolution',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

