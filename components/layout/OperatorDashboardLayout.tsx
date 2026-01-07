'use client';

import {
  LayoutDashboard,
  Briefcase,
  Gavel,
  CheckCircle,
  Wallet,
  User,
  Truck,
  Users,
} from 'lucide-react';
import { DashboardLayout, type NavItem } from './dashboard';

const operatorNavItems: NavItem[] = [
  { href: '/operator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/operator/jobs', label: 'Available Jobs', icon: Briefcase },
  { href: '/operator/bids', label: 'My Bids', icon: Gavel },
  { href: '/operator/assigned', label: 'Assigned Jobs', icon: CheckCircle },
  { href: '/operator/earnings', label: 'Earnings', icon: Wallet },
  { href: '/operator/vehicles', label: 'Vehicles', icon: Truck },
  { href: '/operator/drivers', label: 'Drivers', icon: Users },
  { href: '/operator/profile', label: 'Profile', icon: User },
];

interface OperatorDashboardLayoutProps {
  children: React.ReactNode;
}

export default function OperatorDashboardLayout({
  children,
}: OperatorDashboardLayoutProps) {
  return (
    <DashboardLayout
      navItems={operatorNavItems}
      branding={{
        icon: Truck,
        title: 'TTS Operator',
        href: '/operator/dashboard',
      }}
      topBarTitle="Operator Dashboard"
      showNotifications={true}
    >
      {children}
    </DashboardLayout>
  );
}

