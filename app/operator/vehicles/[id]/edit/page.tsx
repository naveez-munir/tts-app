import { Metadata } from 'next';
import EditVehicleContent from '../../_components/EditVehicleContent';

export const metadata: Metadata = {
  title: 'Edit Vehicle | TTS Operator',
  description: 'Edit vehicle details, documents, and photos.',
};

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;


  return <EditVehicleContent vehicleId={id} />;
}

