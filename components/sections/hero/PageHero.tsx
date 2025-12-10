/**
 * Page Hero Component
 * Reusable hero section for About, Contact, and other pages
 */

interface PageHeroProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 py-20 sm:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-primary-400/20 blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-xl text-primary-100 sm:text-2xl">
            {subtitle}
          </p>
        </div>

        {/* Optional children (e.g., stats, CTA buttons) */}
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}

