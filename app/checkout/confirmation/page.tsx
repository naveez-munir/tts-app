import { Metadata } from 'next';
import { ConfirmationContent } from './_components/ConfirmationContent';

export const metadata: Metadata = {
  title: 'Booking Confirmed | TTS Airport Transfers',
  description: 'Your airport transfer booking has been confirmed.',
};

export default function ConfirmationPage() {
  return <ConfirmationContent />;
}

