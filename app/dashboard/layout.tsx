import CustomerDashboardLayout from '@/components/layout/CustomerDashboardLayout';
import { ToastProvider } from '@/components/ui/Toast';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <CustomerDashboardLayout>{children}</CustomerDashboardLayout>
    </ToastProvider>
  );
}

