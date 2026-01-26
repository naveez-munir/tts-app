'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FileUploadField } from '@/components/ui/FileUploadField';
import {
  getDriver,
  updateDriver,
  getDocumentUploadUrl,
  uploadFileToS3,
  validateFile,
  getFileType,
  type FileType,
} from '@/lib/api/operator.api';
import type { UpdateDriverDto, Driver } from '@/lib/types';
import { extractErrorMessage } from '@/lib/utils/error-handler';

interface DriverFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  profileImageUrl: string;
  dateOfBirth: string;
  // Passport
  passportUrl: string;
  passportExpiry: string;
  // Driving License
  drivingLicenseNumber: string;
  drivingLicenseFrontUrl: string;
  drivingLicenseBackUrl: string;
  drivingLicenseExpiry: string;
  // National Insurance
  nationalInsuranceNo: string;
  nationalInsuranceDocUrl: string;
  // Taxi Certification
  taxiCertificationUrl: string;
  taxiCertificationExpiry: string;
  // Taxi Badge
  taxiBadgePhotoUrl: string;
  taxiBadgeExpiry: string;
  // PHV License
  phvLicenseNumber: string;
  phvLicenseExpiry: string;
  issuingCouncil: string;
  badgeNumber: string;
}

interface EditDriverContentProps {
  driverId: string;
}

