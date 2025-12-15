import { TrustIndicatorCard } from '@/components/ui/Cards';
import type { QuoteTrustIndicator } from '@/types/landing.types';

interface QuoteTrustIndicatorsProps {
  indicators: readonly QuoteTrustIndicator[] | QuoteTrustIndicator[];
}

/**
 * Quote Trust Indicators Component
 * Displays trust badges and statistics using TrustIndicatorCard
 */
export function QuoteTrustIndicators({ indicators }: QuoteTrustIndicatorsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {indicators.map((indicator, index) => (
        <TrustIndicatorCard key={index} indicator={indicator} />
      ))}
    </div>
  );
}

