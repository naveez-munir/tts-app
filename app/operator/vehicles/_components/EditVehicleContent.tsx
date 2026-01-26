'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUploadField } from '@/components/ui/FileUploadField';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import {
  getVehicle,
  updateVehicle,
  getVehiclePhotos,
  updateVehiclePhotos,
} from '@/lib/api/operator.api';
import type { Vehicle, VehiclePhoto, UpdateVehicleDto } from '@/lib/types';
import { VehiclePhotoType } from '@/lib/types/enums';
import { extractErrorMessage } from '@/lib/utils/error-handler';
import { getVehicleTypeOptions, getVehicleTypeLabel } from '@/lib/utils/vehicle-type';

interface EditVehicleContentProps {
  vehicleId: string;
}

export default function EditVehicleContent({ vehicleId }: EditVehicleContentProps) {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPhotos, setSavingPhotos] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [photos, setPhotos] = useState<VehiclePhoto[]>([]);

  const [formData, setFormData] = useState<UpdateVehicleDto>({
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch single vehicle by ID
        const foundVehicle = await getVehicle(vehicleId);

        setVehicle(foundVehicle);
        setFormData({
          vehicleType: foundVehicle.vehicleType,
          registrationPlate: foundVehicle.registrationPlate,
          make: foundVehicle.make,
          model: foundVehicle.model,
          year: foundVehicle.year,
          color: foundVehicle.color || '',
          logbookUrl: foundVehicle.logbookUrl || '',
          motCertificateUrl: foundVehicle.motCertificateUrl || '',
          motExpiryDate: foundVehicle.motExpiryDate ? foundVehicle.motExpiryDate.split('T')[0] : '',
          insuranceDocumentUrl: foundVehicle.insuranceDocumentUrl || '',
          insuranceExpiryDate: foundVehicle.insuranceExpiryDate
            ? foundVehicle.insuranceExpiryDate.split('T')[0]
            : '',
          hirePermissionLetterUrl: foundVehicle.hirePermissionLetterUrl || '',
        });

        // Fetch photos
        const vehiclePhotos = await getVehiclePhotos(vehicleId);
        setPhotos(vehiclePhotos);
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        toast.error(errorMessage);
        router.push('/operator/vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

      await updateVehicle(vehicleId, payload);
      toast.success('Vehicle updated successfully');
      router.push('/operator/vehicles');
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePhoto = async (photoType: VehiclePhotoType, photoUrl: string) => {
    setSavingPhotos(true);
    try {
      const existingPhotos = photos.filter((p) => p.photoType !== photoType);
      const updatedPhotos = photoUrl
        ? [
            ...existingPhotos.map((p) => ({ photoType: p.photoType, photoUrl: p.photoUrl })),
            { photoType, photoUrl },
          ]
        : existingPhotos.map((p) => ({ photoType: p.photoType, photoUrl: p.photoUrl }));

      const result = await updateVehiclePhotos(vehicleId, updatedPhotos);
      setPhotos(result);
      toast.success('Photo updated');
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setSavingPhotos(false);
    }
  };

  const getPhotoUrl = (photoType: VehiclePhotoType): string => {
    const photo = photos.find((p) => p.photoType === photoType);
    return photo?.photoUrl || '';
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={() => router.back()} variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Edit Vehicle - {vehicle?.registrationPlate}
        </h1>
        <p className="mt-1 text-neutral-600">
          Update vehicle details, documents, and photos
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
              onChange={(e) =>
                setFormData((p) => ({ ...p, registrationPlate: e.target.value.toUpperCase() }))
              }
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

        {/* Vehicle Documents */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Vehicle Documents</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <FileUploadField
              label="Logbook (V5C)"
              value={formData.logbookUrl || ''}
              onChange={(key) => setFormData((p) => ({ ...p, logbookUrl: key }))}
              accept="document"
              description="Upload logbook (PDF, max 5MB)"
            />

            <div className="space-y-4">
              <FileUploadField
                label="MOT Certificate"
                value={formData.motCertificateUrl || ''}
                onChange={(key) => setFormData((p) => ({ ...p, motCertificateUrl: key }))}
                accept="document"
                description="Upload MOT certificate (PDF)"
              />
              <Input
                label="MOT Expiry Date"
                type="date"
                value={formData.motExpiryDate || ''}
                onChange={(e) => setFormData((p) => ({ ...p, motExpiryDate: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <FileUploadField
                label="Insurance Document"
                value={formData.insuranceDocumentUrl || ''}
                onChange={(key) => setFormData((p) => ({ ...p, insuranceDocumentUrl: key }))}
                accept="document"
                description="Upload insurance (PDF)"
              />
              <Input
                label="Insurance Expiry Date"
                type="date"
                value={formData.insuranceExpiryDate || ''}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, insuranceExpiryDate: e.target.value }))
                }
              />
            </div>

            <FileUploadField
              label="Hire Permission Letter"
              value={formData.hirePermissionLetterUrl || ''}
              onChange={(key) => setFormData((p) => ({ ...p, hirePermissionLetterUrl: key }))}
              accept="document"
              description="Upload letter (PDF, max 5MB)"
            />
          </div>
        </div>

        {/* Vehicle Photos */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Vehicle Photos</h2>
          <p className="mb-6 text-sm text-neutral-600">
            Upload photos of your vehicle. Photos are saved separately from vehicle details.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                'FRONT',
                'BACK',
                'DRIVER_SIDE',
                'FRONT_SIDE',
                'DASHBOARD',
                'REAR_BOOT',
              ] as VehiclePhotoType[]
            ).map((photoType) => (
              <FileUploadField
                key={photoType}
                label={photoType.replace(/_/g, ' ')}
                value={getPhotoUrl(photoType)}
                onChange={(key) => handleUpdatePhoto(photoType, key)}
                accept="image"
                disabled={savingPhotos}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons - After Photos */}
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={() => router.back()} variant="outline" disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
