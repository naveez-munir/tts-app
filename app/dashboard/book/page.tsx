import { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardBookContent } from './_components/DashboardBookContent';
import { getVehicleCapacitiesServer, convertToVehicleTypeData } from '@/lib/api/vehicle-capacity.api';

export const metadata: Metadata = {
  title: 'Book a Trip | TTS Dashboard',
  description: 'Book a new transfer trip.',
};

function BookPageFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );
}

export default async function DashboardBookPage() {
  // Fetch vehicle capacities server-side (cached by Next.js)
  const capacities = await getVehicleCapacitiesServer();
  const vehicleTypes = convertToVehicleTypeData(capacities);

  return (
    <Suspense fallback={<BookPageFallback />}>
      <DashboardBookContent vehicleTypes={vehicleTypes} />
    </Suspense>
  );
}

