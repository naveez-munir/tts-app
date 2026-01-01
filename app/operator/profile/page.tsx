import { Metadata } from 'next';
import OperatorProfileContent from './_components/OperatorProfileContent';

export const metadata: Metadata = {
  title: 'Profile | TTS Operator',
  description: 'Manage your operator profile and bank details.',
};

export default function OperatorProfilePage() {
  return <OperatorProfileContent />;
}

