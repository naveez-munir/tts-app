import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerDashboardLayout>{children}</CustomerDashboardLayout>;
}

