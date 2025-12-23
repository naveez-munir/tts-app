'use client';

import { useState } from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import Link from 'next/link';

export interface TopBarAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface DashboardTopBarProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
  };
  onLogout: () => void;
  /** Optional title shown on desktop */
  title?: string;
  /** Optional action buttons */
  actions?: TopBarAction[];
  /** Show notifications bell */
  showNotifications?: boolean;
  /** Number of unread notifications */
  notificationCount?: number;
}

export default function DashboardTopBar({
  onMenuClick,
  user,
  onLogout,
  title,
  actions,
  showNotifications = true,
  notificationCount = 0,
}: DashboardTopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-neutral-700" />
      </button>

      {/* Center: Page title (hidden on mobile, shown on desktop) */}
      {title && (
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
        </div>
      )}

      {/* Right: Actions, Notifications, and user menu */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Action buttons */}
        {actions?.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`hidden sm:inline-flex rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              action.variant === 'secondary'
                ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {action.label}
          </Link>
        ))}

        {/* Notifications */}
        {showNotifications && (
          <button
            className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-neutral-700" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
            )}
          </button>
        )}

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-neutral-700 max-w-[150px] truncate">
              {user?.name || user?.email || 'User'}
            </span>
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                {user && (
                  <div className="px-4 py-2 border-b border-neutral-200">
                    <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

