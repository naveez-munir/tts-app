/**
 * Page Hero Component
 * Reusable hero section for About, Contact, and other pages
 * Fully responsive: Mobile (320px+), Tablet (640px+), Desktop (1024px+)
 */

interface PageHeroProps {
  title: string;
  subtitle: string;
  /** Optional badge text above title */
  badge?: string;
  children?: React.ReactNode;
}

export function PageHero({ title, subtitle, badge, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900">
      {/* Background Pattern - Responsive grid size */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] lg:bg-[size:4rem_4rem]" />
      </div>

      {/* Gradient Orbs - Responsive sizing */}
      <div className="absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-500/20 blur-2xl sm:h-72 sm:w-72 sm:blur-3xl lg:h-96 lg:w-96" />
      <div className="absolute bottom-0 left-0 h-48 w-48 translate-y-1/2 -translate-x-1/2 rounded-full bg-primary-400/20 blur-2xl sm:h-72 sm:w-72 sm:blur-3xl lg:h-96 lg:w-96" />
      {/* Additional accent orb for visual depth */}
      <div className="absolute left-1/2 top-1/2 hidden h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400/10 blur-3xl md:block" />

      {/* Content Container - Responsive padding */}
      <div className="container relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-28 xl:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Optional Badge */}
          {badge && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur-sm sm:mb-5 sm:px-4 sm:py-2 sm:text-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
              {badge}
            </div>
          )}

          {/* Title - Responsive typography with proper line height */}
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-white xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.1]">
            {title}
          </h1>

          {/* Subtitle - Responsive with max-width for readability */}
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-100/90 sm:mt-4 sm:text-base md:mt-5 md:max-w-2xl md:text-lg lg:mt-6 lg:text-xl">
            {subtitle}
          </p>
        </div>

        {/* Optional children (e.g., stats, CTA buttons) - Responsive margin */}
        {children && (
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14">{children}</div>
        )}
      </div>

      {/* Bottom decorative line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}

