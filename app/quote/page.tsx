import { Metadata } from 'next';
import { quoteMetadata } from '@/lib/metadata/quote.metadata';
import { QuotePageContent } from './_components/QuotePageContent';

export const metadata: Metadata = quoteMetadata;

export default function QuotePage() {
  return <QuotePageContent />;
}

