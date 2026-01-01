'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getCurrentUser, logout } from '@/lib/api';
import type { User as UserType } from '@/lib/types';

export default function ProfileContent() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
    setLoading(false);
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

  if (!user) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <User className="h-12 w-12 text-neutral-400" />
        <p className="text-neutral-600">Unable to load profile information.</p>
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;
  const memberSince = new Date(user.created_at).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
        <p className="mt-1 text-neutral-600">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4 border-b border-neutral-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <span className="text-2xl font-bold text-primary-600">
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">{fullName}</h2>
            <p className="text-sm text-neutral-500">Customer Account</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-6 space-y-4">
          {/* Email */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <Mail className="h-5 w-5 text-neutral-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-500">Email Address</p>
              <p className="font-medium text-neutral-900">{user.email}</p>
            </div>
            {user.is_email_verified ? (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                <CheckCircle className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                <XCircle className="h-3.5 w-3.5" />
                Unverified
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <Phone className="h-5 w-5 text-neutral-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-500">Phone Number</p>
              <p className="font-medium text-neutral-900">
                {user.phone_number || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <Calendar className="h-5 w-5 text-neutral-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-500">Member Since</p>
              <p className="font-medium text-neutral-900">{memberSince}</p>
            </div>
          </div>

          {/* Account Status */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <Shield className="h-5 w-5 text-neutral-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-500">Account Status</p>
              <p className="font-medium text-neutral-900">
                {user.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
            {user.is_active && (
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-neutral-900">Account Actions</h3>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

