'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Mail, Phone, MapPin, FileText, Check, X, Ban, RefreshCw, Star, Briefcase, AlertCircle, Download, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { updateOperatorApproval, listOperators, getOperatorDocuments, type OperatorDocument } from '@/lib/api/admin.api';
import { formatDate } from '@/lib/utils/date';
import { extractErrorMessage } from '@/lib/utils/error-handler';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';

interface OperatorDetails {
  id: string;
  companyName: string;
  registrationNumber: string;
  vatNumber: string | null;
  approvalStatus: string;
  reputationScore: number;
  completedJobsCount: number;
  totalJobs: number;
  createdAt: string;
  serviceAreas: string[];
  vehiclesCount: number;
  hasBankDetails: boolean;
  user: { email: string; phoneNumber: string | null };
}

export default function OperatorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const operatorId = params.id as string;
  const toast = useToast();

  const [operator, setOperator] = useState<OperatorDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showReinstateDialog, setShowReinstateDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<OperatorDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const fetchOperator = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch operator using list endpoint with search by ID
      const response = await listOperators({ search: operatorId, limit: 1 });
      const operators = response.data?.operators || [];
      // Find the operator with matching ID
      const found = operators.find((op: OperatorDetails) => op.id === operatorId);
      if (found) {
        setOperator(found);
      } else {
        setError('Operator not found');
      }
    } catch (err: unknown) {
      console.error('Failed to fetch operator:', err);
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [operatorId]);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoadingDocuments(true);
      const docs = await getOperatorDocuments(operatorId);
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      // Don't set error - documents are optional
    } finally {
      setLoadingDocuments(false);
    }
  }, [operatorId]);

  useEffect(() => {
    fetchOperator();
    fetchDocuments();
  }, [fetchOperator, fetchDocuments]);

  const handleStatusChange = async (status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      await updateOperatorApproval(operatorId, { approvalStatus: status });
      setOperator((prev) => prev ? { ...prev, approvalStatus: status } : null);
      setShowApproveDialog(false);
      setShowRejectDialog(false);
      setShowSuspendDialog(false);
      setShowReinstateDialog(false);

      // Show success toast
      const statusText = status === 'APPROVED' ? 'approved' : status === 'REJECTED' ? 'rejected' : 'suspended';
      toast.success(`Operator ${statusText} successfully`);
    } catch (err: unknown) {
      console.error('Failed to update status:', err);

      // Try to extract the specific error message from the backend
      const specificError = extractErrorMessage(err);
      const contextualError = getContextualErrorMessage(err, 'update');

      // Prefer the specific backend message if it's more detailed than the generic one
      const errorMessage = specificError && specificError !== 'Failed to update. Please try again.'
        ? specificError
        : contextualError;

      setUpdateError(errorMessage);

      // Also show toast for better visibility
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <LoadingOverlay message="Loading operator details..." />;

  if (error || !operator) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Operator</h2>
          <p className="mt-1 text-neutral-600">{error || 'Operator not found'}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={fetchOperator} variant="primary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-neutral-900">{operator.companyName}</h1>
          <p className="text-neutral-600">Registered {formatDate(operator.createdAt)}</p>
        </div>
        <StatusBadge variant={getStatusVariant(operator.approvalStatus)} className="text-sm px-3 py-1">
          {operator.approvalStatus}
        </StatusBadge>
      </div>

      {/* Update Error Display */}
      {updateError && (
        <div className="flex items-center justify-between rounded-lg border border-error-200 bg-error-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-error-600" />
            <p className="text-sm text-error-700">{updateError}</p>
          </div>
          <Button onClick={() => setUpdateError(null)} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Status Action Bars */}
      {operator.approvalStatus === 'PENDING' && (
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-warning-800 font-medium">This operator is awaiting approval</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRejectDialog(true)}><X className="w-4 h-4 mr-2" /> Reject</Button>
            <Button variant="secondary" onClick={() => setShowApproveDialog(true)}><Check className="w-4 h-4 mr-2" /> Approve</Button>
          </div>
        </div>
      )}
      {operator.approvalStatus === 'APPROVED' && (
        <div className="bg-success-50 border border-success-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-success-800 font-medium">This operator is active and can receive jobs</p>
          <Button variant="outline" onClick={() => setShowSuspendDialog(true)}><Ban className="w-4 h-4 mr-2" /> Suspend Operator</Button>
        </div>
      )}
      {operator.approvalStatus === 'SUSPENDED' && (
        <div className="bg-error-50 border border-error-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-error-800 font-medium">This operator is suspended and cannot receive jobs</p>
          <Button variant="secondary" onClick={() => setShowReinstateDialog(true)}><RefreshCw className="w-4 h-4 mr-2" /> Reinstate Operator</Button>
        </div>
      )}

      {/* Performance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-center">
          <div className="flex items-center justify-center gap-1 text-warning-500 mb-1"><Star className="w-5 h-5 fill-current" /><span className="text-2xl font-bold">{operator.reputationScore.toFixed(1)}</span></div>
          <p className="text-sm text-neutral-600">Reputation</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-center">
          <p className="text-2xl font-bold text-neutral-900">{operator.completedJobsCount}</p>
          <p className="text-sm text-neutral-600">Completed Jobs</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-center">
          <p className="text-2xl font-bold text-neutral-900">{operator.totalJobs}</p>
          <p className="text-sm text-neutral-600">Total Jobs</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-center">
          <p className="text-2xl font-bold text-neutral-900">{operator.totalJobs > 0 ? ((operator.completedJobsCount / operator.totalJobs) * 100).toFixed(0) : 0}%</p>
          <p className="text-sm text-neutral-600">Completion Rate</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-primary-600" /> Company Details</h2>
          <dl className="space-y-3">
            <div><dt className="text-sm text-neutral-500">Registration Number</dt><dd className="font-medium">{operator.registrationNumber}</dd></div>
            <div><dt className="text-sm text-neutral-500">VAT Number</dt><dd className="font-medium">{operator.vatNumber || 'N/A'}</dd></div>
            <div><dt className="text-sm text-neutral-500">Email</dt><dd className="font-medium flex items-center gap-2"><Mail className="w-4 h-4" />{operator.user.email}</dd></div>
            <div><dt className="text-sm text-neutral-500">Phone</dt><dd className="font-medium flex items-center gap-2"><Phone className="w-4 h-4" />{operator.user.phoneNumber || 'N/A'}</dd></div>
            <div><dt className="text-sm text-neutral-500">Bank Details</dt><dd className="font-medium">{operator.hasBankDetails ? <span className="text-success-600">✓ Configured</span> : <span className="text-warning-600">Not configured</span>}</dd></div>
          </dl>
        </div>

        {/* Service Areas & Vehicles */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-600" /> Service Areas</h2>
          <div className="flex flex-wrap gap-2">
            {(operator.serviceAreas ?? []).length > 0 ? (operator.serviceAreas ?? []).map((area) => (
              <span key={area} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">{area}</span>
            )) : <p className="text-neutral-500 text-sm">No service areas configured</p>}
          </div>
          <h3 className="text-md font-semibold mt-6 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Vehicles</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">{operator.vehiclesCount} vehicle(s) registered</span>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-600" /> Documents</h2>
          {loadingDocuments ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-neutral-500">No documents uploaded</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {documents.map((doc) => {
                const isImage = /\.(jpg|jpeg|png)$/i.test(doc.fileName);
                const isExpired = doc.expiresAt && new Date(doc.expiresAt) < new Date();
                const expiringDays = doc.expiresAt ? Math.ceil((new Date(doc.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                const isExpiringSoon = expiringDays !== null && expiringDays > 0 && expiringDays <= 30;

                return (
                  <div key={doc.id} className="rounded-lg border border-neutral-200 p-4">
                    {/* Image Preview */}
                    {isImage && doc.fileUrl && (
                      <div className="mb-3">
                        <img
                          src={doc.fileUrl}
                          alt={doc.fileName}
                          className="h-32 w-auto rounded-lg object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900">
                          {doc.documentType === 'OPERATING_LICENSE' ? 'Operating License' :
                           doc.documentType === 'INSURANCE' ? 'Insurance Certificate' :
                           doc.documentType}
                        </p>
                        <p className="text-sm text-neutral-500 truncate">{doc.fileName}</p>
                        <p className="text-xs text-neutral-400">
                          Uploaded {formatDate(doc.uploadedAt)}
                        </p>
                        <div className="mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {doc.expiresAt ? (
                            <>
                              <span className={`text-xs font-medium ${
                                isExpired ? 'text-red-600' : isExpiringSoon ? 'text-warning-600' : 'text-neutral-500'
                              }`}>
                                {isExpired ? 'Expired' : `Expires ${formatDate(doc.expiresAt)}`}
                              </span>
                              {isExpired && (
                                <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                                  Action Required
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-neutral-400">No expiry date set</span>
                          )}
                        </div>
                      </div>
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog isOpen={showApproveDialog} onClose={() => setShowApproveDialog(false)} onConfirm={() => handleStatusChange('APPROVED')} title="Approve Operator" message={`Are you sure you want to approve ${operator.companyName}? They will be able to receive and bid on jobs.`} confirmText="Approve" variant="info" isLoading={isUpdating} />
      <ConfirmDialog isOpen={showRejectDialog} onClose={() => setShowRejectDialog(false)} onConfirm={() => handleStatusChange('REJECTED')} title="Reject Operator" message={`Are you sure you want to reject ${operator.companyName}? They will need to re-apply.`} confirmText="Reject" variant="danger" isLoading={isUpdating} />
      <ConfirmDialog isOpen={showSuspendDialog} onClose={() => setShowSuspendDialog(false)} onConfirm={() => handleStatusChange('SUSPENDED')} title="Suspend Operator" message={`Are you sure you want to suspend ${operator.companyName}? They will not be able to receive new jobs until reinstated.`} confirmText="Suspend" variant="warning" isLoading={isUpdating} />
      <ConfirmDialog isOpen={showReinstateDialog} onClose={() => setShowReinstateDialog(false)} onConfirm={() => handleStatusChange('APPROVED')} title="Reinstate Operator" message={`Are you sure you want to reinstate ${operator.companyName}? They will be able to receive and bid on jobs again.`} confirmText="Reinstate" variant="info" isLoading={isUpdating} />
    </div>
  );
}

