import { Metadata } from 'next';
import { siteConfig } from '@/lib/data/seo.data';

export const operatorsMetadata: Metadata = {
  title: 'Join Our Network - Total Travel Solution | For Transport Operators',
  description: 'Join Total Travel Solution\'s network of professional transport operators. Get steady transfer jobs, guaranteed payments, and 24/7 support. Apply now to grow your business.',
  keywords: [
    'transport operator jobs',
    'airport transfer operator',
    'private hire opportunities',
    'driver jobs UK',
    'taxi operator platform',
    'airport transfer business',
    'transport operator network',
    'private hire work',
    'chauffeur opportunities',
  ],
  openGraph: {
    title: 'Join Total Travel Solution - For Transport Operators',
    description: 'Grow your transport business with Total Travel Solution. Steady jobs, guaranteed payments, and professional support.',
    url: `${siteConfig.url}/operators`,
    siteName: siteConfig.name,
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/og-image-operators.jpg`,
        width: 1200,
        height: 630,
        alt: 'Join Total Travel Solution Operator Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Total Travel Solution - For Transport Operators',
    description: 'Grow your transport business with steady jobs and guaranteed payments.',
    images: [`${siteConfig.url}/twitter-image-operators.jpg`],
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
    canonical: `${siteConfig.url}/operators`,
  },
};

