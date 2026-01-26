'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users,
  Plus,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Shield,
  Edit2,
  Trash2,
  AlertCircle,
  RefreshCw,
  X,
  Upload,
  User,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { FileUploadField } from '@/components/ui/FileUploadField';
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  getDocumentUploadUrl,
  uploadFileToS3,
  validateFile,
  getFileType,
  type FileType,
} from '@/lib/api/operator.api';
import type { Driver, CreateDriverDto, UpdateDriverDto } from '@/lib/types';
import { extractErrorMessage } from '@/lib/utils/error-handler';

// ============================================================================
// TYPES
// ============================================================================

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

const emptyFormData: DriverFormData = {
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
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DriversContent() {
  // State
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState<DriverFormData>(emptyFormData);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof DriverFormData, string>>>({});

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<Driver | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Image upload
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================

  const openAddForm = () => {
    setEditingDriver(null);
    setFormData(emptyFormData);
    setFormErrors({});
    setImagePreview(null);
    setShowForm(true);
  };

  const openEditForm = (driver: Driver) => {
    setEditingDriver(driver);
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
    setFormErrors({});
    setImagePreview(driver.profileImageUrl || null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingDriver(null);
    setFormData(emptyFormData);
    setFormErrors({});
    setImagePreview(null);
  };

  const handleInputChange = (field: keyof DriverFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof DriverFormData, string>> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload: CreateDriverDto | UpdateDriverDto = {
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

      if (editingDriver) {
        await updateDriver(editingDriver.id, payload);
        toast.success('Driver updated successfully');
      } else {
        await createDriver(payload as CreateDriverDto);
        toast.success('Driver added successfully');
      }

      closeForm();
      fetchDrivers();
    } catch (err) {
      const message = extractErrorMessage(err);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // IMAGE UPLOAD
  // ============================================================================

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

  // ============================================================================
  // DELETE HANDLER
  // ============================================================================

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      await deleteDriver(deleteConfirm.id);
      toast.success('Driver deleted successfully');
      setDeleteConfirm(null);
      fetchDrivers();
    } catch (err) {
      const message = extractErrorMessage(err);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isLicenseExpiringSoon = (expiryDate: string | null): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  };

  const isLicenseExpired = (expiryDate: string | null): boolean => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // ============================================================================
  // RENDER: LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ============================================================================
  // RENDER: ERROR STATE
  // ============================================================================

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">
            Unable to Load Drivers
          </h2>
          <p className="mt-1 text-neutral-600">{error}</p>
        </div>
        <Button onClick={fetchDrivers} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN CONTENT
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Drivers</h1>
          <p className="mt-1 text-neutral-600">
            Manage your drivers and their details
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchDrivers} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={openAddForm} variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {drivers.length === 0 && !showForm && (
        <EmptyState
          icon={Users}
          title="No Drivers Yet"
          description="Add your first driver to get started managing your team."
          action={
            <Button onClick={openAddForm} variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Driver
            </Button>
          }
        />
      )}

      {/* Driver Cards Grid */}
      {drivers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              onEdit={() => openEditForm(driver)}
              onDelete={() => setDeleteConfirm(driver)}
              formatDate={formatDate}
              isLicenseExpiringSoon={isLicenseExpiringSoon}
              isLicenseExpired={isLicenseExpired}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <DriverFormModal
          isEditing={!!editingDriver}
          formData={formData}
          formErrors={formErrors}
          saving={saving}
          uploadingImage={uploadingImage}
          imagePreview={imagePreview}
          fileInputRef={fileInputRef}
          onInputChange={handleInputChange}
          onImageSelect={handleImageSelect}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Driver"
        message={`Are you sure you want to delete ${deleteConfirm?.firstName} ${deleteConfirm?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}

// ============================================================================
// DRIVER CARD COMPONENT
// ============================================================================

interface DriverCardProps {
  driver: Driver;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (date: string | null) => string;
  isLicenseExpiringSoon: (date: string | null) => boolean;
  isLicenseExpired: (date: string | null) => boolean;
}

function DriverCard({
  driver,
  onEdit,
  onDelete,
  formatDate,
  isLicenseExpiringSoon,
  isLicenseExpired,
}: DriverCardProps) {
  const licenseExpired = isLicenseExpired(driver.phvLicenseExpiry);
  const licenseExpiringSoon = isLicenseExpiringSoon(driver.phvLicenseExpiry);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md">
      {/* Header with Avatar and Name */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-neutral-100">
          {driver.profileImageUrl ? (
            <img
              src={driver.profileImageUrl.startsWith('http')
                ? driver.profileImageUrl
                : `${process.env.NEXT_PUBLIC_S3_URL || ''}/${driver.profileImageUrl}`}
              alt={`${driver.firstName} ${driver.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-6 w-6 text-neutral-400" />
            </div>
          )}
        </div>

        {/* Name and Status */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-neutral-900">
              {driver.firstName} {driver.lastName}
            </h3>
            <StatusBadge variant={driver.isActive ? 'success' : 'default'}>
              {driver.isActive ? 'Active' : 'Inactive'}
            </StatusBadge>
          </div>

          {/* Contact Info */}
          <div className="mt-1 space-y-0.5">
            <div className="flex items-center gap-1.5 text-sm text-neutral-600">
              <Phone className="h-3.5 w-3.5" />
              <span className="truncate">{driver.phoneNumber}</span>
            </div>
            {driver.email && (
              <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{driver.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* License Info */}
      <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
        {driver.phvLicenseNumber && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-neutral-500">
              <CreditCard className="h-3.5 w-3.5" />
              PHV License
            </span>
            <span className="font-medium text-neutral-900">
              {driver.phvLicenseNumber}
            </span>
          </div>
        )}

        {driver.phvLicenseExpiry && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-neutral-500">
              <Calendar className="h-3.5 w-3.5" />
              Expires
            </span>
            <span
              className={`font-medium ${
                licenseExpired
                  ? 'text-error-600'
                  : licenseExpiringSoon
                    ? 'text-warning-600'
                    : 'text-neutral-900'
              }`}
            >
              {formatDate(driver.phvLicenseExpiry)}
              {licenseExpired && ' (Expired)'}
              {!licenseExpired && licenseExpiringSoon && ' (Expiring Soon)'}
            </span>
          </div>
        )}

        {driver.badgeNumber && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-neutral-500">
              <Shield className="h-3.5 w-3.5" />
              Badge
            </span>
            <span className="font-medium text-neutral-900">
              {driver.badgeNumber}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4">
        <Button onClick={onEdit} variant="outline" size="sm" className="flex-1">
          <Edit2 className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          onClick={onDelete}
          variant="outline"
          size="sm"
          className="flex-1 text-error-600 hover:bg-error-50 hover:border-error-200"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// DRIVER FORM MODAL COMPONENT
// ============================================================================

interface DriverFormModalProps {
  isEditing: boolean;
  formData: DriverFormData;
  formErrors: Partial<Record<keyof DriverFormData, string>>;
  saving: boolean;
  uploadingImage: boolean;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (field: keyof DriverFormData, value: string) => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function DriverFormModal({
  isEditing,
  formData,
  formErrors,
  saving,
  uploadingImage,
  imagePreview,
  fileInputRef,
  onInputChange,
  onImageSelect,
  onSubmit,
  onClose,
}: DriverFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-neutral-900">
            {isEditing ? 'Edit Driver' : 'Add New Driver'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-6 p-6">
          {/* Profile Image Upload */}
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
                onChange={onImageSelect}
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

          {/* Basic Information */}
          <div>
            <h3 className="mb-3 font-medium text-neutral-900">
              Basic Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                error={formErrors.firstName}
                placeholder="John"
              />
              <Input
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                error={formErrors.lastName}
                placeholder="Smith"
              />
              <Input
                label="Phone Number *"
                value={formData.phoneNumber}
                onChange={(e) => onInputChange('phoneNumber', e.target.value)}
                error={formErrors.phoneNumber}
                placeholder="+44 7123 456789"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                error={formErrors.email}
                placeholder="john@example.com"
              />
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
              />
              <Input
                label="National Insurance No."
                value={formData.nationalInsuranceNo}
                onChange={(e) =>
                  onInputChange('nationalInsuranceNo', e.target.value)
                }
                placeholder="AB123456C"
              />
            </div>
          </div>

          {/* Passport Information */}
          <div>
            <h3 className="mb-3 font-medium text-neutral-900">
              Passport
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FileUploadField
                label="Passport Document"
                value={formData.passportUrl}
                onChange={(key) => onInputChange('passportUrl', key)}
                accept="document"
                description="Upload passport (PDF, max 5MB)"
              />
              <Input
                label="Passport Expiry"
                type="date"
                value={formData.passportExpiry}
                onChange={(e) => onInputChange('passportExpiry', e.target.value)}
              />
            </div>
          </div>

          {/* Driving License Information */}
          <div>
            <h3 className="mb-3 font-medium text-neutral-900">
              Driving License
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Driving License Number"
                value={formData.drivingLicenseNumber}
                onChange={(e) =>
                  onInputChange('drivingLicenseNumber', e.target.value)
                }
                placeholder="SMITH906152JK9AB"
              />
              <Input
                label="Driving License Expiry"
                type="date"
                value={formData.drivingLicenseExpiry}
                onChange={(e) =>
                  onInputChange('drivingLicenseExpiry', e.target.value)
                }
              />
              <FileUploadField
                label="License Front Photo"
                value={formData.drivingLicenseFrontUrl}
                onChange={(key) => onInputChange('drivingLicenseFrontUrl', key)}
                accept="image"
                description="Upload front of license (JPG/PNG, max 5MB)"
              />
              <FileUploadField
                label="License Back Photo"
                value={formData.drivingLicenseBackUrl}
                onChange={(key) => onInputChange('drivingLicenseBackUrl', key)}
                accept="image"
                description="Upload back of license (JPG/PNG, max 5MB)"
              />
            </div>
          </div>

          {/* National Insurance */}
          <div>
            <h3 className="mb-3 font-medium text-neutral-900">
              National Insurance
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FileUploadField
                label="NI Document"
                value={formData.nationalInsuranceDocUrl}
                onChange={(key) => onInputChange('nationalInsuranceDocUrl', key)}
                accept="document"
                description="Upload NI document (PDF, max 5MB)"
              />
            </div>
          </div>

          {/* Taxi Certification */}
          <div>
            <h3 className="mb-3 font-medium text-neutral-900">
              Taxi Certification
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FileUploadField
                label="Certification Document"
                value={formData.taxiCertificationUrl}
                onChange={(key) => onInputChange('taxiCertificationUrl', key)}
                accept="document"
                description="Upload certification (PDF, max 5MB)"
              />
              <Input
                label="Certification Expiry"
                type="date"
                value={formData.taxiCertificationExpiry}
                onChange={(e) =>
                  onInputChange('taxiCertificationExpiry', e.target.value)
                }
              />
              <FileUploadField
                label="Taxi Badge Photo"
                value={formData.taxiBadgePhotoUrl}
                onChange={(key) => onInputChange('taxiBadgePhotoUrl', key)}
                accept="image"
                description="Upload badge photo (JPG/PNG, max 5MB)"
              />
              <Input
                label="Taxi Badge Expiry"
                type="date"
                value={formData.taxiBadgeExpiry}
                onChange={(e) => onInputChange('taxiBadgeExpiry', e.target.value)}
              />
            </div>
          </div>

          {/* PHV License Information */}
          <div>
            <h3 className="mb-3 font-medium text-neutral-900">
              PHV License
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="PHV License Number"
                value={formData.phvLicenseNumber}
                onChange={(e) =>
                  onInputChange('phvLicenseNumber', e.target.value)
                }
                placeholder="PHV123456"
              />
              <Input
                label="PHV License Expiry"
                type="date"
                value={formData.phvLicenseExpiry}
                onChange={(e) =>
                  onInputChange('phvLicenseExpiry', e.target.value)
                }
              />
              <Input
                label="Issuing Council"
                value={formData.issuingCouncil}
                onChange={(e) =>
                  onInputChange('issuingCouncil', e.target.value)
                }
                placeholder="Transport for London"
              />
              <Input
                label="Badge Number"
                value={formData.badgeNumber}
                onChange={(e) => onInputChange('badgeNumber', e.target.value)}
                placeholder="B123456"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-neutral-200 bg-white px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Driver' : 'Add Driver'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}