import { Metadata } from 'next';
import { siteConfig } from '@/lib/data/seo.data';

export const landingMetadata: Metadata = {
  title: 'Total Travel Solution - UK Transfers | Instant Quotes & Professional Drivers',
  description: 'Book reliable transfers across the UK with Total Travel Solution. Instant quotes, professional drivers, competitive prices. UK-wide coverage. Book now!',
  keywords: [
    'airport transfers UK',
    'airport taxi',
    'Heathrow airport transfer',
    'Gatwick airport transfer',
    'Manchester airport transfer',
    'airport shuttle',
    'private airport transfer',
    'executive airport transfer',
    'cheap airport transfers',
    'airport transfer booking',
    'UK taxi',
    'professional transfers',
  ],
  authors: [{ name: 'Total Travel Solution' }],
  creator: 'Total Travel Solution',
  publisher: 'Total Travel Solution',
  openGraph: {
    title: 'Total Travel Solution - UK Transfers | Instant Quotes',
    description: 'Book reliable transfers across the UK. Instant quotes, professional drivers, competitive prices. UK-wide coverage.',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Total Travel Solution - UK Transfer Platform',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Total Travel Solution - UK Transfers',
    description: 'Book reliable transfers across the UK. Instant quotes, professional drivers, competitive prices.',
    images: [`${siteConfig.url}/twitter-image.jpg`],
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
    canonical: siteConfig.url,
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

