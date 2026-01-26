import { Metadata } from 'next';
import AddVehicleContent from '../_components/AddVehicleContent';

export const metadata: Metadata = {
  title: 'Add Vehicle | TTS Operator',
  description: 'Add a new vehicle to your fleet.',
};

export default function AddVehiclePage() {
  return <AddVehicleContent />;
}
