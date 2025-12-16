/**
 * SEO Data - Centralized SEO content for all pages
 */

export const siteConfig = {
  name: 'Total Travel Solution',
  shortName: 'TTS',
  description: 'UK\'s trusted airport transfer marketplace connecting travelers with professional transport operators',
  url: 'https://totaltravelsolution.co.uk',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/totaltravelsolution',
    facebook: 'https://facebook.com/totaltravelsolution',
  },
  contact: {
    email: 'support@totaltravelsolution.co.uk',
    phone: '+44 20 1234 5678',
  },
  company: {
    legalName: 'TOTAL TRAVEL SOLUTION GROUP LIMITED',
    companyNumber: '16910276',
    companyType: 'Private Limited by Shares',
  },
} as const;

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: siteConfig.description,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: siteConfig.contact.phone,
    contactType: 'customer service',
    email: siteConfig.contact.email,
    availableLanguage: ['en'],
    areaServed: 'GB',
  },
  sameAs: [
    siteConfig.links.twitter,
    siteConfig.links.facebook,
  ],
} as const;

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: siteConfig.name,
  image: `${siteConfig.url}/logo.png`,
  '@id': siteConfig.url,
  url: siteConfig.url,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  priceRange: '££',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.5074,
    longitude: -0.1278,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '10000',
  },
} as const;

