import { Metadata } from 'next';
import JobOffersContent from './_components/JobOffersContent';

export const metadata: Metadata = {
  title: 'Job Offers | TTS Operator',
  description: 'View and respond to job offers awaiting your acceptance.',
};

export default function JobOffersPage() {
  return <JobOffersContent />;
}

