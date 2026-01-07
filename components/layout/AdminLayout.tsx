'use client';

import {
  LayoutDashboard,
  Users,
  UserCircle,
  Calendar,
  Briefcase,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  Car,
  Banknote,
} from 'lucide-react';
import { DashboardLayout, type NavItem } from './dashboard';

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/customers', label: 'Customers', icon: UserCircle },
  { href: '/admin/operators', label: 'Operators', icon: Users },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/payouts', label: 'Payouts', icon: Banknote },
  { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/admin/vehicle-capacities', label: 'Vehicles', icon: Car },
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
