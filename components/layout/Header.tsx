'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, CTA_LINKS } from '@/lib/constants';
import { Logo } from './Logo';
import { NavLink } from '@/components/ui/NavLink';

interface HeaderProps {
  /**
   * Header variant:
   * - 'transparent': Transparent header with white text (for dark hero backgrounds)
   * - 'solid': Always solid white header with dark text (for light page backgrounds)
   */
  variant?: 'transparent' | 'solid';
}

export function Header({ variant = 'transparent' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // For solid variant, always show as "scrolled" (dark text, white bg)
  const showSolid = variant === 'solid' || scrolled || mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        showSolid ? 'bg-white shadow-md' : 'bg-transparent'
      )}
    >
      {showSolid && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500" />
      )}

      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between md:h-24">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <button
                type="button"
                className={cn(
                  'relative inline-flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-200',
                  showSolid
                    ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    : 'bg-white/10 text-white hover:bg-white/20'
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <div className="relative h-5 w-5">
                  <span
                    className={cn(
                      'absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300',
                      mobileMenuOpen ? 'top-2 rotate-45' : 'top-0'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition-all duration-300',
                      mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300',
                      mobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'
                    )}
                  />
                </div>
              </button>
            </div>

            <Logo scrolled={showSolid} />
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} scrolled={showSolid}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/sign-in"
              className={cn(
                'rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200',
                showSolid
                  ? 'text-neutral-800 hover:text-primary-600'
                  : 'text-white hover:text-white/80'
              )}
            >
              Sign In
            </Link>
            <Link
              href="/quote#quote-form"
              className="group inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-accent-500/30 transition-all duration-300 hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-600/40"
            >
              Get Quote
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              className={cn(
                'fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl lg:hidden',
                'transform transition-transform duration-[800ms] ease-in-out',
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              )}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4">
                  <span className="text-lg font-bold text-neutral-900">Menu</span>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="flex flex-col gap-2">
                    {NAV_LINKS.map((link) => (
                      <NavLink
                        key={link.href}
                        href={link.href}
                        scrolled={true}
                        mobile
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-200 px-4 py-4">
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/sign-in"
                      className="rounded-xl border-2 border-primary-600 px-6 py-3 text-center text-base font-semibold text-primary-600 transition-all duration-200 hover:bg-primary-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href={CTA_LINKS.GET_QUOTE}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-center text-base font-bold text-white shadow-lg shadow-accent-500/30 transition-all duration-300 hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-600/40"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Quote
                      <svg
                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

