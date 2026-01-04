'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  tooltipText?: string;
  showPulse?: boolean;
  bottomOffset?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = 'Hello! I have a question about transfers.',
  tooltipText = 'Chat with us',
  showPulse = true,
  bottomOffset = 'md',
  className,
}: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTooltipClosed, setIsTooltipClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseTooltip = () => {
    setShowTooltip(false);
    setIsTooltipClosed(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isTooltipClosed) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const bottomOffsets = {
    sm: 'bottom-4 sm:bottom-6',
    md: 'bottom-6 sm:bottom-8',
    lg: 'bottom-8 sm:bottom-10',
  };

  const whatsappUrl = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  return (
    <div
      className={cn(
        'fixed right-4 sm:right-6 z-50',
        bottomOffsets[bottomOffset],
        'animate-in fade-in slide-in-from-bottom-4 duration-500',
        className
      )}
    >
      {/* Tooltip - Positioned above the button, takes no space when hidden */}
      <div
        className={cn(
          'absolute bottom-full mb-3 right-0',
          'hidden sm:block',
          'transition-all duration-300 ease-out',
          showTooltip
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <div className="relative w-72 rounded-2xl bg-white shadow-2xl overflow-hidden">
          <button
            onClick={handleCloseTooltip}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
            aria-label="Close tooltip"
          >
            <X className="h-4 w-4 text-neutral-600" />
          </button>

          <div className="bg-primary-600 px-5 py-3 text-white">
            <div className="text-xs font-semibold tracking-wider mb-0.5">NEED HELP?</div>
            <div className="text-base font-medium">Hi there! 👋</div>
          </div>

          <div className="px-5 py-4 space-y-3">
            <div className="text-center">
              <div className="text-sm text-neutral-600">
                Chat with us on WhatsApp for instant support.
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 px-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg text-center transition-colors text-sm"
            >
              Start Chat
            </a>

            <div className="text-xs text-center text-neutral-500">
              We're here to help!
            </div>
          </div>

          {/* Arrow pointing down to button */}
          <div className="absolute bottom-0 right-4 translate-y-full">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white" />
          </div>
        </div>
      </div>

      {/* WhatsApp Button - Only this takes space */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        aria-label="Chat with us on WhatsApp"
        className={cn(
          'group relative flex items-center justify-center',
          'h-12 w-12 sm:h-14 sm:w-14',
          'rounded-full shadow-xl cursor-pointer',
          'transition-all duration-300 ease-out',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2',
          'bg-[#25D366] hover:bg-[#20BA5C]',
          'hover:scale-110 hover:shadow-2xl hover:shadow-[#25D366]/40',
          'active:scale-105'
        )}
      >
        {showPulse && isTooltipClosed && !showTooltip && (
          <span
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-50"
            style={{ animation: 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite' }}
            aria-hidden="true"
          />
        )}

        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 sm:h-7 sm:w-7 text-white transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}