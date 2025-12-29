import { Metadata } from 'next';
import AssignedJobsContent from './_components/AssignedJobsContent';

export const metadata: Metadata = {
  title: 'Assigned Jobs | TTS Operator',
  description: 'Manage your assigned jobs and submit driver details.',
};

export default function AssignedJobsPage() {
  return <AssignedJobsContent />;
}

