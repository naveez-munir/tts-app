import { Metadata } from 'next';
import { QuoteResultContent } from './_components/QuoteResultContent';

export const metadata: Metadata = {
  title: 'Your Quote | TTS Transfers',
  description: 'Review your transfer quote and proceed to booking.',
};

export default function QuoteResultPage() {
  return <QuoteResultContent />;
}

