'use client';

import { SVGProps } from 'react';

interface VehicleIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Saloon/Sedan Vehicle Icon
 * Standard 4-door sedan car
 */
export function SaloonIcon({ className = 'w-20 h-12', ...props }: VehicleIconProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* Car body */}
      <path
        d="M15 40 L20 25 L35 18 L80 18 L100 25 L105 40 L105 45 L15 45 L15 40Z"
        fill="#374151"
        stroke="#1f2937"
        strokeWidth="1.5"
      />
      {/* Roof/cabin */}
      <path
        d="M30 25 L38 12 L78 12 L88 25 Z"
        fill="#60a5fa"
        stroke="#3b82f6"
        strokeWidth="1"
      />
      {/* Windows */}
      <path d="M35 23 L40 14 L55 14 L55 23 Z" fill="#93c5fd" />
      <path d="M58 23 L58 14 L75 14 L82 23 Z" fill="#93c5fd" />
      {/* Headlights */}
      <rect x="100" y="32" width="5" height="6" rx="1" fill="#fbbf24" />
      <rect x="15" y="32" width="5" height="6" rx="1" fill="#fbbf24" />
      {/* Wheels */}
      <circle cx="32" cy="45" r="9" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      <circle cx="32" cy="45" r="4" fill="#6b7280" />
      <circle cx="88" cy="45" r="9" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      <circle cx="88" cy="45" r="4" fill="#6b7280" />
      {/* Door handle */}
      <rect x="55" y="30" width="8" height="2" rx="1" fill="#9ca3af" />
    </svg>
  );
}

/**
 * Estate/Station Wagon Vehicle Icon
 * Extended rear cargo area
 */
export function EstateIcon({ className = 'w-20 h-12', ...props }: VehicleIconProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* Car body */}
      <path
        d="M15 40 L20 25 L35 18 L95 18 L105 25 L105 45 L15 45 L15 40Z"
        fill="#4b5563"
        stroke="#374151"
        strokeWidth="1.5"
      />
      {/* Roof/cabin - extended back */}
      <path
        d="M30 25 L38 12 L95 12 L95 25 Z"
        fill="#60a5fa"
        stroke="#3b82f6"
        strokeWidth="1"
      />
      {/* Windows */}
      <path d="M35 23 L40 14 L55 14 L55 23 Z" fill="#93c5fd" />
      <path d="M58 23 L58 14 L72 14 L72 23 Z" fill="#93c5fd" />
      <path d="M75 23 L75 14 L92 14 L92 23 Z" fill="#93c5fd" opacity="0.8" />
      {/* Headlights */}
      <rect x="100" y="32" width="5" height="6" rx="1" fill="#fbbf24" />
      <rect x="15" y="32" width="5" height="6" rx="1" fill="#fbbf24" />
      {/* Wheels */}
      <circle cx="32" cy="45" r="9" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      <circle cx="32" cy="45" r="4" fill="#6b7280" />
      <circle cx="88" cy="45" r="9" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      <circle cx="88" cy="45" r="4" fill="#6b7280" />
      {/* Roof rack hint */}
      <line x1="45" y1="11" x2="85" y2="11" stroke="#9ca3af" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * MPV/People Carrier Vehicle Icon
 * Larger family vehicle
 */
