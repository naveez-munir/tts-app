import { IconName } from '@/lib/utils/Icons';

/**
 * Landing page type definitions
 * Centralized types for all landing page components
 */

/** Feature item for features section */
export interface Feature {
  icon: IconName;
  title: string;
  description: string;
}

/** Step item for how it works section */
export interface Step {
  number: string | number;
  title: string;
  description: string;
  icon: IconName;
}

/** Testimonial item for testimonials section */
export interface Testimonial {
  name: string;
  role: string;
  location: string;
  rating: number;
  image: string;
  quote: string;
}

/** Mission/Vision feature item */
export interface MissionFeature {
  title: string;
  description: string;
  icon: IconName;
}

/** Trust indicator badge item */
export interface TrustIndicator {
  icon: IconName;
  text: string;
}

/** Stat card item for CTA section */
export interface StatItem {
  icon: IconName;
  value: string;
  label: string;
}

/** Mission/Vision section data */
export interface MissionVisionData {
  title: string;
  description: string;
  features: MissionFeature[];
  images: {
    src: string;
    alt: string;
  }[];
}

/** Simple stat item (without icon) for StatsGrid */
export interface SimpleStat {
  value: string;
  label: string;
}

/** Image data for content sections */
export interface ImageData {
  src: string;
  alt: string;
}

/** Story/Content section data */
export interface StoryData {
  title: string;
  paragraphs: string[];
  image: ImageData;
}

/** About page data structure */
export interface AboutPageData {
  hero: {
    title: string;
    subtitle: string;
  };
  stats: SimpleStat[];
  story: StoryData;
  values: Feature[];
  whyChooseUs: Feature[];
}

// ============================================
// Quote Page Types
// ============================================

/** Trust indicator with value for quote page */
export interface QuoteTrustIndicator {
  icon: IconName;
  value: string;
  label: string;
}

/** Form step for multi-step quote form */
export interface FormStep {
  step: number;
  title: string;
  description: string;
}

/** Vehicle type option */
export interface VehicleType {
  value: string;
  label: string;
  passengers: string;
  luggage: string;
  description: string;
  priceMultiplier: number;
}

/** Service type option */
export interface ServiceType {
  value: string;
  label: string;
}

/** Select option for dropdowns */
export interface SelectOption {
  value: string;
  label: string;
}

/** Quote page data structure */
export interface QuotePageData {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  formSteps: FormStep[];
  whyChooseUs: Feature[];
  trustIndicators: QuoteTrustIndicator[];
}

// ============================================
// Operators Page Types
// ============================================

/** Operator step for how it works section (with number) */
export interface OperatorStep {
  number: number;
  title: string;
  description: string;
  icon: IconName;
}

/** Operator testimonial with avatar URL */
export interface OperatorTestimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
}

/** Requirement category with list of requirements */
export interface RequirementCategory {
  category: string;
  requirements: string[];
}

/** CTA button configuration */
export interface CtaButton {
  text: string;
  href: string;
}

/** Operators page data structure */
export interface OperatorsPageData {
  hero: {
    title: string;
    subtitle: string;
  };
  stats: SimpleStat[];
  benefits: {
    title: string;
    subtitle: string;
    items: Feature[];
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: OperatorStep[];
  };
  requirements: {
    title: string;
    subtitle: string;
    items: RequirementCategory[];
  };
  earnings: {
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
  };
  testimonials: OperatorTestimonial[];
  cta: {
    title: string;
    subtitle: string;
    primaryButton: CtaButton;
    secondaryButton: CtaButton;
  };
}

// ===== CONTACT PAGE TYPES =====

export interface ContactInfo {
  type: string;
  title: string;
  description: string;
  value: string;
  href?: string;
  icon: IconName;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface InquiryType {
  value: string;
  label: string;
}

export interface ContactPageData {
  hero: {
    title: string;
    subtitle: string;
  };
  contactInfo: ContactInfo[];
  form: {
    title: string;
    subtitle: string;
    inquiryTypes: InquiryType[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: FAQ[];
  };
}

