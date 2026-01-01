import { Metadata } from 'next';
import ProfileContent from './_components/ProfileContent';

export const metadata: Metadata = {
  title: 'My Profile | TTS Dashboard',
  description: 'View and manage your account information.',
};

export default function ProfilePage() {
  return <ProfileContent />;
}

