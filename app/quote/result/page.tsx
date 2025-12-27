import { Metadata } from 'next';
import { QuoteResultContent } from './_components/QuoteResultContent';

export const metadata: Metadata = {
  title: 'Your Quote | TTS Airport Transfers',
  description: 'Review your airport transfer quote and proceed to booking.',
};

export default function QuoteResultPage() {
  return <QuoteResultContent />;
}

