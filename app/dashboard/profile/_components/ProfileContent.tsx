'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, CheckCircle, XCircle, LogOut, AlertCircle, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { getCurrentUser, logout } from '@/lib/api';
import type { User as UserType } from '@/lib/types';

export default function ProfileContent() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = () => {
    setLoading(true);
    setError(null);
    try {
      const userData = getCurrentUser();
      setUser(userData);
      if (!userData) {
        setError('Unable to load profile information. Please sign in again.');
      }
    } catch (err) {
      setError('Failed to load profile data.');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Profile</h2>
          <p className="mt-1 text-neutral-600">{error || 'Profile information is unavailable.'}</p>
        </div>
        <Button onClick={fetchUser} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">My Profile</h1>
        <p className="text-sm text-neutral-600">Manage your account information</p>
      </div>

      {/* Main Content - 2 Column Layout on Desktop */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="space-y-4 lg:col-span-2">
          {/* Profile Header Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100">
                <span className="text-lg font-bold text-primary-600">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold text-neutral-900">{fullName}</h2>
                <p className="text-xs text-neutral-500">Customer Account</p>
              </div>
              {user.isActive ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  Inactive
                </span>
              )}
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Contact Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Email */}
              <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Email</p>
                  <p className="truncate text-sm font-medium text-neutral-900">{user.email}</p>
                </div>
                {user.isEmailVerified ? (
                  <span title="Verified">
                    <CheckCircle className="h-4 w-4 shrink-0 text-green-500" aria-label="Verified" />
                  </span>
                ) : (
                  <span title="Unverified">
                    <XCircle className="h-4 w-4 shrink-0 text-yellow-500" aria-label="Unverified" />
                  </span>
                )}
              </div>
              {/* Phone */}
              <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                <Phone className="h-4 w-4 shrink-0 text-neutral-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Phone</p>
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {user.phoneNumber || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Account Details</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Member Since */}
              <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                <Calendar className="h-4 w-4 shrink-0 text-neutral-400" />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Member Since</p>
                  <p className="text-sm font-medium text-neutral-900">{memberSince}</p>
                </div>
              </div>
              {/* Role */}
              <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3">
                <Shield className="h-4 w-4 shrink-0 text-neutral-400" />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">Role</p>
                  <p className="text-sm font-medium capitalize text-neutral-900">
                    {user.role?.toLowerCase() || 'Customer'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">Account Actions</h3>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

