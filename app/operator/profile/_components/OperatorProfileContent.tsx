'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getOperatorDashboard } from '@/lib/api';

interface OperatorProfile {
  companyName: string;
  registrationNumber: string;
  vatNumber?: string;
  contactName: string;
  email: string;
  phone: string;
  approvalStatus: string;
  serviceAreas: string[];
  vehicleTypes: string[];
  bankDetails?: {
    accountName: string;
    sortCode: string;
    accountNumber: string;
  };
}

export default function OperatorProfileContent() {
  const [profile, setProfile] = useState<OperatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBank, setEditingBank] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    sortCode: '',
    accountNumber: '',
  });
  const [savingBank, setSavingBank] = useState(false);

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

      setProfile({
        companyName: profileData.companyName || 'N/A',
        registrationNumber: profileData.registrationNumber || 'N/A',
        vatNumber: profileData.vatNumber,
        contactName: profileData.user?.firstName ? `${profileData.user.firstName} ${profileData.user.lastName || ''}`.trim() : 'N/A',
        email: profileData.user?.email || 'N/A',
        phone: profileData.user?.phone || 'N/A',
        approvalStatus: profileData.approvalStatus || 'PENDING',
        serviceAreas,
        vehicleTypes,
        bankDetails: profileData.bankAccountName ? {
          accountName: profileData.bankAccountName,
          sortCode: profileData.bankSortCode || '',
          accountNumber: profileData.bankAccountNumber || '',
        } : undefined,
      });
      if (profileData.bankAccountName) {
        setBankDetails({
          accountName: profileData.bankAccountName,
          sortCode: profileData.bankSortCode || '',
          accountNumber: profileData.bankAccountNumber || '',
        });
      }
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveBankDetails = async () => {
    if (!bankDetails.accountName || !bankDetails.sortCode || !bankDetails.accountNumber) {
      alert('Please fill in all bank details');
      return;
    }
    setSavingBank(true);
    // In production, would call API to save bank details
    setTimeout(() => {
      setProfile((prev) => prev ? { ...prev, bankDetails } : null);
      setEditingBank(false);
      setSavingBank(false);
    }, 1000);
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
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-neutral-600">{error || 'Something went wrong'}</p>
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

      {/* Company Information */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
          <Building2 className="h-5 w-5 text-primary-600" />
          Company Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem icon={Building2} label="Company Name" value={profile.companyName} />
          <InfoItem icon={FileText} label="Registration Number" value={profile.registrationNumber} />
          {profile.vatNumber && (
            <InfoItem icon={FileText} label="VAT Number" value={profile.vatNumber} />
          )}
          <InfoItem icon={User} label="Contact Name" value={profile.contactName} />
          <InfoItem icon={Mail} label="Email" value={profile.email} />
          <InfoItem icon={Phone} label="Phone" value={profile.phone} />
        </div>
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

