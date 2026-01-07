'use client';

import { LayoutDashboard, Calendar, User, Car } from 'lucide-react';
import { DashboardLayout, type NavItem } from './dashboard';

const customerNavItems: NavItem[] = [
  { href: '/dashboard', label: 'My Bookings', icon: LayoutDashboard },
  { href: '/dashboard/upcoming', label: 'Upcoming Trips', icon: Calendar },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

interface CustomerDashboardLayoutProps {
  children: React.ReactNode;
}

export default function CustomerDashboardLayout({
  children,
}: CustomerDashboardLayoutProps) {
  return (
    <DashboardLayout
      navItems={customerNavItems}
      branding={{
        icon: Car,
        title: 'TTS',
        href: '/',
      }}
      topBarTitle="My Dashboard"
      topBarActions={[
        { label: 'Book New Trip', href: '/dashboard/book', variant: 'primary' },
      ]}
      showNotifications={true}
    >
      {children}
    </DashboardLayout>
  );
}

