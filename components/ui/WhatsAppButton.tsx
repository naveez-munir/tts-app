'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppButtonProps {
  /** WhatsApp phone number (with country code, no + or spaces) */
  phoneNumber: string;
  /** Pre-filled message (optional) */
  message?: string;
  /** Tooltip text */
  tooltipText?: string;
  /** Show pulse animation */
  showPulse?: boolean;
  /** Position offset from bottom */
  bottomOffset?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * Floating WhatsApp Chat Button
 * 
 * A professional, accessible floating action button for WhatsApp contact.
 * Fixed position at bottom-right corner with smooth animations.
 * 
 * Uses official WhatsApp brand green (#25D366) for authenticity.
 * Accessible with proper ARIA labels and focus states.
 */
export function WhatsAppButton({
  phoneNumber,
  message = 'Hello! I have a question about airport transfers.',
  tooltipText = 'Chat with us',
  showPulse = true,
  bottomOffset = 'md',
  className,
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Delay appearance for smoother page load
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-show tooltip after a few seconds to draw attention
  useEffect(() => {
    if (isVisible) {
      const tooltipTimer = setTimeout(() => setShowTooltip(true), 4000);
      const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
      return () => {
        clearTimeout(tooltipTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isVisible]);

  const bottomOffsets = {
    sm: 'bottom-4 sm:bottom-6',
    md: 'bottom-6 sm:bottom-8',
    lg: 'bottom-8 sm:bottom-10',
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed right-4 sm:right-6 z-50 flex items-center gap-3',
        bottomOffsets[bottomOffset],
        'animate-in fade-in slide-in-from-bottom-4 duration-500',
        className
      )}
    >
      {/* Tooltip */}
      <div
        className={cn(
          'hidden sm:block rounded-lg bg-neutral-800 px-3 py-2 text-sm font-medium text-white shadow-lg',
          'transition-all duration-300 ease-out',
          isHovered || showTooltip
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-2 pointer-events-none'
        )}
        role="tooltip"
      >
        {tooltipText}
        {/* Tooltip arrow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
          <div className="border-8 border-transparent border-l-neutral-800" />
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label="Chat with us on WhatsApp"
        className={cn(
          'group relative flex items-center justify-center',
          'h-14 w-14 sm:h-16 sm:w-16',
          'rounded-full shadow-xl',
          'transition-all duration-300 ease-out',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2',
          // WhatsApp brand green with hover state
          'bg-[#25D366] hover:bg-[#20BA5C]',
          // Hover scale effect
          'hover:scale-110 hover:shadow-2xl hover:shadow-[#25D366]/40',
          // Active state
          'active:scale-105'
        )}
      >
        {/* Pulse ring animation */}
        {showPulse && (
          <span
            className={cn(
              'absolute inset-0 rounded-full bg-[#25D366]',
              'animate-ping opacity-30'
            )}
            aria-hidden="true"
          />
        )}

        {/* Icon - WhatsApp SVG for authenticity */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 sm:h-8 sm:w-8 text-white transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

