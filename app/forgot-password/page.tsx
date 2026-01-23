import { Metadata } from 'next';
import { ForgotPasswordPageContent } from './_components/ForgotPasswordPageContent';

export const metadata: Metadata = {
  title: 'Forgot Password | Total Travel Solution Group',
  description: 'Reset your password to regain access to your account.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageContent />;
}
