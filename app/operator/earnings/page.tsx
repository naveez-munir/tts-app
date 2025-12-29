import { Metadata } from 'next';
import EarningsContent from './_components/EarningsContent';

export const metadata: Metadata = {
  title: 'Earnings | TTS Operator',
  description: 'Track your earnings and payouts.',
};

export default function EarningsPage() {
  return <EarningsContent />;
}

