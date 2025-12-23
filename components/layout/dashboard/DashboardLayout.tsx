'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar, { type NavItem } from './DashboardSidebar';
import DashboardTopBar, { type TopBarAction } from './DashboardTopBar';
import type { LucideIcon } from 'lucide-react';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  /** Navigation items for the sidebar */
  navItems: NavItem[];
  /** Branding configuration */
  branding: {
    icon: LucideIcon;
    title: string;
    href: string;
  };
  /** Footer navigation items (e.g., Settings) */
  footerItems?: NavItem[];
  /** Top bar title (shown on desktop) */
  topBarTitle?: string;
  /** Top bar action buttons */
  topBarActions?: TopBarAction[];
  /** Show notifications bell in top bar */
  showNotifications?: boolean;
}

export default function DashboardLayout({
  children,
  navItems,
  branding,
  footerItems,
  topBarTitle,
  topBarActions,
  showNotifications = true,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | undefined>();

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        const name = `${userData.first_name || userData.firstName || ''} ${userData.last_name || userData.lastName || ''}`.trim() || 'User';
        setUser({
          name,
          email: userData.email || '',
        });
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // Redirect to home
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={navItems}
        branding={branding}
        user={user}
        onLogout={handleLogout}
        footerItems={footerItems}
      />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <DashboardTopBar
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={handleLogout}
          title={topBarTitle}
          actions={topBarActions}
          showNotifications={showNotifications}
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

