import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/layout/LegalPageLayout';
import { CookiesContent } from './_components/CookiesContent';
import { cookiesMetadata } from '@/lib/metadata/legal.metadata';

export const metadata: Metadata = cookiesMetadata;

/**
 * Cookie Policy Page
 * Public page - no authentication required
 * SEO optimized with proper metadata and structured content
 */
export default function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy">
      <CookiesContent />
    </LegalPageLayout>
  );
}

