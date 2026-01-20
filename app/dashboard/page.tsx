import { Metadata } from 'next';
import DashboardContent from './_components/DashboardContent';

export const metadata: Metadata = {
  title: 'My Bookings | TTS Dashboard',
  description: 'View and manage your transfer bookings.',
};

export default function DashboardPage() {
  return <DashboardContent />;
}

