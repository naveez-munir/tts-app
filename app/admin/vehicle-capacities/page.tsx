import { Metadata } from 'next';
import { Suspense } from 'react';
import { VehicleCapacitiesContent } from './_components/VehicleCapacitiesContent';

export const metadata: Metadata = {
  title: 'Vehicle Capacities | Admin',
  description: 'Configure passenger and luggage capacities for each vehicle type.',
};

function VehicleCapacitiesFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );
}

export default function VehicleCapacitiesPage() {
  return (
    <Suspense fallback={<VehicleCapacitiesFallback />}>
      <VehicleCapacitiesContent />
    </Suspense>
  );
}

