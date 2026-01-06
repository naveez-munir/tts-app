'use client';

import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 text-white">
      {/* Gradient Orbs - Animated */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 animate-pulse rounded-full bg-gradient-to-br from-accent-400/30 to-primary-500/20 blur-3xl" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/2 -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-tr from-secondary-400/30 to-primary-500/20 blur-3xl" style={{ animationDuration: '4s', animationDelay: '2s' }} />

      <div className="container relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Main Footer Content - Compact layout */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
          {/* Company Info */}
          <div className="max-w-xs shrink-0">
            <Logo variant="footer" />
            <p className="mt-4 text-sm leading-relaxed text-neutral-300">
              UK's leading booking platform. Connecting customers with trusted transport operators nationwide.
            </p>
            {/* Social Media Links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://facebook.com/totaltravelsolution"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-300 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Follow us on Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://x.com/totaltravelsolution"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-300 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Follow us on X"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/totaltravelsolution"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-300 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links - Compact with fixed widths */}
          <nav className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3 lg:gap-x-16">
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/quote#quote-form" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    Get a Quote
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Operators */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">For Operators</h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/operators" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    Become an Operator
                  </Link>
                </li>
                <li>
                  <Link href="/operators/register" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    Operator Login
                  </Link>
                </li>
                <li>
                  <Link href="/operators#how-it-works" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Legal</h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-neutral-300 transition-colors hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-center text-sm text-neutral-400 lg:text-left">
            © {currentYear} Total Travel Solution Group Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

