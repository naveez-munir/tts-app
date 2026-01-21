'use client';

import { useEffect, useState } from 'react';
import { QuoteFormSection } from '@/components/features/quote/QuoteFormSection';
import { getCurrentUser } from '@/lib/api/auth.api';
import type { User } from '@/lib/types/auth.types';
import type { VehicleType } from '@/types/landing.types';

interface DashboardBookContentProps {
  vehicleTypes?: VehicleType[];
}

export function DashboardBookContent({ vehicleTypes }: DashboardBookContentProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Book a Trip</h1>
        <p className="mt-1 text-neutral-600">
          Fill in your journey details to get an instant quote.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
        <QuoteFormSection resultUrl="/dashboard/book/review" user={user} vehicleTypes={vehicleTypes} />
      </div>
    </div>
  );
}