export default function EditDriverContent({ driverId }: EditDriverContentProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<DriverFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    profileImageUrl: '',
    dateOfBirth: '',
    // Passport
    passportUrl: '',
    passportExpiry: '',
    // Driving License
    drivingLicenseNumber: '',
    drivingLicenseFrontUrl: '',
    drivingLicenseBackUrl: '',
    drivingLicenseExpiry: '',
    // National Insurance
    nationalInsuranceNo: '',
    nationalInsuranceDocUrl: '',
    // Taxi Certification
    taxiCertificationUrl: '',
    taxiCertificationExpiry: '',
    // Taxi Badge
    taxiBadgePhotoUrl: '',
    taxiBadgeExpiry: '',
    // PHV License
    phvLicenseNumber: '',
    phvLicenseExpiry: '',
    issuingCouncil: '',
    badgeNumber: '',
  });

  // Fetch driver data
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const driver = await getDriver(driverId);

        setFormData({
          firstName: driver.firstName,
          lastName: driver.lastName,
          phoneNumber: driver.phoneNumber,
          email: driver.email || '',
          profileImageUrl: driver.profileImageUrl || '',
          dateOfBirth: driver.dateOfBirth ? driver.dateOfBirth.split('T')[0] : '',
          // Passport
          passportUrl: driver.passportUrl || '',
          passportExpiry: driver.passportExpiry ? driver.passportExpiry.split('T')[0] : '',
          // Driving License
          drivingLicenseNumber: driver.drivingLicenseNumber || '',
          drivingLicenseFrontUrl: driver.drivingLicenseFrontUrl || '',
          drivingLicenseBackUrl: driver.drivingLicenseBackUrl || '',
          drivingLicenseExpiry: driver.drivingLicenseExpiry ? driver.drivingLicenseExpiry.split('T')[0] : '',
          // National Insurance
          nationalInsuranceNo: driver.nationalInsuranceNo || '',
          nationalInsuranceDocUrl: driver.nationalInsuranceDocUrl || '',
          // Taxi Certification
          taxiCertificationUrl: driver.taxiCertificationUrl || '',
          taxiCertificationExpiry: driver.taxiCertificationExpiry ? driver.taxiCertificationExpiry.split('T')[0] : '',
          // Taxi Badge
          taxiBadgePhotoUrl: driver.taxiBadgePhotoUrl || '',
          taxiBadgeExpiry: driver.taxiBadgeExpiry ? driver.taxiBadgeExpiry.split('T')[0] : '',
          // PHV License
          phvLicenseNumber: driver.phvLicenseNumber || '',
          phvLicenseExpiry: driver.phvLicenseExpiry ? driver.phvLicenseExpiry.split('T')[0] : '',
          issuingCouncil: driver.issuingCouncil || '',
          badgeNumber: driver.badgeNumber || '',
        });

        setImagePreview(driver.profileImageUrl || null);
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        toast.error(errorMessage);
        router.push('/operator/drivers');
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [driverId, router, toast]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    // Only allow images
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG or PNG)');
      return;
    }

    const fileType = getFileType(file.name);
    if (!fileType || !['jpg', 'jpeg', 'png'].includes(fileType)) {
      toast.error('Please select a JPG or PNG image');
      return;
    }

    setUploadingImage(true);
    try {
      // Get presigned URL
      const { uploadUrl, key } = await getDocumentUploadUrl(
        `driver-photo-${Date.now()}`,
        fileType as FileType,
        'other'
      );

      // Upload to S3
      await uploadFileToS3(uploadUrl, file);

      // Update form data with the S3 key
      setFormData((prev) => ({ ...prev, profileImageUrl: key }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast.success('Image uploaded successfully');
    } catch (err) {
      const message = extractErrorMessage(err);
      toast.error(`Upload failed: ${message}`);
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      toast.warning('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateDriverDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim() || undefined,
        profileImageUrl: formData.profileImageUrl || undefined,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : undefined,
        // Passport
        passportUrl: formData.passportUrl || undefined,
        passportExpiry: formData.passportExpiry
          ? new Date(formData.passportExpiry).toISOString()
          : undefined,
        // Driving License
        drivingLicenseNumber: formData.drivingLicenseNumber.trim() || undefined,
        drivingLicenseFrontUrl: formData.drivingLicenseFrontUrl || undefined,
        drivingLicenseBackUrl: formData.drivingLicenseBackUrl || undefined,
        drivingLicenseExpiry: formData.drivingLicenseExpiry
          ? new Date(formData.drivingLicenseExpiry).toISOString()
          : undefined,
        // National Insurance
        nationalInsuranceNo: formData.nationalInsuranceNo.trim() || undefined,
        nationalInsuranceDocUrl: formData.nationalInsuranceDocUrl || undefined,
        // Taxi Certification
        taxiCertificationUrl: formData.taxiCertificationUrl || undefined,
        taxiCertificationExpiry: formData.taxiCertificationExpiry
          ? new Date(formData.taxiCertificationExpiry).toISOString()
          : undefined,
        // Taxi Badge
        taxiBadgePhotoUrl: formData.taxiBadgePhotoUrl || undefined,
        taxiBadgeExpiry: formData.taxiBadgeExpiry
          ? new Date(formData.taxiBadgeExpiry).toISOString()
          : undefined,
        // PHV License
        phvLicenseNumber: formData.phvLicenseNumber.trim() || undefined,
        phvLicenseExpiry: formData.phvLicenseExpiry
          ? new Date(formData.phvLicenseExpiry).toISOString()
          : undefined,
        issuingCouncil: formData.issuingCouncil.trim() || undefined,
        badgeNumber: formData.badgeNumber.trim() || undefined,
      };

      await updateDriver(driverId, payload);
      toast.success('Driver updated successfully');
      router.push('/operator/drivers');
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-2xl font-bold text-neutral-900">Edit Driver</h1>
        <p className="mt-1 text-neutral-600">
          Update driver information and documents.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Profile Photo</h2>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-neutral-100">
              {imagePreview ? (
                <img
                  src={imagePreview.startsWith('data:') || imagePreview.startsWith('http')
                    ? imagePreview
                    : `${process.env.NEXT_PUBLIC_S3_URL || ''}/${imagePreview}`}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-10 w-10 text-neutral-400" />
                </div>
              )}
              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploadingImage ? 'Uploading...' : 'Upload Photo'}
              </Button>
              <p className="mt-1 text-xs text-neutral-500">
                JPG or PNG, max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Name *"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
              required
            />

            <Input
              label="Last Name *"
              placeholder="Smith"
              value={formData.lastName}
              onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
              required
            />

            <Input
              label="Phone Number *"
              placeholder="+44 7123 456789"
              value={formData.phoneNumber}
              onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))}
            />

            <Input
              label="National Insurance No."
              placeholder="AB123456C"
              value={formData.nationalInsuranceNo}
              onChange={(e) => setFormData((p) => ({ ...p, nationalInsuranceNo: e.target.value.toUpperCase() }))}
            />
          </div>
        </div>

        {/* Passport Information */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Passport</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FileUploadField
              label="Passport Document"
              value={formData.passportUrl}
              onChange={(key) => setFormData((p) => ({ ...p, passportUrl: key }))}
              accept="document"
              description="Upload passport (PDF, max 5MB)"
            />
            <Input
              label="Passport Expiry"
              type="date"
              value={formData.passportExpiry}
              onChange={(e) => setFormData((p) => ({ ...p, passportExpiry: e.target.value }))}
            />
          </div>
        </div>

        {/* Driving License Information */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Driving License</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Driving License Number"
              placeholder="SMITH906152JK9AB"
              value={formData.drivingLicenseNumber}
              onChange={(e) => setFormData((p) => ({ ...p, drivingLicenseNumber: e.target.value.toUpperCase() }))}
            />
            <Input
              label="Driving License Expiry"
              type="date"
              value={formData.drivingLicenseExpiry}
              onChange={(e) => setFormData((p) => ({ ...p, drivingLicenseExpiry: e.target.value }))}
            />
            <FileUploadField
              label="License Front Photo"
              value={formData.drivingLicenseFrontUrl}
              onChange={(key) => setFormData((p) => ({ ...p, drivingLicenseFrontUrl: key }))}
              accept="image"
              description="Upload front of license (JPG/PNG, max 5MB)"
            />
            <FileUploadField
              label="License Back Photo"
              value={formData.drivingLicenseBackUrl}
              onChange={(key) => setFormData((p) => ({ ...p, drivingLicenseBackUrl: key }))}
              accept="image"
              description="Upload back of license (JPG/PNG, max 5MB)"
            />
          </div>
        </div>

        {/* National Insurance */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">National Insurance</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FileUploadField
              label="NI Document"
              value={formData.nationalInsuranceDocUrl}
              onChange={(key) => setFormData((p) => ({ ...p, nationalInsuranceDocUrl: key }))}
              accept="document"
              description="Upload NI document (PDF, max 5MB)"
            />
          </div>
        </div>

        {/* Taxi Certification */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">Taxi Certification</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FileUploadField
              label="Certification Document"
              value={formData.taxiCertificationUrl}
              onChange={(key) => setFormData((p) => ({ ...p, taxiCertificationUrl: key }))}
              accept="document"
              description="Upload certification (PDF, max 5MB)"
            />
            <Input
              label="Certification Expiry"
              type="date"
              value={formData.taxiCertificationExpiry}
              onChange={(e) => setFormData((p) => ({ ...p, taxiCertificationExpiry: e.target.value }))}
            />
            <FileUploadField
              label="Taxi Badge Photo"
              value={formData.taxiBadgePhotoUrl}
              onChange={(key) => setFormData((p) => ({ ...p, taxiBadgePhotoUrl: key }))}
              accept="image"
              description="Upload badge photo (JPG/PNG, max 5MB)"
            />
            <Input
              label="Taxi Badge Expiry"
              type="date"
              value={formData.taxiBadgeExpiry}
              onChange={(e) => setFormData((p) => ({ ...p, taxiBadgeExpiry: e.target.value }))}
            />
          </div>
        </div>

        {/* PHV License Information */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">PHV License</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="PHV License Number"
              placeholder="PHV123456"
              value={formData.phvLicenseNumber}
              onChange={(e) => setFormData((p) => ({ ...p, phvLicenseNumber: e.target.value }))}
            />
            <Input
              label="PHV License Expiry"
              type="date"
              value={formData.phvLicenseExpiry}
              onChange={(e) => setFormData((p) => ({ ...p, phvLicenseExpiry: e.target.value }))}
            />
            <Input
              label="Issuing Council"
              placeholder="Transport for London"
              value={formData.issuingCouncil}
              onChange={(e) => setFormData((p) => ({ ...p, issuingCouncil: e.target.value }))}
            />
            <Input
              label="Badge Number"
              placeholder="B123456"
              value={formData.badgeNumber}
              onChange={(e) => setFormData((p) => ({ ...p, badgeNumber: e.target.value }))}
            />
          </div>
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
            {saving ? 'Updating...' : 'Update Driver'}
          </Button>
        </div>
      </form>
    </div>
  );
}
