import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/hero/PageHero';
import { StatsGrid } from '@/components/sections/stats/StatsGrid';
import { TwoColumnContent } from '@/components/sections/content/TwoColumnContent';
import { ValuesSection } from '@/components/sections/content/ValuesSection';
import { WhyChooseSection } from '@/components/sections/content/WhyChooseSection';
import { CTASection } from '@/components/features/landing/CtaSection';
import { OrganizationSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { aboutPageData } from '@/lib/data/about.data';
import { siteConfig } from '@/lib/data/seo.data';

/**
 * About Page Content Component
 * Contains all the layout and composition logic for the about page
 */

export default function AboutPageContent() {
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: 'About', url: `${siteConfig.url}/about` },
  ];

  return (
    <>
      {/* SEO Structured Data */}
      <OrganizationSchema />
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section with Stats */}
          <PageHero title={aboutPageData.hero.title} subtitle={aboutPageData.hero.subtitle}>
            <StatsGrid stats={aboutPageData.stats} columns={4} variant="dark" />
          </PageHero>

          {/* Our Story Section */}
          <TwoColumnContent
            title={aboutPageData.story.title}
            paragraphs={aboutPageData.story.paragraphs}
            image={aboutPageData.story.image}
            imagePosition="left"
            backgroundColor="white"
          />

          {/* Our Values Section */}
          <ValuesSection
            title="Our Values"
            subtitle="The principles that guide everything we do"
            values={aboutPageData.values}
            columns={4}
            variant="card"
            iconColor="primary"
            backgroundColor="neutral"
          />

          {/* Why Choose Us Section */}
          <WhyChooseSection
            title="Why Choose TransferHub?"
            subtitle="We're more than just a booking platform"
            reasons={aboutPageData.whyChooseUs}
            columns={3}
            variant="minimal"
            iconColor="accent"
            backgroundColor="neutral"
          />

          {/* CTA Section */}
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}

