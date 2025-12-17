import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/hero/PageHero';
import { StatsGrid } from '@/components/sections/stats/StatsGrid';
import { BenefitsSection } from '@/components/sections/operators/BenefitsSection';
import { HowItWorksOperator } from '@/components/sections/operators/HowItWorksOperator';
import { RequirementsSection } from '@/components/sections/operators/RequirementsSection';
import { EarningsSection } from '@/components/sections/operators/EarningsSection';
import { OperatorTestimonials } from '@/components/sections/operators/OperatorTestimonials';
import { OperatorCTASection } from '@/components/sections/operators/OperatorCtaSection';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { operatorsPageData } from '@/lib/data/operators.data';
import { siteConfig } from '@/lib/data/seo.data';

/**
 * Operators Page Content Component
 * Contains all the layout and composition logic for the operators page
 * NOTE: Does NOT expose bidding system - focuses on recruitment
 */

export default function OperatorsPageContent() {
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: 'For Operators', url: `${siteConfig.url}/operators` },
  ];

  return (
    <>
      {/* SEO Structured Data */}
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section with Stats */}
          <PageHero title={operatorsPageData.hero.title} subtitle={operatorsPageData.hero.subtitle}>
            <StatsGrid stats={operatorsPageData.stats} columns={4} variant="dark" />
          </PageHero>

          {/* Benefits Section */}
          <BenefitsSection
            title={operatorsPageData.benefits.title}
            subtitle={operatorsPageData.benefits.subtitle}
            items={operatorsPageData.benefits.items}
          />

          {/* How It Works Section */}
          <HowItWorksOperator
            title={operatorsPageData.howItWorks.title}
            subtitle={operatorsPageData.howItWorks.subtitle}
            steps={operatorsPageData.howItWorks.steps}
          />

          {/* Requirements Section */}
          <RequirementsSection
            title={operatorsPageData.requirements.title}
            subtitle={operatorsPageData.requirements.subtitle}
            items={operatorsPageData.requirements.items}
          />

          {/* Earnings Section */}
          <EarningsSection
            title={operatorsPageData.earnings.title}
            subtitle={operatorsPageData.earnings.subtitle}
            description={operatorsPageData.earnings.description}
            highlights={operatorsPageData.earnings.highlights}
          />

          {/* Testimonials Section */}
          <OperatorTestimonials testimonials={operatorsPageData.testimonials} />

          {/* CTA Section */}
          <OperatorCTASection
            title={operatorsPageData.cta.title}
            subtitle={operatorsPageData.cta.subtitle}
            primaryButton={operatorsPageData.cta.primaryButton}
            secondaryButton={operatorsPageData.cta.secondaryButton}
          />
        </main>
        <Footer />
      </div>
    </>
  );
}

