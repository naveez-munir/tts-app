'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { createVehicle } from '@/lib/api/operator.api';
import type { CreateVehicleDto } from '@/lib/types';
import { extractErrorMessage } from '@/lib/utils/error-handler';
import { getVehicleTypeOptions } from '@/lib/utils/vehicle-type';

export default function AddVehicleContent() {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<CreateVehicleDto>({
    vehicleType: 'SALOON',
    registrationPlate: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    logbookUrl: '',
    motCertificateUrl: '',
    motExpiryDate: '',
    insuranceDocumentUrl: '',
    insuranceExpiryDate: '',
    hirePermissionLetterUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.registrationPlate || !formData.make || !formData.model) {
      toast.warning('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      // Convert date strings to ISO datetime format
      const payload = {
        ...formData,
        motExpiryDate: formData.motExpiryDate
          ? `${formData.motExpiryDate}T00:00:00Z`
          : undefined,
        insuranceExpiryDate: formData.insuranceExpiryDate
          ? `${formData.insuranceExpiryDate}T00:00:00Z`
          : undefined,
      };

      await createVehicle(payload);
      toast.success('Vehicle added successfully');
      router.push('/operator/vehicles');
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Add New Vehicle</h1>
        <p className="mt-1 text-neutral-600">
          Add a new vehicle to your fleet. You can add documents and photos after creating the vehicle.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Vehicle Type *
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData((p) => ({ ...p, vehicleType: e.target.value as any }))}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                required
              >
                {getVehicleTypeOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.info})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Registration Plate *"
              placeholder="AB12 CDE"
              value={formData.registrationPlate}
              onChange={(e) => setFormData((p) => ({ ...p, registrationPlate: e.target.value.toUpperCase() }))}
              required
            />

            <Input
              label="Make *"
              placeholder="Toyota"
              value={formData.make}
              onChange={(e) => setFormData((p) => ({ ...p, make: e.target.value }))}
              required
            />

            <Input
              label="Model *"
              placeholder="Prius"
              value={formData.model}
              onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
              required
            />

            <Input
              label="Year *"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => setFormData((p) => ({ ...p, year: parseInt(e.target.value) }))}
              required
            />

            <Input
              label="Color"
              placeholder="Black"
              value={formData.color || ''}
              onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
            />
          </div>
        </div>

        {/* Info Message */}
        <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
          <p className="text-sm text-primary-900">
            <strong>Note:</strong> You'll be able to upload vehicle documents (logbook, MOT, insurance)
            and photos after creating the vehicle by clicking "Edit" on the vehicles list.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Vehicle'}
          </Button>
        </div>
      </form>
    </div>
  );
}
