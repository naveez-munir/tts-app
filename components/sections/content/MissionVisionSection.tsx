import { getIcon, type IconName } from '@/lib/utils/Icons';
import type { MissionVisionData } from '@/types/landing.types';

interface MissionVisionBlockProps {
  data: MissionVisionData;
  variant: 'mission' | 'vision';
}

function MissionVisionBlock({ data, variant }: MissionVisionBlockProps) {
  const gradientClass =
    variant === 'mission'
      ? 'from-accent-500 to-accent-600'
      : 'from-secondary-500 to-secondary-600';

  const iconName: IconName = variant === 'mission' ? 'lightning' : 'eye';

  return (
    <div className="text-center">
      {/* Badge */}
      <div
        className={`inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r ${gradientClass} px-5 py-2.5 shadow-lg`}
      >
        <span className="h-5 w-5 text-white">{getIcon(iconName)}</span>
        <h3 className="text-lg font-bold text-white sm:text-xl">{data.title}</h3>
      </div>

      {/* Description */}
      <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
        {data.description}
      </p>

      {/* Feature Cards - Glass style for dark background */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {data.features.map((feature, index) => (
          <div
            key={index}
            className="rounded-xl bg-white/10 p-5 text-center ring-1 ring-white/20 backdrop-blur-sm transition-all hover:bg-white/15 sm:p-6"
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-lg ${
                variant === 'mission' ? 'bg-accent-500/20 text-accent-300' : 'bg-secondary-500/20 text-secondary-300'
              }`}
              aria-hidden="true"
            >
              <span className="h-6 w-6">{getIcon(feature.icon)}</span>
            </div>
            <h4 className="mt-4 text-base font-bold text-white">{feature.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MissionVisionSectionProps {
  mission: MissionVisionData;
  vision: MissionVisionData;
}

/**
 * Mission & Vision Section
 * Dark gradient background matching HowItWorks section
 * Centered layout with glass-style feature cards
 */
export function MissionVisionSection({ mission, vision }: MissionVisionSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 py-16 sm:py-20 lg:py-24">
      {/* Decorative gradient orbs */}
      <div
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary-400/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Our Mission & Vision
          </h2>
          <p className="mt-3 text-base text-white/90 sm:mt-4 sm:text-lg">
            Transforming airport transfers across the UK
          </p>
        </header>

        {/* Mission & Vision Blocks */}
        <div className="mt-12 space-y-16 lg:mt-16 lg:space-y-20">
          <MissionVisionBlock data={mission} variant="mission" />
          <MissionVisionBlock data={vision} variant="vision" />
        </div>
      </div>
    </section>
  );
}

