import { Metadata } from 'next';
import OperatorDashboardContent from './_components/OperatorDashboardContent';

export const metadata: Metadata = {
  title: 'Operator Dashboard | TTS',
  description: 'Manage your transport operator account, view available jobs, and track your bids.',
};

export default function OperatorDashboardPage() {
  return <OperatorDashboardContent />;
}

