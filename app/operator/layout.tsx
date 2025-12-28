import OperatorDashboardLayout from '@/components/layout/OperatorDashboardLayout';

export default function OperatorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OperatorDashboardLayout>{children}</OperatorDashboardLayout>;
}

