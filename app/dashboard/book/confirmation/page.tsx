import { Metadata } from 'next';
import { DashboardConfirmationContent } from './_components/DashboardConfirmationContent';

export const metadata: Metadata = {
  title: 'Booking Confirmed | TTS Dashboard',
  description: 'Your booking has been confirmed.',
};

export default function DashboardConfirmationPage() {
  return <DashboardConfirmationContent />;
}

