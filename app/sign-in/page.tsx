import { Metadata } from 'next';
import { signInMetadata } from '@/lib/metadata/auth.metadata';
import { SignInPageContent } from './_components/SignInPageContent';

export const metadata: Metadata = signInMetadata;

export default function SignInPage() {
  return <SignInPageContent />;
}

