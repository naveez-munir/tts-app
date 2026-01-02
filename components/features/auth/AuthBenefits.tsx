import { getIcon, type IconName } from '@/lib/utils/Icons';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface AuthBenefitsProps {
  benefits: readonly Benefit[];
}

/**
 * Auth Benefits Component
 * Displays benefits of signing in/creating an account
 */
export function AuthBenefits({ benefits }: AuthBenefitsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="group flex gap-4 rounded-xl bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:ring-white/20 sm:p-5"
        >
          {/* Icon */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-500 text-white shadow-lg transition-transform duration-200 group-hover:scale-105"
            aria-hidden="true"
          >
            <span className="h-5 w-5">
              {getIcon(benefit.icon as IconName)}
            </span>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-white sm:text-base">{benefit.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/80 sm:text-sm">
              {benefit.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

