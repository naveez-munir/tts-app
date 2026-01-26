import { Metadata } from 'next';
import AvailableJobsContent from './_components/AvailableJobsContent';

export const metadata: Metadata = {
  title: 'Available Jobs | TTS Operator',
  description: 'View and bid on available transfer jobs in your service area.',
};

export default function AvailableJobsPage() {
  return <AvailableJobsContent />;
}

