import { Metadata } from 'next';
import EditDriverContent from '../../_components/EditDriverContent';

export const metadata: Metadata = {
  title: 'Edit Driver | TTS Operator',
  description: 'Edit driver details and documents.',
};

export default async function EditDriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditDriverContent driverId={id} />;
}
