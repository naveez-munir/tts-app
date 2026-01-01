import { Metadata } from 'next';
import { CheckoutContent } from './_components/CheckoutContent';

export const metadata: Metadata = {
  title: 'Checkout | TTS Airport Transfers',
  description: 'Complete your airport transfer booking and payment.',
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}

