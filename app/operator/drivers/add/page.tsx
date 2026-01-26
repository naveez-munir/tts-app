import { Metadata } from 'next';
import AddDriverContent from '../_components/AddDriverContent';

export const metadata: Metadata = {
  title: 'Add Driver | TTS Operator',
  description: 'Add a new driver to your team.',
};

export default function AddDriverPage() {
  return <AddDriverContent />;
}
