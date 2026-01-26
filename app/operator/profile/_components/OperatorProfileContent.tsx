'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  MapPin,
  Car,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Clock,
  CreditCard,
  Upload,
  Shield,
  Truck,
  Edit2,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DocumentUpload } from '@/components/ui/DocumentUpload';
import { useToast } from '@/components/ui/Toast';
import { getOperatorDashboard } from '@/lib/api';
import {
  updateBankDetails,
  updateOperatorProfile,
  getOperatorDocuments,
  type OperatorDocument,
} from '@/lib/api/operator.api';
import { getContextualErrorMessage, extractErrorMessage } from '@/lib/utils/error-handler';

interface OperatorProfileData {
  companyName: string;
  registrationNumber: string;
  vatNumber?: string;
  contactName: string;
  email: string;
  phone: string;
  approvalStatus: string;
  serviceAreas: string[];
  vehicleTypes: string[];
  // New fields
  operatingLicenseNumber?: string;
  councilRegistration?: string;
  businessAddress?: string;
  businessPostcode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  fleetSize?: number;
  reputationScore?: string;
  totalJobs?: number;
  completedJobs?: number;
  bankDetails?: {
    accountName: string;
    sortCode: string;
    accountNumber: string;
  };
}

export default function OperatorProfileContent() {
  const [profile, setProfile] = useState<OperatorProfileData | null>(null);
  const [operatorId, setOperatorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Bank details editing
  const [editingBank, setEditingBank] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    sortCode: '',
    accountNumber: '',
  });
  const [savingBank, setSavingBank] = useState(false);

  // Profile editing state
  const [editingSection, setEditingSection] = useState<'company' | 'business' | 'emergency' | null>(null);
  const [editFormData, setEditFormData] = useState({
    companyName: '',
    vatNumber: '',
    operatingLicenseNumber: '',
    councilRegistration: '',
    businessAddress: '',
    businessPostcode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    fleetSize: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Document state
  const [documents, setDocuments] = useState<OperatorDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoadingDocuments(true);
    try {
      const docs = await getOperatorDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  // Backend returns enum values: OPERATING_LICENSE, INSURANCE, OTHER
  const licenseDoc = documents.find((d) => d.documentType === 'OPERATING_LICENSE');
  const insuranceDoc = documents.find((d) => d.documentType === 'INSURANCE');

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboard = await getOperatorDashboard();
      const profileData = (dashboard as any).profile || dashboard;

      // Extract postcodes from service areas (API returns objects with {id, operatorId, postcode, createdAt})
      const serviceAreas = (profileData.serviceAreas || []).map((area: any) =>
        typeof area === 'string' ? area : area.postcode
      );

      // Extract vehicle types (API may return objects or strings)
      const vehicleTypes = (profileData.vehicleTypes || profileData.vehicles || []).map((v: any) =>
        typeof v === 'string' ? v : v.vehicleType || v.type
      );

      // Store operator ID for future API calls
      setOperatorId(profileData.id);

      const newProfile: OperatorProfileData = {
        companyName: profileData.companyName || 'N/A',
        registrationNumber: profileData.registrationNumber || 'N/A',
        vatNumber: profileData.vatNumber || undefined,
        contactName: profileData.user?.firstName
          ? `${profileData.user.firstName} ${profileData.user.lastName || ''}`.trim()
          : 'N/A',
        email: profileData.user?.email || 'N/A',
        phone: profileData.user?.phoneNumber || 'N/A',
        approvalStatus: profileData.approvalStatus || 'PENDING',
        serviceAreas,
        vehicleTypes,
        // New fields
        operatingLicenseNumber: profileData.operatingLicenseNumber || undefined,
        councilRegistration: profileData.councilRegistration || undefined,
        businessAddress: profileData.businessAddress || undefined,
        businessPostcode: profileData.businessPostcode || undefined,
        emergencyContactName: profileData.emergencyContactName || undefined,
        emergencyContactPhone: profileData.emergencyContactPhone || undefined,
        fleetSize: profileData.fleetSize || undefined,
        reputationScore: profileData.reputationScore || '5',
        totalJobs: profileData.totalJobs || 0,
        completedJobs: profileData.completedJobs || 0,
        bankDetails: profileData.bankAccountName ? {
          accountName: profileData.bankAccountName,
          sortCode: profileData.bankSortCode || '',
          accountNumber: profileData.bankAccountNumber || '',
        } : undefined,
      };

      setProfile(newProfile);

      // Initialize edit form data
      setEditFormData({
        companyName: profileData.companyName || '',
        vatNumber: profileData.vatNumber || '',
        operatingLicenseNumber: profileData.operatingLicenseNumber || '',
        councilRegistration: profileData.councilRegistration || '',
        businessAddress: profileData.businessAddress || '',
        businessPostcode: profileData.businessPostcode || '',
        emergencyContactName: profileData.emergencyContactName || '',
        emergencyContactPhone: profileData.emergencyContactPhone || '',
        fleetSize: profileData.fleetSize ? String(profileData.fleetSize) : '',
      });

      if (profileData.bankAccountName) {
        setBankDetails({
          accountName: profileData.bankAccountName,
          sortCode: profileData.bankSortCode || '',
          accountNumber: profileData.bankAccountNumber || '',
        });
      }
    } catch (err: unknown) {
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchDocuments();
  }, [fetchDocuments]);

  const handleSaveBankDetails = async () => {
    if (!bankDetails.accountName || !bankDetails.sortCode || !bankDetails.accountNumber) {
      toast.warning('Please fill in all bank details');
      return;
    }
    setSavingBank(true);
    try {
      await updateBankDetails({
        bankAccountName: bankDetails.accountName,
        bankSortCode: bankDetails.sortCode.replace(/[-\s]/g, ''), // Strip formatting
        bankAccountNumber: bankDetails.accountNumber,
      });
      setProfile((prev) => prev ? { ...prev, bankDetails } : null);
      setEditingBank(false);
      toast.success('Bank details saved successfully');
    } catch (err: unknown) {
      console.error('Failed to save bank details:', err);
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setSavingBank(false);
    }
  };

  const handleSaveProfile = async (section: 'company' | 'business' | 'emergency') => {
    setSavingProfile(true);
    try {
      const updateData: Record<string, any> = {};

      if (section === 'company') {
        updateData.companyName = editFormData.companyName || undefined;
        updateData.vatNumber = editFormData.vatNumber || undefined;
        updateData.operatingLicenseNumber = editFormData.operatingLicenseNumber || undefined;
        updateData.councilRegistration = editFormData.councilRegistration || undefined;
      } else if (section === 'business') {
        updateData.businessAddress = editFormData.businessAddress || undefined;
        updateData.businessPostcode = editFormData.businessPostcode || undefined;
        updateData.fleetSize = editFormData.fleetSize ? parseInt(editFormData.fleetSize, 10) : undefined;
      } else if (section === 'emergency') {
        updateData.emergencyContactName = editFormData.emergencyContactName || undefined;
        updateData.emergencyContactPhone = editFormData.emergencyContactPhone || undefined;
      }

      await updateOperatorProfile(updateData);

      // Update local state
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...(section === 'company' && {
            companyName: editFormData.companyName || prev.companyName,
            vatNumber: editFormData.vatNumber || undefined,
            operatingLicenseNumber: editFormData.operatingLicenseNumber || undefined,
            councilRegistration: editFormData.councilRegistration || undefined,
          }),
          ...(section === 'business' && {
            businessAddress: editFormData.businessAddress || undefined,
            businessPostcode: editFormData.businessPostcode || undefined,
            fleetSize: editFormData.fleetSize ? parseInt(editFormData.fleetSize, 10) : undefined,
          }),
          ...(section === 'emergency' && {
            emergencyContactName: editFormData.emergencyContactName || undefined,
            emergencyContactPhone: editFormData.emergencyContactPhone || undefined,
          }),
        };
      });
      setEditingSection(null);
      toast.success('Profile updated successfully');
    } catch (err: unknown) {
      console.error('Failed to save profile:', err);
      const errorMessage = extractErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  const startEditing = (section: 'company' | 'business' | 'emergency') => {
    if (profile) {
      setEditFormData({
        companyName: profile.companyName || '',
        vatNumber: profile.vatNumber || '',
        operatingLicenseNumber: profile.operatingLicenseNumber || '',
        councilRegistration: profile.councilRegistration || '',
        businessAddress: profile.businessAddress || '',
        businessPostcode: profile.businessPostcode || '',
        emergencyContactName: profile.emergencyContactName || '',
        emergencyContactPhone: profile.emergencyContactPhone || '',
        fleetSize: profile.fleetSize ? String(profile.fleetSize) : '',
      });
    }
    setEditingSection(section);
  };

  const getApprovalIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'REJECTED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-warning-500" />;
    }
  };

  const getApprovalVariant = (status: string): 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Profile</h2>
          <p className="mt-1 text-neutral-600">{error || 'Something went wrong'}</p>
        </div>
        <Button onClick={fetchProfile} variant="primary">
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
          <h1 className="text-2xl font-bold text-neutral-900">Operator Profile</h1>
          <p className="mt-1 text-neutral-600">Manage your company information</p>
        </div>
        <StatusBadge variant={getApprovalVariant(profile.approvalStatus)}>
          {getApprovalIcon(profile.approvalStatus)}
          <span className="ml-1">{profile.approvalStatus}</span>
        </StatusBadge>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{profile.reputationScore || '5.0'}</p>
          <p className="text-sm text-neutral-500">Reputation Score</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{profile.totalJobs || 0}</p>
          <p className="text-sm text-neutral-500">Total Jobs</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-success-600">{profile.completedJobs || 0}</p>
          <p className="text-sm text-neutral-500">Completed Jobs</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-accent-600">{profile.fleetSize || 'N/A'}</p>
          <p className="text-sm text-neutral-500">Fleet Size</p>
        </div>
      </div>

      {/* Company Information */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <Building2 className="h-5 w-5 text-primary-600" />
            Company Information
          </h2>
          {editingSection !== 'company' && (
            <Button onClick={() => startEditing('company')} variant="outline" size="sm">
              <Edit2 className="mr-1 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === 'company' ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Company Name"
                value={editFormData.companyName}
                onChange={(e) => setEditFormData((p) => ({ ...p, companyName: e.target.value }))}
              />
              <div>
                <Input
                  label="Registration Number"
                  value={profile.registrationNumber}
                  disabled
                />
                <p className="mt-1 text-xs text-neutral-500">Cannot be changed</p>
              </div>
              <Input
                label="VAT Number"
                placeholder="Optional"
                value={editFormData.vatNumber}
                onChange={(e) => setEditFormData((p) => ({ ...p, vatNumber: e.target.value }))}
              />
              <Input
                label="Operating License Number"
                placeholder="PHV License Number"
                value={editFormData.operatingLicenseNumber}
                onChange={(e) => setEditFormData((p) => ({ ...p, operatingLicenseNumber: e.target.value }))}
              />
              <Input
                label="Council Registration"
                placeholder="Council registration number"
                value={editFormData.councilRegistration}
                onChange={(e) => setEditFormData((p) => ({ ...p, councilRegistration: e.target.value }))}
              />
            </div>

            {/* Account Details - Read Only */}
            <div className="border-t border-neutral-200 pt-4">
              <p className="mb-3 text-sm font-medium text-neutral-700">
                Account Details <span className="font-normal text-neutral-500">(Contact support to update)</span>
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Input
                    label="Contact Name"
                    value={profile.contactName}
                    disabled
                  />
                </div>
                <div>
                  <Input
                    label="Email"
                    value={profile.email}
                    disabled
                  />
                </div>
                <div>
                  <Input
                    label="Phone"
                    value={profile.phone}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={() => setEditingSection(null)} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => handleSaveProfile('company')} disabled={savingProfile} variant="primary">
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={Building2} label="Company Name" value={profile.companyName} />
            <InfoItem icon={FileText} label="Registration Number" value={profile.registrationNumber} />
            <InfoItem icon={FileText} label="VAT Number" value={profile.vatNumber || 'Not provided'} />
            <InfoItem icon={Shield} label="Operating License Number" value={profile.operatingLicenseNumber || 'Not provided'} />
            <InfoItem icon={FileText} label="Council Registration" value={profile.councilRegistration || 'Not provided'} />
            <InfoItem icon={User} label="Contact Name" value={profile.contactName} />
            <InfoItem icon={Mail} label="Email" value={profile.email} />
            <InfoItem icon={Phone} label="Phone" value={profile.phone} />
          </div>
        )}
      </div>

      {/* Business Details */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <MapPin className="h-5 w-5 text-accent-600" />
            Business Details
          </h2>
          {editingSection !== 'business' && (
            <Button onClick={() => startEditing('business')} variant="outline" size="sm">
              <Edit2 className="mr-1 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === 'business' ? (
          <div className="space-y-4">
            <Input
              label="Business Address"
              placeholder="Full business address"
              value={editFormData.businessAddress}
              onChange={(e) => setEditFormData((p) => ({ ...p, businessAddress: e.target.value }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Business Postcode"
                placeholder="e.g., M1 1AA"
                value={editFormData.businessPostcode}
                onChange={(e) => setEditFormData((p) => ({ ...p, businessPostcode: e.target.value }))}
              />
              <Input
                label="Fleet Size"
                type="number"
                placeholder="Number of vehicles"
                value={editFormData.fleetSize}
                onChange={(e) => setEditFormData((p) => ({ ...p, fleetSize: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setEditingSection(null)} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => handleSaveProfile('business')} disabled={savingProfile} variant="primary">
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={MapPin} label="Business Address" value={profile.businessAddress || 'Not provided'} />
            <InfoItem icon={MapPin} label="Business Postcode" value={profile.businessPostcode || 'Not provided'} />
            <InfoItem icon={Truck} label="Fleet Size" value={profile.fleetSize ? String(profile.fleetSize) : 'Not provided'} />
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <AlertCircle className="h-5 w-5 text-warning-600" />
            Emergency Contact
          </h2>
          {editingSection !== 'emergency' && (
            <Button onClick={() => startEditing('emergency')} variant="outline" size="sm">
              <Edit2 className="mr-1 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        {editingSection === 'emergency' ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Emergency Contact Name"
                placeholder="Full name"
                value={editFormData.emergencyContactName}
                onChange={(e) => setEditFormData((p) => ({ ...p, emergencyContactName: e.target.value }))}
              />
              <Input
                label="Emergency Contact Phone"
                placeholder="Phone number"
                value={editFormData.emergencyContactPhone}
                onChange={(e) => setEditFormData((p) => ({ ...p, emergencyContactPhone: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setEditingSection(null)} variant="outline">
                Cancel
              </Button>
              <Button onClick={() => handleSaveProfile('emergency')} disabled={savingProfile} variant="primary">
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={User} label="Emergency Contact Name" value={profile.emergencyContactName || 'Not provided'} />
            <InfoItem icon={Phone} label="Emergency Contact Phone" value={profile.emergencyContactPhone || 'Not provided'} />
          </div>
        )}
      </div>

      {/* Service Areas & Vehicle Types */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <MapPin className="h-5 w-5 text-accent-600" />
            Service Areas
          </h2>
          {profile.serviceAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.serviceAreas.map((area, i) => (
                <span
                  key={i}
                  className="rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-700"
                >
                  {area}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No service areas configured</p>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <Car className="h-5 w-5 text-primary-600" />
            Vehicle Types
          </h2>
          {profile.vehicleTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.vehicleTypes.map((type, i) => (
                <span
                  key={i}
                  className="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700"
                >
                  {type}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No vehicle types configured</p>
          )}
        </div>
      </div>

      {/* Bank Details */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <CreditCard className="h-5 w-5 text-success-600" />
            Bank Details
          </h2>
          {!editingBank && (
            <Button onClick={() => setEditingBank(true)} variant="outline" size="sm">
              {profile.bankDetails ? 'Edit' : 'Add'}
            </Button>
          )}
        </div>

        {editingBank ? (
          <div className="space-y-4">
            <Input
              label="Account Name"
              placeholder="Account holder name"
              value={bankDetails.accountName}
              onChange={(e) => setBankDetails((p) => ({ ...p, accountName: e.target.value }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Sort Code"
                placeholder="00-00-00"
                value={bankDetails.sortCode}
                onChange={(e) => setBankDetails((p) => ({ ...p, sortCode: e.target.value }))}
              />
              <Input
                label="Account Number"
                placeholder="12345678"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails((p) => ({ ...p, accountNumber: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setEditingBank(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSaveBankDetails} disabled={savingBank} variant="primary">
                {savingBank ? 'Saving...' : 'Save Bank Details'}
              </Button>
            </div>
          </div>
        ) : profile.bankDetails ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoItem icon={User} label="Account Name" value={profile.bankDetails.accountName} />
            <InfoItem icon={CreditCard} label="Sort Code" value={profile.bankDetails.sortCode} />
            <InfoItem icon={CreditCard} label="Account Number" value={`****${profile.bankDetails.accountNumber.slice(-4)}`} />
          </div>
        ) : (
          <p className="text-sm text-neutral-500">
            No bank details configured. Add your bank details to receive payouts.
          </p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="/operator/vehicles"
          className="group rounded-xl border border-neutral-200 bg-white p-6 hover:border-primary-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-100 p-3 group-hover:bg-primary-200 transition-colors">
              <Truck className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Manage Vehicles</h3>
              <p className="text-sm text-neutral-500">Add and manage your fleet</p>
            </div>
          </div>
        </a>
        <a
          href="/operator/drivers"
          className="group rounded-xl border border-neutral-200 bg-white p-6 hover:border-accent-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-accent-100 p-3 group-hover:bg-accent-200 transition-colors">
              <User className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Manage Drivers</h3>
              <p className="text-sm text-neutral-500">Add and manage your drivers</p>
            </div>
          </div>
        </a>
      </div>

      {/* Documents Section */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
          <Upload className="h-5 w-5 text-primary-600" />
          Documents
        </h2>
        <p className="mb-4 text-sm text-neutral-500">
          Upload your operating licence and insurance documents for verification.
        </p>

        {loadingDocuments ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <DocumentUpload
              documentType="license"
              label="Operating License"
              description="Upload your PHV/taxi operator licence"
              existingDocument={licenseDoc}
              onUploadComplete={() => fetchDocuments()}
              onDeleteComplete={() => fetchDocuments()}
            />
            <DocumentUpload
              documentType="insurance"
              label="Insurance Certificate"
              description="Upload your public liability insurance"
              existingDocument={insuranceDoc}
              onUploadComplete={() => fetchDocuments()}
              onDeleteComplete={() => fetchDocuments()}
            />
          </div>
        )}
      </div>

    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="font-medium text-neutral-900">{value}</p>
      </div>
    </div>
  );
}

