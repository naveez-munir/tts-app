import Link from 'next/link';
import { SignInForm } from '@/components/features/auth/SignInForm';
import { AuthBenefits } from '@/components/features/auth/AuthBenefits';
import { AUTH_PAGE_DATA } from '@/lib/data/auth.data';
import { getIcon } from '@/lib/utils/Icons';

/**
 * Sign In Page Content Component
 * Main content for the sign-in page
 */
export function SignInPageContent() {
  return (
    <>
      <main className="relative flex min-h-screen flex-col bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 lg:justify-center">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Decorative gradient orbs */}
        <div
          className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -left-32 bottom-1/4 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl"
          aria-hidden="true"
        />

        {/* Content Container */}
        <div className="container relative mx-auto w-full overflow-y-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-5xl">
            {/* Back to Home Link */}
            <div className="mb-8 lg:mb-10">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/90 transition-all hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <span
                  className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                  aria-hidden="true"
                >
                  {getIcon('arrow-left')}
                </span>
                Back to Home
              </Link>
            </div>

            {/* Header */}
            <header className="mb-10 text-center lg:mb-12">
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {AUTH_PAGE_DATA.signIn.title}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                {AUTH_PAGE_DATA.signIn.subtitle}
              </p>
            </header>

            {/* Two Column Layout */}
            <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:items-end lg:gap-12 xl:gap-16">
              {/* Left Column - Sign In Form */}
              <div className="flex justify-center">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-white/10 sm:p-8">
                  <SignInForm />
                </div>
              </div>

              {/* Right Column - Benefits */}
              <div className="flex flex-col">
                <header className="mb-5">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Why Sign In?
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
                    Access exclusive features and manage your bookings with ease
                  </p>
                </header>

                <AuthBenefits benefits={AUTH_PAGE_DATA.signIn.benefits} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