export function MpvIcon({ className = 'w-20 h-12', ...props }: VehicleIconProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* Car body - taller */}
      <path
        d="M12 42 L15 28 L25 15 L95 15 L105 28 L108 42 L108 47 L12 47 L12 42Z"
        fill="#6366f1"
        stroke="#4f46e5"
        strokeWidth="1.5"
      />
      {/* Roof/cabin - tall */}
      <path
        d="M22 28 L28 8 L92 8 L98 28 Z"
        fill="#818cf8"
        stroke="#6366f1"
        strokeWidth="1"
      />
      {/* Windows - multiple rows */}
      <path d="M28 26 L32 10 L48 10 L48 26 Z" fill="#c7d2fe" />
      <path d="M52 26 L52 10 L70 10 L70 26 Z" fill="#c7d2fe" />
      <path d="M74 26 L74 10 L90 10 L94 26 Z" fill="#c7d2fe" />
      {/* Sliding door hint */}
      <line x1="51" y1="28" x2="51" y2="42" stroke="#4f46e5" strokeWidth="1" />
      {/* Headlights */}
      <rect x="102" y="34" width="5" height="6" rx="1" fill="#fbbf24" />
      <rect x="13" y="34" width="5" height="6" rx="1" fill="#fbbf24" />
      {/* Wheels */}
      <circle cx="30" cy="47" r="10" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      <circle cx="30" cy="47" r="5" fill="#6b7280" />
      <circle cx="90" cy="47" r="10" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      <circle cx="90" cy="47" r="5" fill="#6b7280" />
    </svg>
  );
}

/**
 * Executive/Luxury Vehicle Icon
 * Premium sedan with sleek design
 */
export function ExecutiveIcon({ className = 'w-20 h-12', ...props }: VehicleIconProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* Car body - sleek */}
      <path
        d="M10 42 L18 26 L35 16 L85 16 L102 26 L110 42 L110 46 L10 46 L10 42Z"
        fill="#0f172a"
        stroke="#1e293b"
        strokeWidth="1.5"
      />
      {/* Roof/cabin - low profile */}
      <path
        d="M32 26 L42 11 L78 11 L92 26 Z"
        fill="#334155"
        stroke="#475569"
        strokeWidth="1"
      />
      {/* Tinted windows */}
      <path d="M38 24 L45 13 L58 13 L58 24 Z" fill="#475569" />
      <path d="M62 24 L62 13 L75 13 L86 24 Z" fill="#475569" />
      {/* Chrome trim */}
      <line x1="32" y1="26" x2="92" y2="26" stroke="#94a3b8" strokeWidth="1" />
      {/* Headlights - LED style */}
      <rect x="104" y="32" width="6" height="4" rx="1" fill="#f8fafc" />
      <rect x="10" y="32" width="6" height="4" rx="1" fill="#f8fafc" />
      {/* Tail lights */}
      <rect x="104" y="37" width="6" height="3" rx="1" fill="#ef4444" />
      {/* Wheels - larger */}
      <circle cx="32" cy="46" r="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
      <circle cx="32" cy="46" r="5" fill="#334155" />
      <circle cx="88" cy="46" r="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
      <circle cx="88" cy="46" r="5" fill="#334155" />
      {/* Star emblem */}
      <circle cx="60" cy="36" r="3" fill="#94a3b8" />
    </svg>
  );
}

/**
 * Executive Luxury Vehicle Icon
 * Mercedes S-Class style luxury sedan
 */
export function ExecutiveLuxuryIcon({ className = 'w-20 h-12', ...props }: VehicleIconProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* Car body - long, sleek luxury sedan */}
      <path
        d="M8 42 L15 24 L32 14 L88 14 L105 24 L112 42 L112 46 L8 46 L8 42Z"
        fill="#1e1b4b"
        stroke="#312e81"
        strokeWidth="1.5"
      />
      {/* Roof/cabin - elegant curve */}
      <path
        d="M30 24 L40 9 L80 9 L94 24 Z"
        fill="#3730a3"
        stroke="#4338ca"
        strokeWidth="1"
      />
      {/* Tinted windows - premium */}
      <path d="M36 22 L43 11 L58 11 L58 22 Z" fill="#4c1d95" />
      <path d="M62 22 L62 11 L77 11 L88 22 Z" fill="#4c1d95" />
      {/* Chrome trim - premium */}
      <line x1="30" y1="24" x2="94" y2="24" stroke="#c4b5fd" strokeWidth="1.5" />
      <line x1="15" y1="38" x2="105" y2="38" stroke="#c4b5fd" strokeWidth="0.75" />
      {/* LED headlights */}
      <rect x="106" y="30" width="6" height="3" rx="1" fill="#f8fafc" />
      <rect x="8" y="30" width="6" height="3" rx="1" fill="#f8fafc" />
      {/* Tail lights */}
      <rect x="106" y="35" width="6" height="4" rx="1" fill="#dc2626" />
      {/* Premium wheels */}
      <circle cx="32" cy="46" r="10" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
      <circle cx="32" cy="46" r="5" fill="#6366f1" />
      <circle cx="88" cy="46" r="10" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
      <circle cx="88" cy="46" r="5" fill="#6366f1" />
      {/* Star emblem */}
      <circle cx="60" cy="34" r="4" fill="#c4b5fd" />
      <circle cx="60" cy="34" r="2" fill="#8b5cf6" />
    </svg>
  );
}

