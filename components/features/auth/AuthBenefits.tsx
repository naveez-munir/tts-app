import { getIcon } from '@/lib/utils/Icons';

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="flex gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:shadow-lg lg:gap-4 lg:p-5"
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 text-white shadow-lg lg:h-12 lg:w-12">
              <div className="h-5 w-5 lg:h-6 lg:w-6">
                {getIcon(benefit.icon as any)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-white lg:text-lg">{benefit.title}</h3>
            <p className="mt-1 text-xs text-white/70 lg:text-sm">{benefit.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

