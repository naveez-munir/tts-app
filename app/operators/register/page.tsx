import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OperatorRegistrationForm } from '@/components/features/operators/OperatorRegistrationForm';

export const metadata: Metadata = {
  title: 'Operator Registration - Total Travel Solution',
  description: 'Register as a transport operator and join our network. Start receiving airport transfer jobs and grow your business with Total Travel Solution.',
  keywords: [
    'operator registration',
    'transport operator signup',
    'join transport network',
    'airport transfer operator',
    'private hire registration',
  ],
};

export default function OperatorRegisterPage() {
  return (
    <>
      <Header variant="solid" />

      <main className="min-h-screen bg-neutral-50 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl lg:text-5xl">
              Join Our Operator Network
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 sm:text-xl">
              Register your transport business and start receiving airport transfer jobs across the UK
            </p>
          </div>

          {/* Registration Form */}
          <div className="flex justify-center">
            <OperatorRegistrationForm />
          </div>

          {/* Already Registered Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="font-semibold text-primary-600 hover:text-primary-700 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3 lg:mt-16">
            <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-neutral-200">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-neutral-900">Quick Approval</h3>
              <p className="mt-1 text-sm text-neutral-600">Reviewed within 48 hours</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-neutral-200">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
                <svg className="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-neutral-900">Secure Platform</h3>
              <p className="mt-1 text-sm text-neutral-600">Your data is protected</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-neutral-200">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100">
                <svg className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-neutral-900">24/7 Support</h3>
              <p className="mt-1 text-sm text-neutral-600">We're here to help</p>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-700 p-8 text-center lg:mt-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Need Help?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-primary-100">
              Our team is ready to assist you with the registration process. Contact us if you have any questions.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-primary-600 shadow-lg transition-all hover:bg-neutral-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </Link>
              <a
                href="tel:+442012345678"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +44 20 1234 5678
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

