import { Metadata } from 'next';
import { DashboardReviewContent } from './_components/DashboardReviewContent';

export const metadata: Metadata = {
  title: 'Review Quote | TTS Dashboard',
  description: 'Review your quote and proceed to checkout.',
};

export default function DashboardReviewPage() {
  return <DashboardReviewContent />;
}

