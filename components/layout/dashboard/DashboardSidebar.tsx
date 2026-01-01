'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, User, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  branding: {
    icon: LucideIcon;
    title: string;
    href: string;
  };
  user?: {
    name: string;
    email: string;
  };
  onLogout: () => void;
  /** Footer nav items (e.g., Settings) */
  footerItems?: NavItem[];
}

export default function DashboardSidebar({
  isOpen,
  onClose,
  navItems,
  branding,
  user,
  onLogout,
  footerItems,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const BrandIcon = branding.icon;

  const isActiveRoute = (href: string) => {
    // For root dashboard routes, only match exactly
    const isRootRoute = href === '/admin' || href === '/operator/dashboard' || href === '/dashboard';
    if (isRootRoute) {
      return pathname === href;
    }
    // For other routes, match the path or any sub-paths
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-primary-900 text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-800">
          <Link href={branding.href} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary-500 rounded-lg flex items-center justify-center">
              <BrandIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">{branding.title}</span>
          </Link>
          
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-primary-800 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-colors duration-200 text-sm font-medium
                  ${isActive
                    ? 'bg-secondary-600 text-white'
                    : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer items (e.g., Settings) */}
        {footerItems && footerItems.length > 0 && (
          <div className="px-3 py-2 border-t border-primary-800">
            {footerItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-200 hover:bg-primary-800 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* User section */}
        <div className="p-3 border-t border-primary-800">
          {user && (
            <div className="mb-2 flex items-center gap-3 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-700">
                <User className="h-4 w-4 text-primary-200" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user.name}</p>
                <p className="truncate text-xs text-primary-300">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

