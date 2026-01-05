'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Download, Trash2, Loader2, Calendar } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import {
  type DocumentType,
  type OperatorDocument,
  getDocumentUploadUrl,
  uploadFileToS3,
  confirmDocumentUpload,
  getDocumentDownloadUrl,
  deleteDocument,
  validateFile,
  getFileType,
} from '@/lib/api/operator.api';

interface DocumentUploadProps {
  documentType: DocumentType;
  label: string;
  description?: string;
  existingDocument?: OperatorDocument | null;
  onUploadComplete?: (document: OperatorDocument) => void;
  onDeleteComplete?: () => void;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export function DocumentUpload({
  documentType,
  label,
  description,
  existingDocument,
  onUploadComplete,
  onDeleteComplete,
}: DocumentUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [noExpiryDate, setNoExpiryDate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUpload = expiryDate || noExpiryDate;

  const handleUpload = useCallback(async (file: File) => {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      setUploadState('error');
      return;
    }

    const fileType = getFileType(file.name);
    if (!fileType) {
      setError('Unsupported file type');
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    setProgress(0);
    setError(null);

    try {
      // Step 1: Get presigned URL
      const { uploadUrl, key } = await getDocumentUploadUrl(file.name, fileType, documentType);

      // Step 2: Upload to S3
      await uploadFileToS3(uploadUrl, file, (p) => setProgress(p));

      // Step 3: Confirm upload with expiry date
      // Convert date string to ISO datetime format
      const expiryDateTime = expiryDate ? new Date(expiryDate).toISOString() : undefined;
      const document = await confirmDocumentUpload(
        key,
        documentType,
        file.name,
        expiryDateTime
      );

      setUploadState('success');
      setProgress(100);
      setExpiryDate('');
      onUploadComplete?.(document);
    } catch (err: unknown) {
      console.error('Upload failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(errorMessage);
      setUploadState('error');
    }
  }, [documentType, expiryDate, onUploadComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDownload = async () => {
    if (!existingDocument) return;

    // Use fileUrl directly if available (presigned URL from API)
    if (existingDocument.fileUrl) {
      window.open(existingDocument.fileUrl, '_blank');
      return;
    }

    // Fallback: fetch download URL if fileUrl not available
    setIsDownloading(true);
    try {
      const url = await getDocumentDownloadUrl(existingDocument.id);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingDocument) return;
    if (!confirm('Are you sure you want to delete this document?')) return;

    setIsDeleting(true);
    try {
      await deleteDocument(existingDocument.id);
      onDeleteComplete?.();
      setUploadState('idle');
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetUpload = () => {
    setUploadState('idle');
    setProgress(0);
    setError(null);
    setExpiryDate('');
    setNoExpiryDate(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper to check expiry status
  const getExpiryStatus = (expiresAt: string | null) => {
    if (!expiresAt) return null;

    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', message: 'Expired', color: 'red' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', message: `Expires in ${daysUntilExpiry} days`, color: 'warning' };
    }
    return { status: 'valid', message: `Expires ${expiryDate.toLocaleDateString()}`, color: 'neutral' };
  };

  // Check if file is an image
  const isImageFile = (fileName: string) => {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  };

  // Show existing document
  if (existingDocument && uploadState !== 'uploading') {
    const expiryStatus = getExpiryStatus(existingDocument.expiresAt);
    const isImage = isImageFile(existingDocument.fileName);

    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        {/* Image Preview */}
        {isImage && existingDocument.fileUrl && (
          <div className="mb-3">
            <img
              src={existingDocument.fileUrl}
              alt={existingDocument.fileName}
              className="h-32 w-auto rounded-lg object-cover"
            />
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success-100 p-2">
              <File className="h-5 w-5 text-success-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900">{label}</p>
              <p className="text-sm text-neutral-500">{existingDocument.fileName}</p>
              <p className="text-xs text-neutral-400">
                Uploaded {new Date(existingDocument.uploadedAt).toLocaleDateString()}
              </p>
              <div className="mt-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {expiryStatus ? (
                  <>
                    <span
                      className={`text-xs font-medium ${
                        expiryStatus.status === 'expired'
                          ? 'text-red-600'
                          : expiryStatus.status === 'expiring'
                          ? 'text-warning-600'
                          : 'text-neutral-500'
                      }`}
                    >
                      {expiryStatus.message}
                    </span>
                    {expiryStatus.status === 'expired' && (
                      <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        Action Required
                      </span>
                    )}
                    {expiryStatus.status === 'expiring' && (
                      <span className="ml-1 rounded-full bg-warning-100 px-2 py-0.5 text-xs font-semibold text-warning-700">
                        Renew Soon
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-neutral-400">No expiry date set</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download"
            >
              {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete"
              className="text-red-500 hover:text-red-600"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-neutral-700">{label}</p>
      {description && <p className="text-xs text-neutral-500">{description}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
      />

      {uploadState === 'idle' && (
        <div className="space-y-3">
          <Input
            type="date"
            label="Document Expiry Date (Optional)"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="Select expiry date if applicable"
            min={new Date().toISOString().split('T')[0]}
            disabled={noExpiryDate}
          />
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={noExpiryDate}
              onChange={(e) => {
                setNoExpiryDate(e.target.checked);
                if (e.target.checked) {
                  setExpiryDate('');
                }
              }}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            This document has no expiry date
          </label>
          <div
            onClick={() => canUpload && fileInputRef.current?.click()}
            onDragOver={(e) => canUpload && handleDragOver(e)}
            onDragLeave={(e) => canUpload && handleDragLeave(e)}
            onDrop={(e) => {
              if (canUpload) {
                handleDrop(e);
              } else {
                e.preventDefault();
              }
            }}
            className={`
              rounded-lg border-2 border-dashed p-6 text-center transition-colors
              ${!canUpload
                ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-60'
                : isDragging
                  ? 'cursor-pointer border-primary-500 bg-primary-50'
                  : 'cursor-pointer border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
              }
            `}
          >
            <Upload className={`mx-auto h-8 w-8 ${canUpload ? 'text-neutral-400' : 'text-neutral-300'}`} />
            <p className="mt-2 text-sm text-neutral-600">
              {canUpload ? (
                <>
                  <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                </>
              ) : (
                <span className="text-neutral-400">Set expiry date or check &quot;no expiry&quot; to enable upload</span>
              )}
            </p>
            <p className="text-xs text-neutral-400">PDF, JPG, or PNG (max 5MB)</p>
          </div>
        </div>
      )}

      {uploadState === 'uploading' && (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-700">Uploading...</p>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-neutral-500">{progress}%</span>
          </div>
        </div>
      )}

      {uploadState === 'success' && (
        <div className="rounded-lg border border-success-200 bg-success-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success-600" />
              <p className="text-sm font-medium text-success-700">Upload complete!</p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetUpload}>
              Upload another
            </Button>
          </div>
        </div>
      )}

      {uploadState === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetUpload}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

