import { Metadata } from 'next';
import MyBidsContent from './_components/MyBidsContent';

export const metadata: Metadata = {
  title: 'My Bids | TTS Operator',
  description: 'Track all your submitted bids and their status.',
};

export default function MyBidsPage() {
  return <MyBidsContent />;
}

