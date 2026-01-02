import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/sections/hero/PageHero';
import { ContactInfoCards } from '@/components/sections/contact/ContactInfoCards';
import { ContactFormSection } from '@/components/sections/contact/ContactFormSection';
import { FAQSection } from '@/components/sections/contact/FaqSection';
import { ContactCTASection } from '@/components/sections/contact/ContactCtaSection';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { contactPageData } from '@/lib/data/contact.data';
import { siteConfig } from '@/lib/data/seo.data';

/**
 * Contact Page Content Component
 * Contains all the layout and composition logic for the contact page
 */

export default function ContactPageContent() {
  const breadcrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: 'Contact', url: `${siteConfig.url}/contact` },
  ];

  return (
    <>
      {/* SEO Structured Data */}
      <FAQSchema faqs={contactPageData.faq.items} />
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <PageHero
            badge="We're here to help"
            title={contactPageData.hero.title}
            subtitle={contactPageData.hero.subtitle}
          />

          {/* Contact Information Cards */}
          <ContactInfoCards contactInfo={contactPageData.contactInfo} />

          {/* Contact Form Section */}
          <ContactFormSection
            title={contactPageData.form.title}
            subtitle={contactPageData.form.subtitle}
            inquiryTypes={contactPageData.form.inquiryTypes}
          />

          {/* FAQ Section */}
          <FAQSection
            title={contactPageData.faq.title}
            subtitle={contactPageData.faq.subtitle}
            faqs={contactPageData.faq.items}
          />

          {/* CTA Section */}
          <ContactCTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}

