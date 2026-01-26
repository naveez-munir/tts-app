'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Plus,
  Edit2,
  AlertCircle,
  RefreshCw,
  Power,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import {
  getDrivers,
  updateDriver,
  deleteDriver,
} from '@/lib/api/operator.api';
import type { Driver } from '@/lib/types';
import { extractErrorMessage } from '@/lib/utils/error-handler';

export default function DriversListContent() {
  const router = useRouter();
  const toast = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      setError(errorMessage);
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleToggleActive = async (driverId: string, currentStatus: boolean) => {
    try {
      await updateDriver(driverId, { isActive: !currentStatus });
      toast.success(`Driver ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      await fetchDrivers();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (driverId: string) => {
    try {
      await deleteDriver(driverId);
      toast.success('Driver deleted successfully');
      await fetchDrivers();
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
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Drivers</h2>
          <p className="mt-1 text-neutral-600">{error}</p>
        </div>
        <Button onClick={fetchDrivers} variant="primary">
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
          <h1 className="text-2xl font-bold text-neutral-900">Driver Management</h1>
          <p className="mt-1 text-neutral-600">Manage your drivers and their documents</p>
        </div>
        <Button onClick={() => router.push('/operator/drivers/add')} variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{drivers.length}</p>
          <p className="text-sm text-neutral-500">Total Drivers</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-success-600">
            {drivers.filter((d) => d.isActive).length}
          </p>
          <p className="text-sm text-neutral-500">Active Drivers</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-neutral-600">
            {drivers.filter((d) => !d.isActive).length}
          </p>
          <p className="text-sm text-neutral-500">Inactive Drivers</p>
        </div>
      </div>

      {/* Drivers Table */}
      {drivers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No drivers yet"
          description="Add your first driver to start managing your team"
          action={
            <Button onClick={() => router.push('/operator/drivers/add')} variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    License
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
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {driver.profileImageUrl ? (
                        <img
                          src={driver.profileImageUrl}
                          alt={`${driver.firstName} ${driver.lastName}`}
                          className="h-12 w-12 object-cover rounded-full"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-neutral-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-neutral-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">
                        {driver.firstName} {driver.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{driver.phoneNumber}</div>
                      {driver.email && (
                        <div className="text-sm text-neutral-500">{driver.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {driver.drivingLicenseNumber ? (
                        <div className="text-sm text-neutral-600">
                          {driver.drivingLicenseNumber}
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-400">Not provided</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge variant={driver.isActive ? 'success' : 'default'}>
                        {driver.isActive ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => router.push(`/operator/drivers/${driver.id}/edit`)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit2 className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleToggleActive(driver.id, driver.isActive)}
                          variant="outline"
                          size="sm"
                        >
                          <Power className="mr-1 h-4 w-4" />
                          {driver.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          onClick={() => setDeletingId(driver.id)}
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
        title="Delete Driver"
        message="Are you sure you want to delete this driver? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
}
