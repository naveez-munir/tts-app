'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Truck,
  Plus,
  Edit2,
  AlertCircle,
  RefreshCw,
  Power,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import {
  getVehicles,
  getVehiclePhotos,
  updateVehicle,
  deleteVehicle,
} from '@/lib/api/operator.api';
import type { Vehicle } from '@/lib/types';
import { extractErrorMessage } from '@/lib/utils/error-handler';
import { getVehicleTypeLabel } from '@/lib/utils/vehicle-type';

export default function VehiclesListContent() {
  const router = useRouter();
  const toast = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclePhotos, setVehiclePhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicles();
      setVehicles(data);

      // Fetch first available photo for each vehicle
      // Priority: FRONT, BACK, DRIVER_SIDE, FRONT_SIDE, DASHBOARD, REAR_BOOT
      const photoTypePriority = ['FRONT', 'BACK', 'DRIVER_SIDE', 'FRONT_SIDE', 'DASHBOARD', 'REAR_BOOT'];
      const photosMap: Record<string, string> = {};

      await Promise.all(
        data.map(async (vehicle) => {
          try {
            const photos = await getVehiclePhotos(vehicle.id);
            if (photos.length > 0) {
              // Find first available photo in priority order
              for (const photoType of photoTypePriority) {
                const photo = photos.find((p) => p.photoType === photoType);
                if (photo) {
                  // Sanitize malformed URLs (fix double S3 bucket URL)
                  const sanitizedUrl = photo.photoUrl.replace(
                    /^(https:\/\/[^\/]+\/)https?%3A\/\/[^\/]+\//,
                    '$1'
                  );
                  photosMap[vehicle.id] = sanitizedUrl;
                  break;
                }
              }
              // If no priority match, use the first photo
              if (!photosMap[vehicle.id] && photos[0]) {
                const sanitizedUrl = photos[0].photoUrl.replace(
                  /^(https:\/\/[^\/]+\/)https?%3A\/\/[^\/]+\//,
                  '$1'
                );
                photosMap[vehicle.id] = sanitizedUrl;
              }
            }
          } catch {
            // Ignore photo fetch errors
          }
        })
      );
      setVehiclePhotos(photosMap);
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleToggleActive = async (vehicleId: string, currentStatus: boolean) => {
    try {
      await updateVehicle(vehicleId, { isActive: !currentStatus });
      toast.success(`Vehicle ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      await fetchVehicles();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    try {
      await deleteVehicle(vehicleId);
      toast.success('Vehicle deleted successfully');
      await fetchVehicles();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Vehicles</h2>
          <p className="mt-1 text-neutral-600">{error}</p>
        </div>
        <Button onClick={fetchVehicles} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Fleet Management</h1>
          <p className="mt-1 text-neutral-600">Manage your vehicles, documents, and photos</p>
        </div>
        <Button onClick={() => router.push('/operator/vehicles/add')} variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{vehicles.length}</p>
          <p className="text-sm text-neutral-500">Total Vehicles</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-success-600">
            {vehicles.filter((v) => v.isActive).length}
          </p>
          <p className="text-sm text-neutral-500">Active Vehicles</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-neutral-600">
            {vehicles.filter((v) => !v.isActive).length}
          </p>
          <p className="text-sm text-neutral-500">Inactive Vehicles</p>
        </div>
      </div>

      {/* Vehicles Table */}
      {vehicles.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No vehicles yet"
          description="Add your first vehicle to start accepting jobs"
          action={
            <Button onClick={() => router.push('/operator/vehicles/add')} variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehiclePhotos[vehicle.id] ? (
                        <img
                          src={
                            vehiclePhotos[vehicle.id].startsWith('http')
                              ? vehiclePhotos[vehicle.id]
                              : `${process.env.NEXT_PUBLIC_S3_URL || ''}/${vehiclePhotos[vehicle.id]}`
                          }
                          alt={vehicle.registrationPlate}
                          className="h-12 w-16 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-16 bg-neutral-100 rounded flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-neutral-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        {vehicle.registrationPlate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                      {vehicle.color && (
                        <div className="text-sm text-neutral-500">{vehicle.color}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-600">
                        {getVehicleTypeLabel(vehicle.vehicleType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge variant={vehicle.isActive ? 'success' : 'default'}>
                        {vehicle.isActive ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => router.push(`/operator/vehicles/${vehicle.id}/edit`)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit2 className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleToggleActive(vehicle.id, vehicle.isActive)}
                          variant="outline"
                          size="sm"
                        >
                          <Power className="mr-1 h-4 w-4" />
                          {vehicle.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          onClick={() => setDeletingId(vehicle.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 text-error-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}