/**
 * Executive People Carrier Vehicle Icon
 * Mercedes V-Class style luxury MPV
 */
export function ExecutivePeopleCarrierIcon({ className = 'w-20 h-12', ...props }: VehicleIconProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* Body - premium tall */}
      <path
        d="M10 44 L13 26 L22 12 L98 12 L107 26 L110 44 L110 48 L10 48 L10 44Z"
        fill="#1e1b4b"
        stroke="#312e81"
        strokeWidth="1.5"
      />
      {/* Roof/cabin - luxury tall */}
      <path
        d="M20 26 L26 6 L94 6 L100 26 Z"
        fill="#3730a3"
        stroke="#4338ca"
        strokeWidth="1"
      />
      {/* Premium tinted windows */}
      <path d="M26 24 L30 8 L46 8 L46 24 Z" fill="#4c1d95" />
      <path d="M50 24 L50 8 L68 8 L68 24 Z" fill="#4c1d95" />
      <path d="M72 24 L72 8 L90 8 L94 24 Z" fill="#4c1d95" />
      {/* Chrome trim */}
      <line x1="20" y1="26" x2="100" y2="26" stroke="#c4b5fd" strokeWidth="1.5" />
      {/* Sliding door */}
      <line x1="49" y1="26" x2="49" y2="44" stroke="#4338ca" strokeWidth="1" />
      {/* LED headlights */}
      <rect x="104" y="32" width="5" height="4" rx="1" fill="#f8fafc" />
      <rect x="11" y="32" width="5" height="4" rx="1" fill="#f8fafc" />
      {/* Tail lights */}
      <rect x="104" y="38" width="5" height="3" rx="1" fill="#dc2626" />
      {/* Premium wheels */}
      <circle cx="28" cy="48" r="10" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
      <circle cx="28" cy="48" r="5" fill="#6366f1" />
      <circle cx="92" cy="48" r="10" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
      <circle cx="92" cy="48" r="5" fill="#6366f1" />
      {/* Star emblem */}
      <circle cx="60" cy="36" r="3" fill="#c4b5fd" />
    </svg>
  );
}

/**
 * Green Car / Electric Vehicle Icon
 * Tesla/EV style with eco accents
 */
