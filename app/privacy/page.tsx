import { Metadata } from 'next';
import { LegalPageLayout } from '@/components/layout/LegalPageLayout';
import { PrivacyContent } from './_components/PrivacyContent';
import { privacyMetadata } from '@/lib/metadata/legal.metadata';

export const metadata: Metadata = privacyMetadata;

/**
 * Privacy Policy Page
 * Public page - no authentication required
 * SEO optimized with proper metadata and structured content
 */
export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <PrivacyContent />
    </LegalPageLayout>
  );
}

