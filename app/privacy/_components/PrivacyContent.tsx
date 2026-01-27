/**
 * Privacy Policy Content Component
 * Contains the actual privacy policy content
 * Separated for better maintainability and SEO
 */
export function PrivacyContent() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Introduction</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Total Travel Solution Group Limited ("we", "our", or "us") is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you
          use our travel booking platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Information We Collect</h2>
        <h3 className="text-xl font-semibold text-neutral-800 mb-3">2.1 Personal Information</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Name, email address, and phone number</li>
          <li>Payment information (processed securely through Stripe)</li>
          <li>Booking details (pickup/drop-off locations, dates, times)</li>
          <li>Flight information (if provided)</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">2.2 Automatically Collected Information</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>IP address and browser type</li>
          <li>Device information</li>
          <li>Usage data and analytics</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. How We Use Your Information</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Process and manage your bookings</li>
          <li>Communicate with you about your transfers</li>
          <li>Send booking confirmations and updates</li>
          <li>Process payments securely</li>
          <li>Improve our services and user experience</li>
          <li>Comply with legal obligations</li>
          <li>Prevent fraud and ensure platform security</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Information Sharing</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We may share your information with:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li><strong>Transport Operators:</strong> To fulfill your booking</li>
          <li><strong>Payment Processors:</strong> Stripe for secure payment processing</li>
          <li><strong>Service Providers:</strong> Email, SMS, and analytics services</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Data Security</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We implement appropriate technical and organizational measures to protect your personal information. 
          However, no method of transmission over the Internet is 100% secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Your Rights</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Under UK GDPR, you have the right to:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to processing of your data</li>
          <li>Data portability</li>
          <li>Withdraw consent</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Cookies</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We use cookies and similar technologies to improve your experience. See our{' '}
          <a href="/cookies" className="text-primary-600 hover:text-primary-700 font-semibold underline">
            Cookie Policy
          </a>{' '}
          for more information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Data Retention</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
          Privacy Policy, unless a longer retention period is required by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Children's Privacy</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Our services are not directed to individuals under the age of 18. We do not knowingly collect personal 
          information from children.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Changes to This Policy</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
          new Privacy Policy on this page with an updated "Last updated" date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Contact Us</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          For privacy-related questions or to exercise your rights, contact us at:
        </p>
        <div className="bg-neutral-50 p-4 rounded-lg">
          <p className="text-neutral-700"><strong>Email:</strong> customerservice@totaltravelsolution.com</p>
          <p className="text-neutral-700"><strong>Company:</strong> Total Travel Solution Group Limited</p>
          <p className="text-neutral-700"><strong>Company Number:</strong> 16910276</p>
        </div>
      </section>
    </>
  );
}

