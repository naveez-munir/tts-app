import { Metadata } from 'next';
import DriversListContent from './_components/DriversListContent';

export const metadata: Metadata = {
  title: 'Drivers | TTS Operator',
  description: 'Manage your drivers and their details.',
};

export default function DriversPage() {
  return <DriversListContent />;
}

