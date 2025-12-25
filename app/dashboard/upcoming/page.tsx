import { Metadata } from 'next';
import UpcomingTripsContent from './_components/UpcomingTripsContent';

export const metadata: Metadata = {
  title: 'Upcoming Trips | TTS Dashboard',
  description: 'View your upcoming airport transfers and scheduled journeys.',
};

export default function UpcomingTripsPage() {
  return <UpcomingTripsContent />;
}

