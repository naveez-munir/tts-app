import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: Date;
  children: React.ReactNode;
}

/**
 * Legal Page Layout Component
 * Reusable layout for Privacy Policy, Terms & Conditions, Cookie Policy
 * 
 * Features:
 * - Consistent header and footer
 * - Proper spacing and responsive design
 * - SEO-friendly structure
 * - Accessible heading hierarchy
 */
export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  const formattedDate = lastUpdated 
    ? lastUpdated.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <Header variant="solid" />

      <main className="min-h-screen bg-neutral-50 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          {/* Page Header */}
          <header className="mb-8 sm:mb-12">
            <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              Last updated: {formattedDate}
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-neutral max-w-none">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8 lg:p-10">
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

