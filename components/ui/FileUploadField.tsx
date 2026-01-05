'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import {
  getDocumentUploadUrl,
  uploadFileToS3,
  validateFile,
  getFileType,
  type FileType,
} from '@/lib/api/operator.api';

interface FileUploadFieldProps {
  label: string;
  value: string; // S3 key or presigned URL
  onChange: (key: string) => void;
  accept?: 'image' | 'document' | 'all';
  description?: string;
  error?: string;
  disabled?: boolean;
}

type UploadState = 'idle' | 'uploading' | 'error';

/**
 * Reusable file upload field component
 * Uploads files to S3 and returns the key
 * Used for driver documents, vehicle photos, etc.
 */
export function FileUploadField({
  label,
  value,
  onChange,
  accept = 'all',
  description,
  error,
  disabled = false,
}: FileUploadFieldProps) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = {
    image: 'image/jpeg,image/png',
    document: 'application/pdf',
    all: 'image/jpeg,image/png,application/pdf',
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png)$/i.test(url) || url.startsWith('data:image');
  };

  const handleUpload = useCallback(async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setUploadState('error');
      return;
    }

    const fileType = getFileType(file.name);
    if (!fileType) {
      setUploadError('Unsupported file type');
      setUploadState('error');
      return;
    }

    setUploadState('uploading');
    setProgress(0);
    setUploadError(null);

    try {
      // Get presigned URL
      const { uploadUrl, key } = await getDocumentUploadUrl(
        `upload-${Date.now()}-${file.name}`,
        fileType as FileType,
        'other'
      );

      // Upload to S3
      await uploadFileToS3(uploadUrl, file, (p) => setProgress(p));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      // Return the S3 key
      onChange(key);
      setUploadState('idle');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
      setUploadState('error');
    }
  }, [onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    onChange('');
    setPreview(null);
    setUploadError(null);
    setUploadState('idle');
  };

  const displayUrl = value?.startsWith('http') ? value : preview;
  const hasValue = !!value;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      {description && <p className="text-xs text-neutral-500">{description}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes[accept]}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {uploadState === 'uploading' ? (
        <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full bg-primary-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-neutral-500">{progress}%</span>
        </div>
      ) : hasValue ? (
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2">
          {displayUrl && isImageUrl(value) ? (
            <img src={displayUrl} alt="Preview" className="h-12 w-12 rounded object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-neutral-200">
              <FileText className="h-6 w-6 text-neutral-500" />
            </div>
          )}
          <div className="flex-1 truncate text-sm text-neutral-600">
            {value.split('/').pop() || 'Uploaded file'}
          </div>
          {value.startsWith('http') && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.open(value, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button type="button" variant="ghost" size="sm" onClick={handleClear} disabled={disabled}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-sm transition-colors ${
            disabled
              ? 'cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-400'
              : 'cursor-pointer border-neutral-300 text-neutral-600 hover:border-primary-400 hover:bg-neutral-50'
          }`}
        >
          {accept === 'image' ? (
            <ImageIcon className="h-5 w-5" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          <span>Click to upload</span>
        </button>
      )}

      {(uploadError || error) && (
        <p className="text-sm text-red-600">{uploadError || error}</p>
      )}
    </div>
  );
}

