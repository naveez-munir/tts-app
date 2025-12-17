/**
 * Navigation links for the header
 */
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/operators', label: 'For Operators' },
  { href: '/contact', label: 'Contact' },
] as const;

/**
 * CTA links for header
 */
export const CTA_LINKS = {
  SIGN_IN: '/sign-in',
  GET_QUOTE: '/quote',
} as const;

/**
 * Animation durations for consistent timing across the app
 */
export const ANIMATION_DURATIONS = {
  PULSE_SLOW: '4s',
  PULSE_MEDIUM: '3s',
  PULSE_FAST: '2s',
  FLOAT: '3s',
} as const;

/**
 * Animation delays for staggered effects
 */
export const ANIMATION_DELAYS = {
  SHORT: '1s',
  MEDIUM: '2s',
  LONG: '3s',
} as const;

/**
 * Platform statistics displayed in CTA and hero sections
 */
export const PLATFORM_STATS = {
  CUSTOMERS: '10,000+',
  OPERATORS: '500+',
  RATING: '4.8/5',
  RATING_VALUE: 4.8,
  RATING_MAX: 5,
} as const;

/**
 * Trust indicators for hero section
 */
export const TRUST_INDICATORS = [
  {
    icon: 'star',
    label: `${PLATFORM_STATS.RATING} Rating`,
  },
  {
    icon: 'users',
    label: `${PLATFORM_STATS.CUSTOMERS} Customers`,
  },
  {
    icon: 'check',
    label: 'UK-Wide Coverage',
  },
] as const;

