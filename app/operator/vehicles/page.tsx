import { Metadata } from 'next';
import VehiclesListContent from './_components/VehiclesListContent';

export const metadata: Metadata = {
  title: 'Vehicles | TTS Operator',
  description: 'Manage your vehicle fleet.',
};

export default function VehiclesPage() {
  return <VehiclesListContent />;
}
