import { Metadata } from 'next';
import { CheckoutContent } from './_components/CheckoutContent';

export const metadata: Metadata = {
  title: 'Checkout | TTS Transfers',
  description: 'Complete your transfer booking and payment.',
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}

