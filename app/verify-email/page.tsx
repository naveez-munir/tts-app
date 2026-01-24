import { Metadata } from 'next';
import { VerifyEmailPageContent } from './_components/VerifyEmailPageContent';

export const metadata: Metadata = {
  title: 'Verify Email | Total Travel Solution Group',
  description: 'Enter your OTP code to verify your email address.',
};

export default function VerifyEmailPage() {
  return <VerifyEmailPageContent />;
}
