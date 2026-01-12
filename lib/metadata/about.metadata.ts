import { Metadata } from 'next';
import { siteConfig } from '@/lib/data/seo.data';

export const aboutMetadata: Metadata = {
  title: 'About Us - Total Travel Solution | UK Travel Platform',
  description: 'Learn about Total Travel Solution, the UK\'s trusted travel marketplace connecting travellers with professional transport operators. Transparent pricing, vetted drivers, 24/7 support.',
  keywords: [
    'about total travel solution',
    'airport transfer company',
    'UK transport marketplace',
    'professional airport transfers',
    'vetted transport operators',
    'airport transfer platform',
  ],
  authors: [{ name: 'Total Travel Solution' }],
  creator: 'Total Travel Solution',
  publisher: 'Total Travel Solution',
  openGraph: {
    title: 'About Total Travel Solution - UK Travel Marketplace',
    description: 'Discover how Total Travel Solution connects travellers with trusted transport operators across the UK. Transparent pricing, professional service, 24/7 support.',
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image-about.jpg`,
        width: 1200,
        height: 630,
        alt: 'About Total Travel Solution - UK Travel Platform',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Total Travel Solution - UK Travel Marketplace',
    description: 'Discover how Total Travel Solution connects travellers with trusted transport operators across the UK.',
    images: [`${siteConfig.url}/twitter-image-about.jpg`],
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
    canonical: `${siteConfig.url}/about`,
  },
};

