'use client';

import { useEffect, useState, useCallback } from 'react';
import { Car, Users, Briefcase, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { getAdminVehicleCapacities, updateVehicleCapacity } from '@/lib/api/vehicle-capacity.api';
import { formatVehicleLabel } from '@/lib/hooks';
import type { VehicleCapacity, UpdateVehicleCapacityDto } from '@/lib/types';

interface EditFormData {
  maxPassengers: number;
  maxPassengersHandOnly: number | null;
  maxSuitcases: number;
  maxHandLuggage: number;
  exampleModels: string;
  description: string;
  isActive: boolean;
}

export function VehicleCapacitiesContent() {
  const [capacities, setCapacities] = useState<VehicleCapacity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCapacities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAdminVehicleCapacities();
      setCapacities(data);
    } catch (err) {
      console.error('Failed to fetch vehicle capacities:', err);
      setError('Failed to load vehicle capacities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCapacities();
  }, [fetchCapacities]);

  const handleEdit = (capacity: VehicleCapacity) => {
    setEditingId(capacity.id);
    setEditForm({
      maxPassengers: capacity.maxPassengers,
      maxPassengersHandOnly: capacity.maxPassengersHandOnly,
      maxSuitcases: capacity.maxSuitcases,
      maxHandLuggage: capacity.maxHandLuggage,
      exampleModels: capacity.exampleModels,
      description: capacity.description || '',
      isActive: capacity.isActive,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSave = async (capacity: VehicleCapacity) => {
    if (!editForm) return;

    try {
      setIsSaving(true);
      const updateData: UpdateVehicleCapacityDto = {
        maxPassengers: editForm.maxPassengers,
        maxPassengersHandOnly: editForm.maxPassengersHandOnly,
        maxSuitcases: editForm.maxSuitcases,
        maxHandLuggage: editForm.maxHandLuggage,
        exampleModels: editForm.exampleModels,
        description: editForm.description || null,
        isActive: editForm.isActive,
      };

      const updated = await updateVehicleCapacity(capacity.vehicleType, updateData);
      setCapacities((prev) =>
        prev.map((c) => (c.id === capacity.id ? updated : c))
      );
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      console.error('Failed to update vehicle capacity:', err);
      setError('Failed to update. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay message="Loading vehicle capacities..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-neutral-600 mb-4">{error}</p>
        <Button onClick={fetchCapacities}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Vehicle Capacities</h1>
        <p className="mt-1 text-neutral-600">
          Configure passenger and luggage limits for each vehicle type
        </p>
      </div>

      {/* Capacities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {capacities.map((capacity) => (
          <VehicleCapacityCard
            key={capacity.id}
            capacity={capacity}
            isEditing={editingId === capacity.id}
            editForm={editForm}
            isSaving={isSaving}
            onEdit={() => handleEdit(capacity)}
            onCancel={handleCancel}
            onSave={() => handleSave(capacity)}
            onFormChange={setEditForm}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// VEHICLE CAPACITY CARD COMPONENT
// ============================================================================

interface VehicleCapacityCardProps {
  capacity: VehicleCapacity;
  isEditing: boolean;
  editForm: EditFormData | null;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onFormChange: (form: EditFormData) => void;
}

function VehicleCapacityCard({
  capacity,
  isEditing,
  editForm,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onFormChange,
}: VehicleCapacityCardProps) {
  if (isEditing && editForm) {
    return (
      <div className="rounded-xl border-2 border-primary-300 bg-white p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            {formatVehicleLabel(capacity.vehicleType)}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              disabled={isSaving}
              aria-label="Cancel editing"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              disabled={isSaving}
              aria-label="Save changes"
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Example Models */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Example Models
            </label>
            <Input
              value={editForm.exampleModels}
              onChange={(e) => onFormChange({ ...editForm, exampleModels: e.target.value })}
              placeholder="Ford Mondeo, VW Passat"
            />
          </div>

          {/* Passenger Limits - 2 column grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Max Passengers
              </label>
              <Input
                type="number"
                min={1}
                max={20}
                value={editForm.maxPassengers}
                onChange={(e) => onFormChange({ ...editForm, maxPassengers: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Hand Luggage Only
              </label>
              <Input
                type="number"
                min={0}
                max={20}
                value={editForm.maxPassengersHandOnly ?? ''}
                onChange={(e) => onFormChange({
                  ...editForm,
                  maxPassengersHandOnly: e.target.value ? parseInt(e.target.value) : null
                })}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Luggage Limits - 2 column grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Suitcases
              </label>
              <Input
                type="number"
                min={0}
                max={20}
                value={editForm.maxSuitcases}
                onChange={(e) => onFormChange({ ...editForm, maxSuitcases: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Hand Luggage
              </label>
              <Input
                type="number"
                min={0}
                max={20}
                value={editForm.maxHandLuggage}
                onChange={(e) => onFormChange({ ...editForm, maxHandLuggage: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) => onFormChange({ ...editForm, description: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Optional description..."
            />
          </div>

          {/* Active Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={editForm.isActive}
              onChange={(e) => onFormChange({ ...editForm, isActive: e.target.checked })}
              className="h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-neutral-700">Active</span>
          </label>
        </div>
      </div>
    );
  }

  // View Mode Card
  return (
    <div className={`rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
      capacity.isActive ? 'border-neutral-200' : 'border-neutral-200 opacity-60'
    }`}>
      {/* Card Header */}
      <div className="flex items-start justify-between p-5 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
            <Car className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">
              {formatVehicleLabel(capacity.vehicleType)}
            </h3>
            <p className="text-sm text-neutral-500">{capacity.exampleModels}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge variant={capacity.isActive ? 'success' : 'default'}>
            {capacity.isActive ? 'Active' : 'Inactive'}
          </StatusBadge>
          <button
            onClick={onEdit}
            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            aria-label={`Edit ${formatVehicleLabel(capacity.vehicleType)}`}
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card Body - Capacity Stats */}
      <div className="p-5 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <CapacityStat
            icon={<Users className="h-4 w-4 text-primary-500" />}
            label="Passengers"
            value={capacity.maxPassengers.toString()}
          />
          <CapacityStat
            icon={<Users className="h-4 w-4 text-neutral-400" />}
            label="Hand Only"
            value={capacity.maxPassengersHandOnly?.toString() ?? '—'}
          />
          <CapacityStat
            icon={<Briefcase className="h-4 w-4 text-accent-500" />}
            label="Suitcases"
            value={capacity.maxSuitcases.toString()}
          />
          <CapacityStat
            icon={<Briefcase className="h-4 w-4 text-neutral-400" />}
            label="Hand Luggage"
            value={capacity.maxHandLuggage.toString()}
          />
        </div>

        {/* Description */}
        {capacity.description && (
          <p className="text-sm text-neutral-600 pt-2 border-t border-neutral-100">
            {capacity.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CAPACITY STAT COMPONENT
// ============================================================================

interface CapacityStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function CapacityStat({ icon, label, value }: CapacityStatProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="text-base font-semibold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}

