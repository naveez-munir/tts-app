import { cookies } from 'next/headers';
import AdminLayout from '@/components/layout/AdminLayout';
import { ToastProvider } from '@/components/ui/Toast';

// Get user info from cookies (auth is already verified by middleware)
async function getUserEmail() {
  const cookieStore = await cookies();

  // Try to get user email from a cookie, or use a default
  // The middleware already verified the token is valid
  const userRole = cookieStore.get('userRole')?.value;

  // For now, return a placeholder email since we store role but not email in cookie
  // In production, you'd decode the JWT to get the actual email
  return userRole === 'ADMIN' ? 'admin@tts.com' : 'user@tts.com';
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is handled by middleware - if we get here, user is authenticated with ADMIN role
  const userEmail = await getUserEmail();

  return (
    <ToastProvider>
      <AdminLayout userEmail={userEmail}>
        {children}
      </AdminLayout>
    </ToastProvider>
  );
}

