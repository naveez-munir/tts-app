import { Metadata } from 'next';
import { siteConfig } from '@/lib/data/seo.data';

export const aboutMetadata: Metadata = {
  title: 'About Us - TransferHub | UK Airport Transfer Platform',
  description: 'Learn about TransferHub, the UK\'s trusted airport transfer marketplace connecting travelers with professional transport operators. Transparent pricing, vetted drivers, 24/7 support.',
  keywords: [
    'about transferhub',
    'airport transfer company',
    'UK transport marketplace',
    'professional airport transfers',
    'vetted transport operators',
    'airport transfer platform',
  ],
  authors: [{ name: 'TransferHub' }],
  creator: 'TransferHub',
  publisher: 'TransferHub',
  openGraph: {
    title: 'About TransferHub - UK Airport Transfer Marketplace',
    description: 'Discover how TransferHub connects travelers with trusted transport operators across the UK. Transparent pricing, professional service, 24/7 support.',
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image-about.jpg`,
        width: 1200,
        height: 630,
        alt: 'About TransferHub - UK Airport Transfer Platform',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About TransferHub - UK Airport Transfer Marketplace',
    description: 'Discover how TransferHub connects travelers with trusted transport operators across the UK.',
    images: [`${siteConfig.url}/twitter-image-about.jpg`],
    creator: '@transferhub',
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

