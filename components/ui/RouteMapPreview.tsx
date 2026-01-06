'use client';

import { Navigation } from 'lucide-react';
import type { StopPoint } from '@/lib/types/quote.types';

interface RouteMapPreviewProps {
  pickupLat: number | null;
  pickupLng: number | null;
  dropoffLat: number | null;
  dropoffLng: number | null;
  pickupAddress: string;
  dropoffAddress: string;
  stops?: StopPoint[];
  className?: string;
}

export function RouteMapPreview({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng,
  pickupAddress,
  dropoffAddress,
  stops = [],
  className = '',
}: RouteMapPreviewProps) {
  const hasValidCoordinates =
    pickupLat !== null &&
    pickupLng !== null &&
    dropoffLat !== null &&
    dropoffLng !== null;

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const getMapUrl = () => {
    if (!hasValidCoordinates) return null;

    if (googleMapsApiKey) {
      const origin = `${pickupLat},${pickupLng}`;
      const destination = `${dropoffLat},${dropoffLng}`;
      let url = `https://www.google.com/maps/embed/v1/directions?key=${googleMapsApiKey}&origin=${origin}&destination=${destination}&mode=driving`;

      if (stops.length > 0) {
        const waypoints = stops.map((s) => `${s.lat},${s.lng}`).join('|');
        url += `&waypoints=${encodeURIComponent(waypoints)}`;
      }

      return url;
    }

    const bbox = `${Math.min(pickupLng!, dropoffLng!) - 0.05},${Math.min(pickupLat!, dropoffLat!) - 0.05},${Math.max(pickupLng!, dropoffLng!) + 0.05},${Math.max(pickupLat!, dropoffLat!) + 0.05}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${pickupLat},${pickupLng}`;
  };

  const mapUrl = getMapUrl();

  return (
    <div className={`rounded-xl overflow-hidden bg-white border border-neutral-200 ${className}`}>
      {hasValidCoordinates && mapUrl ? (
        <div className="flex flex-col">
          {/* Google Maps Embed */}
          <div className="relative">
            <iframe
              src={mapUrl}
              className="w-full h-52 sm:h-64 lg:h-72 border-0"
              allowFullScreen
              loading="lazy"
              title="Route Map"
            />
          </div>

          <div className="bg-neutral-50 p-4 border-t border-neutral-200">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-100" />
                {stops.map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-neutral-300" />
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 text-xs font-medium text-accent-700">
                      {index + 1}
                    </div>
                  </div>
                ))}
                <div className="w-0.5 h-4 bg-neutral-300" />
                <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-100" />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Pickup</p>
                  <p className="text-sm text-neutral-800 leading-tight">{pickupAddress}</p>
                </div>
                {stops.map((stop, index) => (
                  <div key={index}>
                    <p className="text-xs font-semibold text-accent-600 uppercase tracking-wide">Stop {index + 1}</p>
                    <p className="text-sm text-neutral-800 leading-tight">{stop.address}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">Drop-off</p>
                  <p className="text-sm text-neutral-800 leading-tight">{dropoffAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Placeholder when no coordinates available
        <div className="flex flex-col items-center justify-center h-52 sm:h-64 lg:h-72 p-6 text-center bg-gradient-to-br from-neutral-50 to-neutral-100">
          <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-neutral-200 flex items-center justify-center mb-3">
            <Navigation className="h-7 w-7 text-primary-400" />
          </div>
          <p className="text-neutral-700 font-semibold">Route Preview</p>
          <p className="text-sm text-neutral-500 mt-1 max-w-[220px]">
            Enter pickup and drop-off locations to see your route
          </p>

          {/* Decorative route line */}
          <div className="mt-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="w-12 h-0.5 bg-neutral-300 rounded" />
            <div className="w-3 h-3 rounded-full bg-red-400" />
          </div>
        </div>
      )}
    </div>
  );
}

