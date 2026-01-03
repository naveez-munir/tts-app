/**
 * Cookie Policy Content Component
 * Contains the actual cookie policy content
 * Separated for better maintainability and SEO
 */
export function CookiesContent() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. What Are Cookies?</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Cookies are small text files that are placed on your device when you visit our website. They help us 
          provide you with a better experience by remembering your preferences and understanding how you use our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. How We Use Cookies</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We use cookies for the following purposes:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>To keep you signed in to your account</li>
          <li>To remember your preferences and settings</li>
          <li>To understand how you use our platform</li>
          <li>To improve our services and user experience</li>
          <li>To ensure the security of our platform</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Types of Cookies We Use</h2>
        
        <h3 className="text-xl font-semibold text-neutral-800 mb-3">3.1 Essential Cookies</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          These cookies are necessary for the website to function properly. They enable core functionality such as 
          security, authentication, and session management.
        </p>
        <div className="bg-primary-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-neutral-700"><strong>Note:</strong> These cookies cannot be disabled as they are essential for the platform to work.</p>
        </div>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">3.2 Functional Cookies</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          These cookies allow us to remember your preferences and provide enhanced features:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Language preferences</li>
          <li>Recent searches</li>
          <li>Form data (to save you time)</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">3.3 Analytics Cookies</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We use analytics cookies to understand how visitors interact with our website:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Pages visited and time spent</li>
          <li>Navigation patterns</li>
          <li>Error messages encountered</li>
          <li>Device and browser information</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">3.4 Third-Party Cookies</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We use trusted third-party services that may set cookies:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li><strong>Stripe:</strong> For secure payment processing</li>
          <li><strong>Google Maps:</strong> For location services</li>
          <li><strong>Analytics providers:</strong> To understand user behavior</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Cookie Duration</h2>
        <h3 className="text-xl font-semibold text-neutral-800 mb-3">4.1 Session Cookies</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          These are temporary cookies that expire when you close your browser.
        </p>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">4.2 Persistent Cookies</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          These cookies remain on your device for a set period or until you delete them. They help us recognize you 
          when you return to our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Managing Cookies</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          You can control and manage cookies in several ways:
        </p>
        
        <h3 className="text-xl font-semibold text-neutral-800 mb-3">5.1 Browser Settings</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Most browsers allow you to:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>View and delete cookies</li>
          <li>Block third-party cookies</li>
          <li>Block all cookies</li>
          <li>Clear cookies when you close your browser</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">5.2 Impact of Disabling Cookies</h3>
        <div className="bg-accent-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-neutral-700">
            <strong>Warning:</strong> Disabling cookies may affect the functionality of our platform. 
            Some features may not work properly without cookies enabled.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Updates to This Policy</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We may update this Cookie Policy from time to time. We will notify you of any significant changes by 
          posting the new policy on this page with an updated "Last updated" date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Contact Us</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          If you have questions about our use of cookies, please contact us:
        </p>
        <div className="bg-neutral-50 p-4 rounded-lg">
          <p className="text-neutral-700"><strong>Email:</strong> privacy@totaltravelsolution.co.uk</p>
          <p className="text-neutral-700"><strong>Company:</strong> Total Travel Solution Group Limited</p>
          <p className="text-neutral-700"><strong>Company Number:</strong> 16910276</p>
        </div>
      </section>
    </>
  );
}

