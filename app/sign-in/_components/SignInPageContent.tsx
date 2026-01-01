import Link from 'next/link';
import { SignInForm } from '@/components/features/auth/SignInForm';
import { AuthBenefits } from '@/components/features/auth/AuthBenefits';
import { AUTH_PAGE_DATA } from '@/lib/data/auth.data';

/**
 * Sign In Page Content Component
 * Main content for the sign-in page
 */
export function SignInPageContent() {
  return (
    <>
      <main className="relative flex h-screen flex-col bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 lg:justify-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Content Container */}
        <div className="container relative mx-auto w-full overflow-y-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-0">
          <div className="mx-auto max-w-5xl">
            {/* Back to Home Link */}
            <div className="mb-6 lg:mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition-colors hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8 text-center lg:mb-10">
              <h1 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
                {AUTH_PAGE_DATA.signIn.title}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-base text-white/80 sm:text-lg lg:mt-4">
                {AUTH_PAGE_DATA.signIn.subtitle}
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid gap-8 lg:grid-cols-[440px_1fr] lg:gap-10 xl:gap-12">
              {/* Left Column - Sign In Form */}
              <div className="flex items-start justify-center lg:items-center">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-neutral-200 sm:p-8 lg:w-full">
                  <SignInForm />
                </div>
              </div>

              {/* Right Column - Benefits */}
              <div className="flex flex-col justify-end">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-white sm:text-2xl lg:text-2xl">
                    Why Sign In?
                  </h2>
                  <p className="mt-2 text-sm text-white/80 lg:text-base">
                    Access exclusive features and manage your bookings with ease
                  </p>
                </div>

                <AuthBenefits benefits={AUTH_PAGE_DATA.signIn.benefits} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

