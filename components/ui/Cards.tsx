import { getIcon } from '@/lib/utils/Icons';
import type { Feature, Step, Testimonial, StatItem, QuoteTrustIndicator, ContactInfo } from '@/types/landing.types';

/**
 * FeatureCard - White card with gradient icon badge
 * Used in FeaturesSection, ValuesSection, WhyChooseSection
 * Supports 'card' (default) and 'minimal' variants
 * Supports 'primary' and 'accent' icon colors
 */
interface FeatureCardProps {
  feature: Feature;
  variant?: 'card' | 'minimal';
  iconColor?: 'primary' | 'accent';
}

const iconGradients = {
  primary: 'from-primary-600 to-secondary-700',
  accent: 'from-accent-400 to-accent-600',
};

export function FeatureCard({ feature, variant = 'card', iconColor = 'primary' }: FeatureCardProps) {
  if (variant === 'minimal') {
    return (
      <div className="group rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br ${iconGradients[iconColor]} text-white transition-transform group-hover:scale-110`}
        >
          <span className="h-6 w-6">{getIcon(feature.icon)}</span>
        </div>
        <h3 className="mt-4 text-lg font-bold text-neutral-900">{feature.title}</h3>
        <p className="mt-2 text-justify text-sm text-neutral-600">{feature.description}</p>
      </div>
    );
  }

  return (
    <div className="group rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-xl sm:p-8">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br ${iconGradients[iconColor]} text-white transition-transform group-hover:scale-110`}
      >
        <span className="h-8 w-8">{getIcon(feature.icon)}</span>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-neutral-900">{feature.title}</h3>
      <p className="mt-3 text-justify text-base text-neutral-600">{feature.description}</p>
    </div>
  );
}

/**
 * StepCard - Glass card with number badge and icon
 * Used in HowItWorksSection
 */
interface StepCardProps {
  step: Step;
  isLast?: boolean;
}

export function StepCard({ step, isLast = false }: StepCardProps) {
  return (
    <div className="group relative flex">
      {/* Connecting Arrow (Desktop) */}
      {!isLast && (
        <div className="absolute -right-4 top-12 hidden h-0.5 w-8 bg-gradient-to-r from-accent-400 to-transparent lg:block" />
      )}

      {/* Card */}
      <div className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 p-6 shadow-xl ring-1 ring-white/20 backdrop-blur-sm transition-all hover:bg-white/15">
        {/* Gradient orb */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-400/20 opacity-75 blur-2xl transition-opacity group-hover:opacity-100" />

        <div className="relative flex flex-col">
          {/* Number Badge */}
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 shadow-lg">
            <span className="text-xl font-bold text-white">{step.number}</span>
          </div>

          {/* Icon */}
          <div className="mt-4 h-10 w-10 text-accent-300">{getIcon(step.icon)}</div>

          {/* Title */}
          <h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3>

          {/* Description */}
          <p className="mt-3 text-justify text-sm leading-relaxed text-white/80">{step.description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * TestimonialCard - Light card with quote icon and rating stars
 * Used in TestimonialsSection
 */
interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-neutral-50 p-6 shadow-sm transition-all hover:shadow-lg sm:p-8">
      {/* Quote Icon */}
      <div className="absolute right-4 top-4 h-16 w-16 opacity-10">
        <span className="text-primary-600">{getIcon('quote-mark')}</span>
      </div>

      {/* Rating Stars */}
      <div className="flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i} className="h-5 w-5 text-accent-500">
            {getIcon('star-filled')}
          </span>
        ))}
      </div>

      {/* Quote */}
      <p className="relative mt-4 text-justify text-sm leading-relaxed text-neutral-700 sm:text-base">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author Info */}
      <div className="mt-6 flex items-center gap-4">
        {/* Avatar */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-900 text-2xl shadow-md">
          {testimonial.image}
        </div>

        {/* Details */}
        <div>
          <div className="font-semibold text-neutral-900">{testimonial.name}</div>
          <div className="text-sm text-neutral-600">
            {testimonial.role} • {testimonial.location}
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-colors group-hover:border-primary-200" />
    </div>
  );
}

/**
 * StatCard - Glass card with icon and stat value
 * Used in CtaSection
 */
interface StatCardProps {
  stat: StatItem;
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm ring-1 ring-white/20">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent-500">
          <span className="h-6 w-6 text-white">{getIcon(stat.icon)}</span>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="text-sm text-white/70">{stat.label}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * TrustIndicatorCard - Glass card with icon, value, and label
 * Used in QuoteTrustIndicators for displaying trust stats on dark backgrounds
 */
interface TrustIndicatorCardProps {
  indicator: QuoteTrustIndicator;
}

export function TrustIndicatorCard({ indicator }: TrustIndicatorCardProps) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/15">
      {/* Icon */}
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-400/20 text-accent-400">
        <span className="h-6 w-6">{getIcon(indicator.icon)}</span>
      </div>
      {/* Value */}
      <div className="text-2xl font-black text-white">{indicator.value}</div>
      {/* Label */}
      <div className="mt-1 text-sm text-primary-100">{indicator.label}</div>
    </div>
  );
}

/**
 * DarkFeatureCard - Glass card for dark backgrounds with icon badge
 * Used in WhyChooseUsSection on quote page
 */
interface DarkFeatureCardProps {
  feature: Feature;
}

export function DarkFeatureCard({ feature }: DarkFeatureCardProps) {
  return (
    <div className="group relative flex">
      {/* Card */}
      <div className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 p-6 shadow-xl ring-1 ring-white/20 backdrop-blur-sm transition-all hover:bg-white/15">
        {/* Gradient orb */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-400/20 opacity-75 blur-2xl transition-opacity group-hover:opacity-100" />

        <div className="relative flex flex-col">
          {/* Icon Badge */}
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg">
            <span className="h-6 w-6">{getIcon(feature.icon)}</span>
          </div>

          {/* Title */}
          <h3 className="mt-4 text-xl font-bold text-white">{feature.title}</h3>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-white/80">{feature.description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * ContactCard - Card with secondary color icon and hover effect
 * Used in ContactInfoCards section
 * Consistent height with value always at bottom
 */
interface ContactCardProps {
  contact: ContactInfo;
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-secondary-300 hover:shadow-lg sm:p-8">
      {/* Icon */}
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 p-3 text-secondary-600 transition-colors duration-300 group-hover:bg-secondary-600 group-hover:text-white sm:h-14 sm:w-14">
        {getIcon(contact.icon)}
      </div>

      {/* Title */}
      <h3 className="mb-3 text-xl font-semibold text-primary-900 sm:text-2xl">{contact.title}</h3>

      {/* Description - flex-grow pushes value to bottom */}
      <p className="mb-4 flex-grow text-base leading-relaxed text-neutral-600">{contact.description}</p>

      {/* Contact Value - always at bottom with consistent styling */}
      {contact.href ? (
        <a
          href={contact.href}
          className="inline-flex items-center gap-2 text-base font-semibold text-secondary-600 transition-colors hover:text-secondary-700"
        >
          {contact.value}
          <span className="h-4 w-4 transition-transform group-hover:translate-x-1">{getIcon('arrow-right')}</span>
        </a>
      ) : (
        <p className="inline-flex items-center gap-2 text-base font-semibold text-secondary-600">
          {contact.value}
          <span className="h-4 w-4">{getIcon('arrow-right')}</span>
        </p>
      )}
    </div>
  );
}
