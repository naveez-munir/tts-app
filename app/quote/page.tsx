import { Suspense } from 'react';
import { Metadata } from 'next';
import { quoteMetadata } from '@/lib/metadata/quote.metadata';
import { QuotePageContent } from './_components/QuotePageContent';

export const metadata: Metadata = quoteMetadata;

function QuotePageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<QuotePageFallback />}>
      <QuotePageContent />
    </Suspense>
  );
}

