import { Metadata } from 'next';
import { DashboardCheckoutContent } from './_components/DashboardCheckoutContent';

export const metadata: Metadata = {
  title: 'Checkout | TTS Dashboard',
  description: 'Complete your booking payment.',
};

export default function DashboardCheckoutPage() {
  return <DashboardCheckoutContent />;
}

