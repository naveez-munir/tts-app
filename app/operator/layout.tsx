import OperatorDashboardLayout from '@/components/layout/OperatorDashboardLayout';
import { ToastProvider } from '@/components/ui/Toast';

export default function OperatorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <OperatorDashboardLayout>{children}</OperatorDashboardLayout>
    </ToastProvider>
  );
}