export function GreenCarIcon({ className = 'w-20 h-12', ...props }: VehicleIconProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* Car body - sleek EV design */}
      <path
        d="M12 42 L18 26 L35 16 L85 16 L102 26 L108 42 L108 46 L12 46 L12 42Z"
        fill="#166534"
        stroke="#15803d"
        strokeWidth="1.5"
      />
      {/* Roof/cabin - aerodynamic */}
      <path
        d="M32 26 L42 11 L78 11 L92 26 Z"
        fill="#22c55e"
        stroke="#16a34a"
        strokeWidth="1"
      />
      {/* Windows - modern tint */}
      <path d="M38 24 L45 13 L58 13 L58 24 Z" fill="#86efac" />
      <path d="M62 24 L62 13 L75 13 L86 24 Z" fill="#86efac" />
      {/* Chrome/eco trim */}
      <line x1="32" y1="26" x2="92" y2="26" stroke="#bbf7d0" strokeWidth="1" />
      {/* LED headlights */}
      <rect x="102" y="32" width="6" height="4" rx="1" fill="#f8fafc" />
      <rect x="12" y="32" width="6" height="4" rx="1" fill="#f8fafc" />
      {/* Tail lights */}
      <rect x="102" y="37" width="6" height="3" rx="1" fill="#ef4444" />
      {/* EV charging port hint */}
      <rect x="14" y="26" width="4" height="4" rx="1" fill="#4ade80" />
      {/* Eco wheels */}
      <circle cx="32" cy="46" r="10" fill="#14532d" stroke="#166534" strokeWidth="2" />
      <circle cx="32" cy="46" r="5" fill="#22c55e" />
      <circle cx="88" cy="46" r="10" fill="#14532d" stroke="#166534" strokeWidth="2" />
      <circle cx="88" cy="46" r="5" fill="#22c55e" />
      {/* Leaf/eco emblem */}
      <ellipse cx="60" cy="35" rx="4" ry="3" fill="#4ade80" />
      <path d="M60 32 Q62 35 60 38" stroke="#166534" strokeWidth="0.75" fill="none" />
    </svg>
  );
}

/**
 * Minibus Vehicle Icon
 * Large group transport vehicle
 */
export function MinibusIcon({ className = 'w-20 h-12', ...props }: VehicleIconProps) {
  return (
    <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      {/* Body - tall and long */}
      <path
        d="M8 44 L8 18 L15 10 L105 10 L112 18 L112 44 L112 48 L8 48 L8 44Z"
        fill="#f59e0b"
        stroke="#d97706"
        strokeWidth="1.5"
      />
      {/* Windshield */}
      <path
        d="M100 18 L105 12 L105 28 L100 28 Z"
        fill="#fef3c7"
        stroke="#f59e0b"
        strokeWidth="0.5"
      />
      {/* Side windows - multiple */}
      <rect x="14" y="14" width="12" height="14" rx="1" fill="#fef3c7" />
      <rect x="30" y="14" width="12" height="14" rx="1" fill="#fef3c7" />
      <rect x="46" y="14" width="12" height="14" rx="1" fill="#fef3c7" />
      <rect x="62" y="14" width="12" height="14" rx="1" fill="#fef3c7" />
      <rect x="78" y="14" width="12" height="14" rx="1" fill="#fef3c7" />
      {/* Door */}
      <rect x="92" y="14" width="10" height="30" rx="1" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      {/* Door window */}
      <rect x="94" y="16" width="6" height="10" rx="1" fill="#fef3c7" />
      {/* Headlights */}
      <rect x="106" y="22" width="5" height="5" rx="1" fill="#fef3c7" />
      <rect x="9" y="22" width="4" height="5" rx="1" fill="#fbbf24" />
      {/* Wheels - larger */}
      <circle cx="28" cy="48" r="11" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      <circle cx="28" cy="48" r="5" fill="#6b7280" />
      <circle cx="92" cy="48" r="11" fill="#1f2937" stroke="#111827" strokeWidth="2" />
      <circle cx="92" cy="48" r="5" fill="#6b7280" />
      {/* Step */}
      <rect x="92" y="44" width="10" height="4" fill="#d97706" />
    </svg>
  );
}

/**
 * Get vehicle icon component by vehicle type
 */
export function getVehicleIcon(vehicleType: string): React.ComponentType<VehicleIconProps> {
  const icons: Record<string, React.ComponentType<VehicleIconProps>> = {
    SALOON: SaloonIcon,
    ESTATE: EstateIcon,
    GREEN_CAR: GreenCarIcon,
    MPV: MpvIcon,
    EXECUTIVE: ExecutiveIcon,
    EXECUTIVE_LUXURY: ExecutiveLuxuryIcon,
    EXECUTIVE_PEOPLE_CARRIER: ExecutivePeopleCarrierIcon,
    MINIBUS: MinibusIcon,
  };
  return icons[vehicleType] || SaloonIcon;
}
