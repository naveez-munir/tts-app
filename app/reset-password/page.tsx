import { Metadata } from 'next';
import { ResetPasswordPageContent } from './_components/ResetPasswordPageContent';

export const metadata: Metadata = {
  title: 'Reset Password | Total Travel Solution Group',
  description: 'Enter your OTP code and create a new password.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageContent />;
}
