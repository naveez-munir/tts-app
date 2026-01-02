import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/features/landing/HeroSection';
import { FeaturesSection } from '@/components/features/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/features/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/features/landing/TestimonialsSection';
import { CTASection } from '@/components/features/landing/CtaSection';
import { OrganizationSchema, LocalBusinessSchema } from '@/components/seo/StructuredData';

/**
 * Landing Page Content Component
 * Contains all the layout and composition logic for the landing page
 */

export default function LandingPageContent() {
  return (
    <>
      {/* SEO Structured Data */}
      <OrganizationSchema />
      <LocalBusinessSchema />

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}

