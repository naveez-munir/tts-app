'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const VEHICLE_OPTIONS = [
  { value: 'SALOON', label: 'Saloon (1-4 passengers)' },
  { value: 'ESTATE', label: 'Estate (1-4 passengers)' },
  { value: 'MPV', label: 'MPV (5-6 passengers)' },
  { value: 'EXECUTIVE', label: 'Executive (1-4 passengers)' },
  { value: 'MINIBUS', label: 'Minibus (7-16 passengers)' },
];

/**
 * Quick Quote Form Component
 * Displays a compact booking form for the hero section
 */
export function QuickQuoteForm() {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    vehicleType: 'SALOON',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/quote';
  };

  return (
    <div className="relative">
      {/* Decorative Elements */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent-500/20 blur-2xl" />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary-500/20 blur-2xl" />

      {/* Form Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 to-white/5 p-8 backdrop-blur-xl shadow-2xl ring-1 ring-white/20">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Get Instant Quote</h3>
            <p className="text-sm text-primary-100">Enter your journey details below</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              placeholder="Pickup location"
              value={formData.pickup}
              onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
              className="bg-white/90 text-neutral-800 placeholder-neutral-500"
            />

            <Input
              placeholder="Drop-off location"
              value={formData.dropoff}
              onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })}
              className="bg-white/90 text-neutral-800 placeholder-neutral-500"
            />

            <Input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-white/90 text-neutral-800"
            />

            <Select
              options={VEHICLE_OPTIONS}
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="bg-white/90 text-neutral-800"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-accent-500/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-accent-600/40 active:scale-95"
            >
              Get Instant Quote →
            </button>
          </form>

          {/* Form Benefits */}
          <div className="space-y-2 border-t border-white/20 pt-4">
            <div className="flex items-center gap-2 text-sm text-primary-100">
              <svg className="h-4 w-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant pricing</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary-100">
              <svg className="h-4 w-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure booking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

