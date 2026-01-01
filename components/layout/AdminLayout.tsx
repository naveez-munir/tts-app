'use client';

import {
  LayoutDashboard,
  Users,
  Calendar,
  Briefcase,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
} from 'lucide-react';
import { DashboardLayout, type NavItem } from './dashboard';

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/operators', label: 'Operators', icon: Users },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

const adminFooterItems: NavItem[] = [
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <DashboardLayout
      navItems={adminNavItems}
      branding={{
        icon: Shield,
        title: 'Admin Panel',
        href: '/admin',
      }}
      footerItems={adminFooterItems}
      topBarTitle="Admin Dashboard"
      showNotifications={true}
    >
      {children}
    </DashboardLayout>
  );
}

