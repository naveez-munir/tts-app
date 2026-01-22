import { Metadata } from 'next';
import CompletePaymentContent from './_components/CompletePaymentContent';

export const metadata: Metadata = {
  title: 'Complete Payment | TTS Dashboard',
  description: 'Complete your pending booking payment.',
};

interface CompletePaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompletePaymentPage({ params }: CompletePaymentPageProps) {
  const { id } = await params;
  return <CompletePaymentContent bookingId={id} />;
}

