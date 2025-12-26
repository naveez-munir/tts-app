import { Metadata } from 'next';
import BookingDetailsContent from './_components/BookingDetailsContent';

export const metadata: Metadata = {
  title: 'Booking Details | TTS Dashboard',
  description: 'View your booking details and manage your trip.',
};

interface BookingDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { id } = await params;
  return <BookingDetailsContent bookingId={id} />;
}

