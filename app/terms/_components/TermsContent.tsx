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
        <p className="text-neutral-700 leading-relaxed mb-4">
          By confirming a booking with Total Travel Solution (Groups), the customer confirms they have read,
          understood, and accepted all policies and Standard Operating Procedures outlined in these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Service Description</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Total Travel Solution is a software-based booking and marketplace platform designed to connect customers
          with independent, locally licenced taxi offices. The company does not provide transport services directly.
        </p>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Our primary functions include:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Receiving booking requests and assigning unique reference numbers</li>
          <li>Facilitating a structured bidding process among licenced operators</li>
          <li>Confirming bookings between customers and licenced operators</li>
          <li>All transport services are carried out by fully licenced third-party taxi offices and drivers</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Booking and Payment</h2>
        <h3 className="text-xl font-semibold text-neutral-800 mb-3">3.1 Booking Process</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>All bookings must be made through our platform (website, mobile, email, or telephone)</li>
          <li>Each booking is assigned a unique, system-generated reference number</li>
          <li>Payment is required upfront at the time of booking</li>
          <li>Prices are quoted in GBP and include VAT where applicable</li>
          <li>The lowest compliant bid from qualified operators is automatically accepted</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">3.2 Payment Terms</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Payments are processed securely through Stripe</li>
          <li>We accept major credit and debit cards</li>
          <li>Payment confirmation will be sent via email</li>
          <li>All additional charges (waiting time, amendments, no-shows) are payable immediately or added to the final invoice</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Booking Cancellation Policy</h2>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Customers wishing to cancel a confirmed booking must inform Total Travel Solution at least <strong>48 hours</strong> prior to the scheduled job time</li>
          <li>Cancellations made within 48 hours of the booking time may be subject to full or partial charges, depending on costs already incurred</li>
          <li>Cancellations must be communicated via phone, email, or official company channels. Informal messages may not be accepted</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">4.1 Operator Cancellations</h3>
        <p className="text-neutral-700 leading-relaxed mb-4">
          If an operator cancels, we will attempt to find an alternative operator or provide a full refund.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. No-Show Policy</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          A No-Show occurs when:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>The customer or passengers fail to attend the pickup location without prior notice, or</li>
          <li>The customer cannot be contacted after reasonable attempts</li>
        </ul>
        <div className="bg-accent-50 border-l-4 border-accent-500 p-4 rounded-r-lg mb-4">
          <p className="text-neutral-700">
            <strong>Important:</strong> In the event of a No-Show, 100% of the booking cost will be charged,
            including driver and vehicle allocation. No refunds will be issued for No-Show bookings.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Waiting Time Policy</h2>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">6.1 Airport Pickup – Flight Arrivals</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>For airport pickups, <strong>60 minutes</strong> of waiting time is provided free of charge from the actual flight landing time</li>
          <li>After the initial 60 minutes, waiting time will be charged at <strong>£0.35 per minute</strong></li>
          <li>Waiting time charges apply due to driver availability, parking, and scheduling impact</li>
          <li>Customers are responsible for providing accurate flight details. Delays caused by incorrect or missing flight information may result in additional charges</li>
        </ul>

        <h3 className="text-xl font-semibold text-neutral-800 mb-3">6.2 Non-Airport Pickup</h3>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>For non-airport pickups, <strong>45 minutes</strong> of waiting time is provided free of charge from the scheduled booking time</li>
          <li>After the initial waiting period, waiting time will be charged at <strong>£0.25 per minute</strong></li>
          <li>If waiting exceeds a reasonable operational limit, the driver may be reassigned, and the booking treated as a No-Show</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Vehicle Fleet & Baggage Allowance</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Customers must ensure the correct vehicle type is booked based on passenger numbers and luggage.
          <strong> Overloading is not permitted.</strong>
        </p>

        <div className="space-y-4">
          <div className="bg-neutral-50 p-4 rounded-lg">
            <h4 className="font-semibold text-neutral-900 mb-2">Saloon Car</h4>
            <p className="text-sm text-neutral-600 mb-2">Ford Mondeo, VW Passat or similar</p>
            <ul className="list-disc pl-6 text-neutral-700 text-sm space-y-1">
              <li>Up to 3 passengers + 3 standard suitcases (23kg max)</li>
              <li>Or 4 passengers + hand luggage only</li>
            </ul>
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg">
            <h4 className="font-semibold text-neutral-900 mb-2">Executive Car</h4>
            <p className="text-sm text-neutral-600 mb-2">Mercedes E-Class or similar</p>
            <ul className="list-disc pl-6 text-neutral-700 text-sm space-y-1">
              <li>Up to 3 passengers + 3 standard suitcases (23kg max)</li>
              <li>Or 4 passengers + hand luggage only</li>
            </ul>
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg">
            <h4 className="font-semibold text-neutral-900 mb-2">Estate Car</h4>
            <p className="text-sm text-neutral-600 mb-2">Volvo Estate, VW Passat or similar</p>
            <ul className="list-disc pl-6 text-neutral-700 text-sm space-y-1">
              <li>Up to 4 passengers + 4 standard suitcases (23kg max)</li>
            </ul>
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg">
            <h4 className="font-semibold text-neutral-900 mb-2">People Carrier</h4>
            <p className="text-sm text-neutral-600 mb-2">VW Sharan, Ford Galaxy or similar</p>
            <ul className="list-disc pl-6 text-neutral-700 text-sm space-y-1">
              <li>Up to 5 passengers + 5 standard suitcases (23kg max)</li>
              <li>Or 6 passengers + hand luggage only</li>
            </ul>
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg">
            <h4 className="font-semibold text-neutral-900 mb-2">Executive People Carrier</h4>
            <p className="text-sm text-neutral-600 mb-2">Mercedes V-Class / Viano or similar</p>
            <ul className="list-disc pl-6 text-neutral-700 text-sm space-y-1">
              <li>Up to 5 passengers + 5 standard suitcases (23kg max)</li>
              <li>Or 6 passengers + hand luggage only</li>
            </ul>
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg">
            <h4 className="font-semibold text-neutral-900 mb-2">8-Seater Minibus</h4>
            <p className="text-sm text-neutral-600 mb-2">VW Transporter or similar</p>
            <ul className="list-disc pl-6 text-neutral-700 text-sm space-y-1">
              <li>Up to 8 passengers + 8 standard suitcases (23kg max)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Child Seats & Booster Seats</h2>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Child seats and booster seats are available upon request, subject to availability</li>
          <li>Requests must be made at the time of booking</li>
          <li>If a confirmed child seat or booster seat is unavailable on the day of travel, a refund for the child seat charge will be issued</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Journey Changes & Amendments</h2>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Last-minute journey changes may be accepted, provided the customer communicates directly with Total Travel Solution</li>
          <li>Any approved journey change will incur a <strong>£15 administration fee</strong>, plus any additional mileage, waiting time, or route costs</li>
          <li>Changes are subject to driver and vehicle availability</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Delays & Liability Disclaimer</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Neither the driver nor Total Travel Solution shall be held liable for delays caused by:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Traffic congestion</li>
          <li>Road closures or accidents</li>
          <li>Weather conditions</li>
          <li>Events outside our reasonable control</li>
        </ul>
        <div className="bg-primary-50 p-4 rounded-lg mb-4">
          <p className="text-neutral-700">
            <strong>Note:</strong> Journey times provided are estimates only and not guaranteed.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">11. Driver & Third-Party Operator Disclaimer</h2>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Where services are provided by a partner driver or third-party operator, Total Travel Solution acts as a booking agent</li>
          <li>Responsibility for vehicle operation remains with the assigned driver or operating company</li>
          <li>Operators are responsible for their own insurance and licensing</li>
          <li>Our liability is limited to the booking value</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">12. Customer Responsibilities</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          Customers must ensure:
        </p>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>Correct pickup address and contact details are provided</li>
          <li>Accurate passenger and luggage information is supplied</li>
          <li>Passengers are ready at the scheduled time</li>
          <li>Clear communication for any changes or issues</li>
          <li>The correct vehicle type is booked based on passenger numbers and luggage</li>
        </ul>
        <div className="bg-accent-50 border-l-4 border-accent-500 p-4 rounded-r-lg">
          <p className="text-neutral-700">
            <strong>Warning:</strong> Failure to comply may result in extra charges or service refusal.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">13. Payments & Refunds</h2>
        <ul className="list-disc pl-6 mb-4 text-neutral-700 space-y-2">
          <li>All additional charges (waiting time, amendments, no-shows) are payable immediately or added to the final invoice</li>
          <li>Refunds are only issued where explicitly stated in these policies</li>
          <li>Refunds will be processed to the original payment method within 5-10 business days</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">14. Intellectual Property</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          All content on our platform, including text, graphics, logos, and software, is the property of
          Total Travel Solution Group Limited and protected by UK copyright laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">15. Modifications to Service</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We reserve the right to modify or discontinue our services at any time without notice. We will not be
          liable to you or any third party for any modification, suspension, or discontinuance of the service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">16. Governing Law</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          These terms are governed by the laws of England and Wales. Any disputes will be subject to the
          exclusive jurisdiction of the courts of England and Wales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">17. Changes to Terms</h2>
        <p className="text-neutral-700 leading-relaxed mb-4">
          We may update these Terms and Conditions from time to time. We will notify you of any changes by posting
          the new terms on this page with an updated &quot;Last updated&quot; date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">18. Contact Information</h2>
        <div className="bg-neutral-50 p-4 rounded-lg">
          <p className="text-neutral-700"><strong>Email:</strong> customerservice@totaltravelsolution.com</p>
          <p className="text-neutral-700"><strong>Company:</strong> Total Travel Solution Group Limited</p>
          <p className="text-neutral-700"><strong>Registered in:</strong> England & Wales</p>
          <p className="text-neutral-700"><strong>Company Number:</strong> 16910276</p>
        </div>
      </section>
    </>
  );
}

