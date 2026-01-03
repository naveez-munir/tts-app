import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/layout/LegalPageLayout';
import { TermsContent } from './_components/TermsContent';
import { termsMetadata } from '@/lib/metadata/legal.metadata';

export const metadata: Metadata = termsMetadata;

/**
 * Terms & Conditions Page
 * Public page - no authentication required
 * SEO optimized with proper metadata and structured content
 */
export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions">
      <TermsContent />
    </LegalPageLayout>
  );
}

