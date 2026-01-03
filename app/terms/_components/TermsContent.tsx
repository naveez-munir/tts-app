/**
 * Terms & Conditions Content Component
 * Contains the actual terms and conditions content
 * Separated for better maintainability and SEO
 */
export function TermsContent() {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Agreement to Terms</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          By accessing and using the Total Travel Solution platform, you agree to be bound by these Terms and Conditions. 
          If you do not agree to these terms, please do not use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Service Description</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Total Travel Solution Group Limited operates a marketplace platform connecting customers with licensed 
          transport operators for airport transfer services across the UK.
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>We facilitate bookings but do not provide transport services directly</li>
          <li>Transport operators are independent contractors</li>
          <li>We use a competitive bidding system for pricing</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Booking and Payment</h2>
        <h3 className="text-xl font-semibold text-neutral-800 mb-3">3.1 Booking Process</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>All bookings must be made through our platform</li>
          <li>Payment is required upfront at the time of booking</li>
          <li>Prices are quoted in GBP and include VAT where applicable</li>
          <li>The lowest bid from qualified operators is automatically accepted</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">3.2 Payment Terms</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Payments are processed securely through Stripe</li>
          <li>We accept major credit and debit cards</li>
          <li>Payment confirmation will be sent via email</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Cancellation and Refunds</h2>
        <h3 className="text-xl font-semibold text-neutral-800 mb-3">4.1 Customer Cancellations</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li><strong>More than 24 hours before pickup:</strong> Full refund</li>
          <li><strong>Less than 24 hours before pickup:</strong> 50% refund</li>
          <li><strong>No-show:</strong> No refund</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">4.2 Operator Cancellations</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          If an operator cancels, we will attempt to find an alternative operator or provide a full refund.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. User Responsibilities</h2>
        <h3 className="text-xl font-semibold text-neutral-800 mb-3">5.1 Customers</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Provide accurate booking information</li>
          <li>Be ready at the specified pickup time</li>
          <li>Notify us of any changes as soon as possible</li>
          <li>Treat operators and vehicles with respect</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">5.2 Operators</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Maintain valid licenses and insurance</li>
          <li>Provide professional service</li>
          <li>Arrive on time for pickups</li>
          <li>Maintain clean and safe vehicles</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Liability</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Total Travel Solution Group Limited acts as an intermediary platform. While we strive to ensure quality service:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>We are not liable for the actions of transport operators</li>
          <li>Operators are responsible for their own insurance</li>
          <li>We do not guarantee availability of services</li>
          <li>Our liability is limited to the booking value</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Intellectual Property</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          All content on our platform, including text, graphics, logos, and software, is the property of 
          Total Travel Solution Group Limited and protected by UK copyright laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Modifications to Service</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We reserve the right to modify or discontinue our services at any time without notice. We will not be 
          liable to you or any third party for any modification, suspension, or discontinuance of the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Governing Law</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          These terms are governed by the laws of England and Wales. Any disputes will be subject to the 
          exclusive jurisdiction of the courts of England and Wales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Changes to Terms</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We may update these Terms and Conditions from time to time. We will notify you of any changes by posting 
          the new terms on this page with an updated "Last updated" date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Contact Information</h2>
        <div className="bg-neutral-50 p-4 rounded-lg">
          <p className="text-neutral-700"><strong>Email:</strong> support@totaltravelsolution.co.uk</p>
          <p className="text-neutral-700"><strong>Company:</strong> Total Travel Solution Group Limited</p>
          <p className="text-neutral-700"><strong>Company Number:</strong> 16910276</p>
        </div>
      </section>
    </>
  );
}

