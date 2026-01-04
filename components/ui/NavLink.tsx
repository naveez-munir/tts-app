'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnchorHTMLAttributes } from 'react';

interface NavLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  scrolled?: boolean;
  mobile?: boolean;
  onClick?: () => void;
}

export function NavLink({ href, scrolled = false, mobile = false, className, children, onClick, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseStyles = 'rounded-lg font-semibold transition-all duration-200';

  const desktopStyles = isActive
    ? scrolled
      ? 'text-white bg-primary-600 shadow-md'
      : 'text-neutral-900 bg-white'
    : scrolled
      ? 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
      : 'text-white hover:bg-white/10 hover:text-white';

  const mobileStyles = isActive
    ? 'text-white bg-primary-600 shadow-md'
    : scrolled
      ? 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
      : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-700';

  const sizeStyles = mobile ? 'px-4 py-3 text-base' : 'px-4 py-2.5 text-sm';

  return (
    <Link
      href={href}
      className={cn(baseStyles, mobile ? mobileStyles : desktopStyles, sizeStyles, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Link>
  );
}

