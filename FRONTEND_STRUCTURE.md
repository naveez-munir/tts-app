# FRONTEND STRUCTURE DOCUMENTATION

**Version:** 1.0
**Last Updated:** December 2025
**Framework:** Next.js 16 with App Router
**UI Library:** React 19
**Language:** TypeScript 5
**Styling:** Tailwind CSS 4

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Routing Structure](#routing-structure)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [API Client](#api-client)
7. [Authentication Flow](#authentication-flow)
8. [Form Handling](#form-handling)
9. [Code Examples](#code-examples)

---

## 1. OVERVIEW

### Architecture Principles

- **Server-Side Rendering (SSR)**: SEO-friendly pages with server components
- **Client Components**: Interactive UI with "use client" directive
- **Type Safety**: Strict TypeScript with shared types from backend
- **Component Composition**: Reusable, single-responsibility components
- **Mobile-First**: Responsive design using Tailwind CSS
- **Performance**: Code splitting, lazy loading, optimized images

### Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework with App Router | 16 |
| React | UI library | 19 |
| TypeScript | Type safety | 5 |
| Tailwind CSS | Styling | 4 |
| React Hook Form | Form handling | Latest |
| Zod | Validation | Latest |
| Zustand | State management | Latest |
| Axios | HTTP client | Latest |
| date-fns | Date manipulation | Latest |

---

## 2. DIRECTORY STRUCTURE

### Complete Frontend Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (marketing)/             # Marketing pages (no auth required)
│   │   ├── page.tsx             # Landing page (/)
│   │   ├── about/
│   │   │   └── page.tsx         # About page (/about)
│   │   ├── contact/
│   │   │   └── page.tsx         # Contact page (/contact)
│   │   └── layout.tsx           # Marketing layout (header, footer)
│   │
│   ├── (booking)/               # Booking flow (no auth required initially)
│   │   ├── quote/
│   │   │   └── page.tsx         # Quote calculator (/quote)
│   │   ├── booking/
│   │   │   └── page.tsx         # Booking form (/booking)
│   │   ├── payment/
│   │   │   └── page.tsx         # Payment page (/payment)
│   │   ├── confirmation/
│   │   │   └── page.tsx         # Booking confirmation (/confirmation)
│   │   └── layout.tsx           # Booking flow layout
│   │
│   ├── dashboard/               # Customer dashboard (auth required)
│   │   ├── page.tsx             # Dashboard home (/dashboard)
│   │   ├── bookings/
│   │   │   ├── page.tsx         # Bookings list (/dashboard/bookings)
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Booking details (/dashboard/bookings/:id)
│   │   ├── profile/
│   │   │   └── page.tsx         # User profile (/dashboard/profile)
│   │   └── layout.tsx           # Dashboard layout (sidebar, nav)
│   │
│   ├── operator/                # Operator portal (auth required, OPERATOR role)
│   │   ├── page.tsx             # Operator dashboard (/operator)
│   │   ├── jobs/
│   │   │   ├── page.tsx         # Available jobs (/operator/jobs)
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Job details (/operator/jobs/:id)
│   │   ├── bids/
│   │   │   └── page.tsx         # My bids (/operator/bids)
│   │   ├── earnings/
│   │   │   └── page.tsx         # Earnings & payouts (/operator/earnings)
│   │   ├── fleet/
│   │   │   └── page.tsx         # Vehicle management (/operator/fleet)
│   │   ├── profile/
│   │   │   └── page.tsx         # Operator profile (/operator/profile)
│   │   └── layout.tsx           # Operator layout
│   │
│   ├── admin/                   # Admin panel (auth required, ADMIN role)
│   │   ├── page.tsx             # Admin dashboard (/admin)
│   │   ├── operators/
│   │   │   ├── page.tsx         # Operators list (/admin/operators)
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Operator details (/admin/operators/:id)
│   │   ├── bookings/
│   │   │   ├── page.tsx         # All bookings (/admin/bookings)
│   │   │   └── [id]/
│   │   │       └── page.tsx     # Booking details (/admin/bookings/:id)
│   │   ├── jobs/
│   │   │   └── page.tsx         # All jobs (/admin/jobs)
│   │   ├── pricing/
│   │   │   └── page.tsx         # Pricing rules (/admin/pricing)
│   │   ├── reports/
│   │   │   └── page.tsx         # Financial reports (/admin/reports)
│   │   └── layout.tsx           # Admin layout
│   │
│   ├── auth/                    # Authentication pages (no auth required)
│   │   ├── login/
│   │   │   └── page.tsx         # Login page (/auth/login)
│   │   ├── register/
│   │   │   └── page.tsx         # Registration page (/auth/register)
│   │   ├── forgot-password/
│   │   │   └── page.tsx         # Forgot password (/auth/forgot-password)
│   │   └── reset-password/
│   │       └── page.tsx         # Reset password (/auth/reset-password)
│   │
│   ├── layout.tsx               # Root layout (global providers, fonts)
│   ├── globals.css              # Global styles (Tailwind imports)
│   └── not-found.tsx            # 404 page
│
├── components/                  # React components
│   ├── ui/                      # Reusable UI components (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── ...
```

---

## 3. ROUTING STRUCTURE

### Route Groups and Layouts

Next.js App Router uses **route groups** (folders in parentheses) to organize routes without affecting the URL structure.

#### Marketing Routes (Public)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/` | `app/(marketing)/page.tsx` | Landing page |
| `/about` | `app/(marketing)/about/page.tsx` | About page |
| `/contact` | `app/(marketing)/contact/page.tsx` | Contact page |

**Layout**: `app/(marketing)/layout.tsx` - Includes header and footer

---

#### Booking Flow Routes (Public)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/quote` | `app/(booking)/quote/page.tsx` | Quote calculator |
| `/booking` | `app/(booking)/booking/page.tsx` | Booking form |
| `/payment` | `app/(booking)/payment/page.tsx` | Payment page (Stripe) |
| `/confirmation` | `app/(booking)/confirmation/page.tsx` | Booking confirmation |

**Layout**: `app/(booking)/layout.tsx` - Minimal layout for booking flow

**State Flow**: Quote → Booking → Payment → Confirmation (managed by Zustand)

---

#### Customer Dashboard Routes (Protected - CUSTOMER role)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/dashboard` | `app/dashboard/page.tsx` | Dashboard home |
| `/dashboard/bookings` | `app/dashboard/bookings/page.tsx` | Bookings list |
| `/dashboard/bookings/:id` | `app/dashboard/bookings/[id]/page.tsx` | Booking details |
| `/dashboard/profile` | `app/dashboard/profile/page.tsx` | User profile |

**Layout**: `app/dashboard/layout.tsx` - Sidebar navigation

**Protection**: Middleware checks authentication and CUSTOMER role

---

#### Operator Portal Routes (Protected - OPERATOR role)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/operator` | `app/operator/page.tsx` | Operator dashboard |
| `/operator/jobs` | `app/operator/jobs/page.tsx` | Available jobs |
| `/operator/jobs/:id` | `app/operator/jobs/[id]/page.tsx` | Job details & bidding |
| `/operator/bids` | `app/operator/bids/page.tsx` | My bids |
| `/operator/earnings` | `app/operator/earnings/page.tsx` | Earnings & payouts |
| `/operator/fleet` | `app/operator/fleet/page.tsx` | Vehicle management |
| `/operator/profile` | `app/operator/profile/page.tsx` | Operator profile |

**Layout**: `app/operator/layout.tsx` - Operator-specific sidebar

**Protection**: Middleware checks authentication and OPERATOR role

---

#### Admin Panel Routes (Protected - ADMIN role)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/admin` | `app/admin/page.tsx` | Admin dashboard |
| `/admin/operators` | `app/admin/operators/page.tsx` | Operators list |
| `/admin/operators/:id` | `app/admin/operators/[id]/page.tsx` | Operator details |
| `/admin/bookings` | `app/admin/bookings/page.tsx` | All bookings |
| `/admin/bookings/:id` | `app/admin/bookings/[id]/page.tsx` | Booking details |
| `/admin/jobs` | `app/admin/jobs/page.tsx` | All jobs |
| `/admin/pricing` | `app/admin/pricing/page.tsx` | Pricing rules |
| `/admin/reports` | `app/admin/reports/page.tsx` | Financial reports |

**Layout**: `app/admin/layout.tsx` - Admin-specific sidebar

**Protection**: Middleware checks authentication and ADMIN role

---

#### Authentication Routes (Public)

| Route | File Path | Description |
|-------|-----------|-------------|
| `/auth/login` | `app/auth/login/page.tsx` | Login page |
| `/auth/register` | `app/auth/register/page.tsx` | Registration page |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | Forgot password |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Reset password |

**Layout**: Minimal layout (no header/footer)

---

### Middleware for Route Protection

**File**: `middleware.ts` (root level)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/', '/about', '/contact', '/quote', '/booking', '/payment', '/confirmation', '/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes - check authentication
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role-based access control
  // TODO: Decode JWT to check user role
  // For now, assume token is valid

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 4. COMPONENT ARCHITECTURE

### Component Hierarchy

```
App
├── RootLayout (providers, fonts)
│   ├── MarketingLayout (header, footer)
│   │   └── LandingPage
│   │       ├── Hero
│   │       ├── Features
│   │       ├── HowItWorks
│   │       └── CTA
│   │
│   ├── BookingLayout (minimal)
│   │   └── QuotePage
│   │       └── QuoteForm
│   │           ├── LocationInput (Google Places autocomplete)
│   │           ├── DateTimePicker
│   │           ├── VehicleSelector
│   │           └── QuoteResult
│   │
│   ├── DashboardLayout (sidebar, nav)
│   │   └── BookingsPage
│   │       ├── BookingsList
│   │       │   └── BookingCard
│   │       │       ├── BookingStatusBadge
│   │       │       └── JourneyDetails
│   │       └── Pagination
│   │
│   ├── OperatorLayout (sidebar, nav)
│   │   └── JobsPage
│   │       ├── JobsList
│   │       │   └── JobCard
│   │       │       ├── BiddingCountdown
│   │       │       └── BidButton
│   │       └── BidDialog
│   │           └── BidForm
│   │
│   └── AdminLayout (sidebar, nav)
│       └── AdminDashboard
│           ├── KPICards
│           ├── RecentActivity
│           └── Alerts
```

### Component Categories

#### 1. UI Components (`components/ui/`)

**Purpose**: Reusable, unstyled (or minimally styled) components

**Examples**:
- `Button`: Primary, secondary, outline, ghost variants
- `Input`: Text, email, password, number inputs
- `Card`: Container with header, content, footer
- `Dialog`: Modal dialogs
- `Select`: Dropdown select
- `Table`: Data tables with sorting, pagination

**Characteristics**:
- No business logic
- Highly reusable
- Prop-driven
- Tailwind CSS styled
- TypeScript typed

---

#### 2. Form Components (`components/forms/`)

**Purpose**: Complex forms with validation and state management

**Examples**:
- `QuoteForm`: Quote calculator with Google Maps integration
- `BookingForm`: Booking details collection
- `BidForm`: Bid submission form
- `LoginForm`: Login with email/password

**Characteristics**:
- React Hook Form integration
- Zod validation
- Error handling
- Loading states
- API integration

---

#### 3. Layout Components (`components/layout/`)

**Purpose**: Page structure and navigation

**Examples**:
- `Header`: Site header with navigation
- `Footer`: Site footer with links
- `Sidebar`: Dashboard sidebar navigation
- `Navbar`: Top navigation bar

**Characteristics**:
- Responsive design
- Mobile menu support
- Active link highlighting
- Role-based menu items

---

#### 4. Feature Components (`components/features/`)

**Purpose**: Domain-specific components with business logic

**Examples**:
- `BookingCard`: Display booking summary
- `JobCard`: Display job details for operators
- `BiddingCountdown`: Real-time countdown timer
- `EarningsChart`: Operator earnings visualization

**Characteristics**:
- Business logic included
- API calls (via hooks)
- State management
- Feature-specific styling

---

### Component Best Practices

1. **Single Responsibility**: Each component does one thing well
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Default Props**: Use default values for optional props
5. **Error Boundaries**: Wrap components in error boundaries
6. **Loading States**: Show loading indicators during async operations
7. **Accessibility**: ARIA labels, keyboard navigation, focus management
8. **Responsive**: Mobile-first design with Tailwind breakpoints

---

## 5. STATE MANAGEMENT

### State Management Strategy

| State Type | Solution | Use Case |
|------------|----------|----------|
| **Server State** | React Query (optional) or SWR | API data fetching, caching |
| **Global State** | Zustand | Booking flow, auth state |
| **Local State** | useState | Component-specific state |
| **Form State** | React Hook Form | Form inputs, validation |
| **URL State** | Next.js router | Filters, pagination, search |

---

### Zustand Stores

#### Auth Store (`store/auth-store.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'OPERATOR' | 'ADMIN';
  first_name: string;
  last_name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

#### Booking Store (`store/booking-store.ts`)

```typescript
import { create } from 'zustand';

interface Location {
  address: string;
  postcode: string;
  lat: number;
  lng: number;
}

interface BookingState {
  // Quote data
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  pickupDatetime: string | null;
  passengerCount: number;
  luggageCount: number;
  vehicleType: string | null;
  quotedPrice: number | null;

  // Booking data
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  flightNumber: string;
  specialRequirements: object | null;

  // Actions
  setQuoteData: (data: Partial<BookingState>) => void;
  setBookingData: (data: Partial<BookingState>) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  // Initial state
  pickupLocation: null,
  dropoffLocation: null,
  pickupDatetime: null,
  passengerCount: 1,
  luggageCount: 0,
  vehicleType: null,
  quotedPrice: null,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  flightNumber: '',
  specialRequirements: null,

  // Actions
  setQuoteData: (data) => set((state) => ({ ...state, ...data })),
  setBookingData: (data) => set((state) => ({ ...state, ...data })),
  resetBooking: () => set({
    pickupLocation: null,
    dropoffLocation: null,
    pickupDatetime: null,
    passengerCount: 1,
    luggageCount: 0,
    vehicleType: null,
    quotedPrice: null,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    flightNumber: '',
    specialRequirements: null,
  }),
}));
```

## 6. API CLIENT

### Axios Instance Configuration

**File**: `lib/api/client.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '@/store/auth-store';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    // Token is in httpOnly cookie, so no need to manually add
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only data (unwrap { success, data })
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth state and redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }

    // Return standardized error
    const errorMessage = error.response?.data?.error?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
```

---

### API Service Functions

#### Auth API (`lib/api/auth.ts`)

```typescript
import apiClient from './client';
import { RegisterDto, LoginDto } from '@/lib/validations';

export const authApi = {
  register: async (data: RegisterDto) => {
    return apiClient.post('/auth/register', data);
  },

  login: async (data: LoginDto) => {
    return apiClient.post('/auth/login', data);
  },

  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  me: async () => {
    return apiClient.get('/auth/me');
  },

  forgotPassword: async (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, new_password: string) => {
    return apiClient.post('/auth/reset-password', { token, new_password });
  },
};
```

---

#### Bookings API (`lib/api/bookings.ts`)

```typescript
import apiClient from './client';
import { QuoteRequestDto, CreateBookingDto } from '@/lib/validations';

export const bookingsApi = {
  getQuote: async (data: QuoteRequestDto) => {
    return apiClient.post('/bookings/quote', data);
  },

  createBooking: async (data: CreateBookingDto) => {
    return apiClient.post('/bookings', data);
  },

  getBookings: async (params?: { status?: string; page?: number; limit?: number }) => {
    return apiClient.get('/bookings', { params });
  },

  getBookingById: async (id: string) => {
    return apiClient.get(`/bookings/${id}`);
  },

  updateBooking: async (id: string, data: Partial<CreateBookingDto>) => {
    return apiClient.patch(`/bookings/${id}`, data);
  },

  cancelBooking: async (id: string) => {
    return apiClient.delete(`/bookings/${id}`);
  },
};
```

---

#### Jobs API (`lib/api/jobs.ts`)

```typescript
import apiClient from './client';

export const jobsApi = {
  getJobs: async (params?: { status?: string; page?: number; limit?: number }) => {
    return apiClient.get('/jobs', { params });
  },

  getJobById: async (id: string) => {
    return apiClient.get(`/jobs/${id}`);
  },

  submitDriverDetails: async (jobId: string, data: any) => {
    return apiClient.post(`/operators/jobs/${jobId}/driver-details`, data);
  },
};
```

---

#### Bids API (`lib/api/bids.ts`)

```typescript
import apiClient from './client';
import { CreateBidDto } from '@/lib/validations';

export const bidsApi = {
  submitBid: async (jobId: string, data: CreateBidDto) => {
    return apiClient.post(`/jobs/${jobId}/bids`, data);
  },

  getBids: async (params?: { status?: string; page?: number; limit?: number }) => {
    return apiClient.get('/bids', { params });
  },

  withdrawBid: async (bidId: string) => {
    return apiClient.delete(`/bids/${bidId}`);
  },
};
```

---

## 7. AUTHENTICATION FLOW

### Authentication Process

```
1. User submits login form
   ↓
2. Frontend calls POST /auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend sets httpOnly cookie with JWT
   ↓
5. Frontend receives user data
   ↓
6. Frontend stores user in Zustand (useAuthStore)
   ↓
7. Frontend redirects based on role:
   - CUSTOMER → /dashboard
   - OPERATOR → /operator
   - ADMIN → /admin
```

### Login Component Example

**File**: `components/forms/login-form.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginDto } from '@/lib/validations';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      setError(null);
      const response = await authApi.login(data);
      setUser(response.data.user);

      // Redirect based on role
      const role = response.data.user.role;
      if (role === 'ADMIN') {
        router.push('/admin');
      } else if (role === 'OPERATOR') {
        router.push('/operator');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  );
}
```

---

## 8. FORM HANDLING

### Form Pattern with React Hook Form + Zod

**Example**: Quote Form

**File**: `components/forms/quote-form.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuoteRequestSchema, QuoteRequestDto } from '@/lib/validations';
import { bookingsApi } from '@/lib/api/bookings';
import { useBookingStore } from '@/store/booking-store';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function QuoteForm() {
  const setQuoteData = useBookingStore((state) => state.setQuoteData);
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteRequestDto>({
    resolver: zodResolver(QuoteRequestSchema),
    defaultValues: {
      passenger_count: 1,
      luggage_count: 0,
    },
  });

  const onSubmit = async (data: QuoteRequestDto) => {
    try {
      setLoading(true);
      const response = await bookingsApi.getQuote(data);
      setQuote(response.data);
      setQuoteData({ ...data, quotedPrice: response.data.total_price });
    } catch (error: any) {
      console.error('Quote error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium">Service Type</label>
          <Select {...register('service_type')}>
            <option value="AIRPORT_PICKUP">Airport Pickup</option>
            <option value="AIRPORT_DROPOFF">Airport Drop-off</option>
            <option value="POINT_TO_POINT">Point to Point</option>
          </Select>
          {errors.service_type && (
            <p className="mt-1 text-sm text-red-600">{errors.service_type.message}</p>
          )}
        </div>

        {/* Pickup Location - TODO: Google Places Autocomplete */}
        <div>
          <label className="block text-sm font-medium">Pickup Location</label>
          <Input {...register('pickup_location.address')} placeholder="Enter address" />
          {errors.pickup_location?.address && (
            <p className="mt-1 text-sm text-red-600">{errors.pickup_location.address.message}</p>
          )}
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium">Vehicle Type</label>
          <Select {...register('vehicle_type')}>
            <option value="SALOON">Saloon (1-4 passengers)</option>
            <option value="ESTATE">Estate (1-4 passengers)</option>
            <option value="MPV">MPV (5-6 passengers)</option>
            <option value="EXECUTIVE">Executive (1-4 passengers)</option>
            <option value="MINIBUS">Minibus (7-16 passengers)</option>
          </Select>
        </div>

        {/* Passenger Count */}
        <div>
          <label className="block text-sm font-medium">Passengers</label>
          <Input type="number" {...register('passenger_count', { valueAsNumber: true })} min={1} max={16} />
          {errors.passenger_count && (
            <p className="mt-1 text-sm text-red-600">{errors.passenger_count.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Calculating...' : 'Get Quote'}
        </Button>
      </form>

      {/* Quote Result */}
      {quote && (
        <div className="mt-6 rounded-lg border bg-white p-6">
          <h3 className="text-lg font-semibold">Your Quote</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Distance:</span>
              <span>{quote.distance_miles} miles</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{quote.duration_minutes} minutes</span>
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total Price:</span>
              <span>£{quote.total_price.toFixed(2)}</span>
            </div>
          </div>
          <Button className="mt-4 w-full" onClick={() => router.push('/booking')}>
            Continue to Booking
          </Button>
        </div>
      )}
    </div>
  );
}
```

---

## 9. CODE EXAMPLES

### Example Page: Operator Dashboard

**File**: `app/operator/page.tsx`

```typescript
import { Metadata } from 'next';
import { OperatorStats } from '@/components/features/operator/operator-stats';
import { RecentJobs } from '@/components/features/operator/recent-jobs';
import { PendingPayouts } from '@/components/features/operator/pending-payouts';

export const metadata: Metadata = {
  title: 'Operator Dashboard',
  description: 'Manage your jobs, bids, and earnings',
};

export default async function OperatorDashboardPage() {
  // Server component - fetch data on server
  // const dashboardData = await fetch(`${process.env.API_URL}/operators/dashboard`);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <OperatorStats />

      {/* Recent Jobs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentJobs />
        <PendingPayouts />
      </div>
    </div>
  );
}
```

---

### Example Component: Booking Card

**File**: `components/features/booking/booking-card.tsx`

```typescript
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: {
    id: string;
    booking_reference: string;
    status: string;
    pickup_address: string;
    dropoff_address: string;
    pickup_datetime: string;
    quoted_price: number;
  };
}

export function BookingCard({ booking }: BookingCardProps) {
  const statusColors = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    ASSIGNED: 'bg-purple-100 text-purple-800',
    IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">Booking Reference</p>
          <p className="font-mono text-lg font-semibold">{booking.booking_reference}</p>
        </div>
        <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
          {booking.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <p className="text-sm text-gray-500">Pickup</p>
          <p className="font-medium">{booking.pickup_address}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Drop-off</p>
          <p className="font-medium">{booking.dropoff_address}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date & Time</p>
          <p className="font-medium">{format(new Date(booking.pickup_datetime), 'PPp')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-xl font-bold">£{booking.quoted_price.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
}
```

---

**Document Status**: ✅ Complete
**Next Steps**: Create TAILWIND_THEME.md
│   │   ├── login-form.tsx       # Login form
│   │   ├── register-form.tsx    # Registration form
│   │   ├── bid-form.tsx         # Bid submission form
│   │   └── ...
│   │
│   ├── layout/                  # Layout components
│   │   ├── header.tsx           # Site header
│   │   ├── footer.tsx           # Site footer
│   │   ├── sidebar.tsx          # Dashboard sidebar
│   │   ├── navbar.tsx           # Navigation bar
│   │   └── ...
│   │
│   └── features/                # Feature-specific components
│       ├── booking/
│       │   ├── booking-card.tsx
│       │   ├── booking-status-badge.tsx
│       │   ├── journey-details.tsx
│       │   └── ...
│       ├── job/
│       │   ├── job-card.tsx
│       │   ├── job-list.tsx
│       │   ├── bidding-countdown.tsx
│       │   └── ...
│       ├── operator/
│       │   ├── operator-stats.tsx
│       │   ├── earnings-chart.tsx
│       │   └── ...
│       └── admin/
│           ├── kpi-cards.tsx
│           ├── operator-approval-card.tsx
│           └── ...
│
├── lib/                         # Utility libraries
│   ├── api/                     # API client functions
│   │   ├── client.ts            # Axios instance with interceptors
│   │   ├── auth.ts              # Auth API calls
│   │   ├── bookings.ts          # Bookings API calls
│   │   ├── jobs.ts              # Jobs API calls
│   │   ├── bids.ts              # Bids API calls
│   │   ├── operators.ts         # Operators API calls
│   │   └── admin.ts             # Admin API calls
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts          # Authentication hook
│   │   ├── use-booking.ts       # Booking state hook
│   │   ├── use-debounce.ts      # Debounce hook
│   │   ├── use-media-query.ts   # Responsive hook
│   │   └── ...
│   │
│   ├── utils/                   # Utility functions
│   │   ├── format.ts            # Formatting (currency, date, etc.)
│   │   ├── validation.ts        # Validation helpers
│   │   ├── constants.ts         # App constants
│   │   └── ...
│   │
│   └── validations/             # Zod schemas (imported from shared-types)
│       └── index.ts             # Re-export shared schemas
│
├── store/                       # Zustand stores
│   ├── auth-store.ts            # Auth state
│   ├── booking-store.ts         # Booking flow state
│   └── ...
│
├── types/                       # Frontend-specific types
│   ├── index.ts                 # Main types export
│   └── ...
│
├── public/                      # Static assets
│   ├── images/
│   ├── icons/
│   └── ...
│
├── .env.local                   # Environment variables
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies


