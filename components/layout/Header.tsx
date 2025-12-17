'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, CTA_LINKS } from '@/lib/constants';
import { Logo } from './Logo';
import { NavLink } from '@/components/ui/NavLink';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      )}
    >
      {/* Gradient Border Bottom - only show when scrolled */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500" />
      )}

      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Logo scrolled={scrolled} />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} scrolled={scrolled}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/sign-in"
              className={cn(
                'rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200',
                scrolled
                  ? 'text-neutral-800 hover:text-primary-600'
                  : 'text-white hover:text-white/80'
              )}
            >
              Sign In
            </Link>
            <Link
              href="/quote"
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              className={cn(
                'relative inline-flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-200',
                scrolled
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
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={cn(
              'border-t py-5 lg:hidden',
              scrolled ? 'border-neutral-200 bg-white' : 'border-neutral-200 bg-white'
            )}
          >
            <div className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  scrolled={scrolled}
                  mobile
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="mt-4 flex flex-col gap-3 border-t border-neutral-200 pt-4">
                <Link
                  href="/sign-in"
                  className="rounded-xl px-4 py-3 text-center text-base font-semibold text-neutral-700 transition-all duration-200 hover:bg-neutral-50 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href={CTA_LINKS.GET_QUOTE}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-accent-500/30 transition-all duration-300 hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-600/40"
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
        )}
      </nav>
    </header>
  );
}

