I need you to establish comprehensive project scope documentation and architectural guidelines for this Airport Transfer Booking Platform project before any development begins. This documentation will serve as the single source of truth for all future development decisions.

**CONFIRMED ARCHITECTURE: Separate Backend and Frontend Applications**

You will proceed with **Option B: Separate Backend Application**:
- **Frontend**: Next.js 16 application with App Router, React 19, TypeScript 5
- **Backend**: Separate Node.js/Express API server with TypeScript
- **Communication**: RESTful API with JSON responses
- **Shared Types**: Create a shared TypeScript types package/directory that both applications can reference
- **Deployments**: 
  - Frontend: Vercel
  - Backend: Railway or Render
  - Database: Supabase or Railway PostgreSQL
  - Redis: Upstash or Railway Redis (for Bull/BullMQ job queue)

---

**DOCUMENTATION REQUIREMENTS**

Create a comprehensive `CLAUDE.md` file in the project root that will guide all future development. This file must include the following sections:

**Section 1: Project Overview**
- Brief description: Marketplace platform connecting customers seeking airport transfers with registered transport operators across the UK
- Business model: Asset-light aggregator using a bidding system where operators compete for jobs; platform earns commission (customer price minus winning bid)
- Core differentiator: Automated bidding system where all operators receive job notifications and lowest bid wins
- Target completion timeline: 10-12 weeks for MVP

**Section 2: Definitive Feature Scope**

*Features TO IMPLEMENT (MVP Phase):*

**Customer Booking Flow:**
- Journey input form with fields: pickup location, drop-off location, date/time, passenger count (1-16+), luggage count, vehicle type selection, special requirements (child seats, wheelchair access, pets), flight number (text field only - no API integration), return journey option, via points/multiple stops
- Address autocomplete using Google Maps Places API
- Real-time quote generation using Google Maps Distance Matrix API
- Quote calculation engine with: base fare + distance-based pricing + vehicle type multipliers + time-based surcharges (night rates, peak hours) + holiday surcharges (50% markup for Christmas/New Year) + airport fees + tolls + return journey discount (5%)
- Customer details collection (name, email, phone, passenger contact info)
- Secure payment via Stripe (card, Apple Pay, Google Pay) with 3D Secure authentication
- Booking reference generation (unique alphanumeric code)
- Instant email confirmation with complete booking details

**Bidding System (Core Feature):**
- Automatic job broadcasting to ALL registered operators in the service area upon customer payment completion
- Job details shared with operators: pickup/drop-off locations, date/time, vehicle type required, passenger count, luggage count, special requirements
- Customer-paid price displayed as maximum ceiling for bids
- Email and SMS notifications to operators about new available jobs
- Operator bid submission interface (operators enter their price to fulfill the job)
- Bid validation: must be equal to or less than customer-paid price
- Configurable bidding window (2-24 hours based on job urgency/lead time)
- Real-time bid tracking visible to admin
- Automatic winner selection: lowest bid wins (with operator reputation score as tiebreaker)
- Job locking to winning operator
- Platform margin calculation: Customer Price - Winning Bid
- Fallback mechanism: if no bids received within window, escalate to admin for manual assignment
- Customer notification if job cannot be fulfilled with automatic full refund

**Transport Company Portal:**
- Registration form with: company name, registration number, VAT number, operating license upload, insurance documentation upload, service areas selection (postcodes/regions), available vehicle types
- Admin approval workflow (pending → approved → active)
- Dashboard showing: available jobs in service area, active bids, won/assigned jobs, completed jobs, earnings summary
- Bid submission interface for available jobs
- Driver details submission form for assigned jobs (driver name, phone number, vehicle registration)
- Job completion marking
- Earnings dashboard with job history
- Bank details management for payouts
- Invoice generation

**Admin Panel:**
- Dashboard with KPIs: total bookings, revenue, active operators, pending approvals, active bids
- Operator management: approve/reject registrations, view operator profiles, suspend/activate operators, view operator performance ratings
- Booking management: view all bookings, modify bookings, cancel bookings, process refunds
- Bidding monitoring: real-time view of all active bids, manual job assignment capability, override automatic winner selection
- Pricing rules configuration: base fares by vehicle type, per-mile rates, time-based surcharges, holiday surcharge dates and percentages, airport fees
- Financial reports: revenue by period, operator payouts, commission earned, refunds processed
- Customer support tools: booking search, customer history, communication logs
- Payout management: schedule configuration (weekly/bi-weekly), payout processing, payout history

**Payment Processing:**
- Stripe integration for customer payments (full amount collected upfront)
- Payment intent creation with proper metadata
- Webhook handling for payment confirmation
- Operator payout system (Stripe Connect or manual bank transfers)
- Payout scheduling (weekly or bi-weekly configurable)
- Refund processing for cancelled/unfulfilled bookings
- Transaction history and reconciliation

**Google Maps Integration:**
- Places API for address autocomplete and validation
- Distance Matrix API for distance and duration calculation
- Geocoding API for converting addresses to coordinates
- Proper error handling for API failures
- Caching strategy to minimize API costs

**Notification System:**
- Email notifications via SendGrid or Mailgun:
  - Customer: Booking acknowledgement, journey details (with driver info), booking modifications, cancellations
  - Operator: New job alerts, bid won notification, job assignment, payment confirmation
  - Admin: No bids received alert, operator registration pending, dispute notifications
- SMS notifications via Twilio:
  - Customer: Booking confirmation with reference number, journey details 24 hours before pickup
  - Operator: Urgent job alerts, bid won notification
- Notification preferences management
- Notification delivery tracking and retry logic

**Service Types:**
- Airport Pickup (with flight number collection, terminal selection, meet & greet option)
- Airport Drop-off (with terminal selection, recommended 2-hour buffer)
- Point-to-Point transfers (any location to any location with via points support)

**Vehicle Types:**
- Saloon (1-4 passengers)
- Estate (1-4 passengers with extra luggage)
- MPV/People Carrier (5-6 passengers)
- Executive (premium 1-4 passengers)
- Minibus (7-16 passengers)

**Authentication & Authorization:**
- Multi-role authentication system using NextAuth.js or Clerk
- Roles: Customer, Transport Operator, Admin
- Role-based access control (RBAC) for all API endpoints
- Secure session management
- Password reset functionality
- Email verification for new accounts

*Features EXPLICITLY OUT OF SCOPE (DO NOT IMPLEMENT):*
- ❌ Flight tracking API integration (AviationStack, FlightAware, OpenSky)
- ❌ Automatic flight status monitoring and polling
- ❌ Auto-adjustment of pickup times based on real-time flight delays/early arrivals
- ❌ Terminal and gate information display
- ❌ Driver mobile application
- ❌ Real-time GPS tracking of drivers during journey
- ❌ Driver dashboard or driver management interface
- ❌ Vehicle dispatch management system
- ❌ In-app chat or messaging between customers/operators/drivers
- ❌ Customer loyalty programs or points system
- ❌ Referral systems or affiliate programs
- ❌ Multi-language support (English only for MVP)
- ❌ Multi-currency support (GBP £ only for MVP)
- ❌ Corporate account management with monthly invoicing
- ❌ Event bookings or group booking management
- ❌ Itinerary management
- ❌ Customer reviews and ratings system (collect data but no public display)
- ❌ Operator public profiles or marketplace browsing
- ❌ Dynamic pricing based on demand
- ❌ Surge pricing
- ❌ Promotional codes or discount coupons

**Section 3: Strict Scope Control Rules for AI Development**

When working on this project, you (the AI assistant) MUST adhere to these rules:

- ✋ **NO feature suggestions** beyond the defined scope during development
- ✋ **NO "nice to have" additions** or enhancements unless explicitly requested
- ✋ **NO future-proofing** beyond the current requirements (e.g., don't add fields "for future use")
- ✋ **NO over-engineering** - implement the simplest solution that meets requirements
- ✅ **Flight number field** should be collected and stored as plain text only (VARCHAR/TEXT) - no API integration, no validation beyond format
- ✅ **Focus exclusively** on delivering the defined MVP features
- ✅ **Any scope changes** must be explicitly approved by the user and documented in this file
- ✅ **When in doubt**, ask the user rather than making assumptions or adding features
- ✅ **Prioritize completion** over perfection - working MVP is better than incomplete feature-rich application

**Section 4: Architecture & Technical Stack**

**Architecture: Separate Backend and Frontend**

**Frontend Application:**
- Framework: Next.js 16 with App Router
- UI Library: React 19
- Language: TypeScript 5 (strict mode enabled)
- Styling: Tailwind CSS 4
- Form Handling: React Hook Form with Zod validation
- State Management: React Context API + Zustand (for complex state like booking flow)
- HTTP Client: Axios or native fetch with custom wrapper
- Authentication: NextAuth.js client-side integration or Clerk
- Deployment: Vercel

**Backend Application:**
- Runtime: Node.js 20+ LTS
- Framework: Express.js with TypeScript
- Language: TypeScript 5 (strict mode enabled)
- Database: PostgreSQL 15+
- ORM: Prisma 5+
- Authentication: NextAuth.js (if using) or Clerk backend SDK or JWT-based custom auth
- Job Queue: Bull or BullMQ with Redis
- Validation: Zod schemas for request/response validation
- API Documentation: OpenAPI/Swagger (optional but recommended)
- Deployment: Railway or Render

**Database & Infrastructure:**
- Database: PostgreSQL on Supabase or Railway
- Redis: Upstash Redis or Railway Redis (for job queue and caching)
- File Storage: AWS S3 or Cloudinary (for operator document uploads)

**Third-Party Integrations:**
- Payment: Stripe (Payment Intents API, Webhooks, optionally Connect for payouts)
- Maps: Google Maps API (Places, Distance Matrix, Geocoding)
- Email: SendGrid or Mailgun
- SMS: Twilio
- Authentication: NextAuth.js or Clerk

**Shared Types:**
- Create a `shared-types` directory or npm package
- Contains all TypeScript interfaces, types, and Zod schemas
- Imported by both frontend and backend for type consistency
- Includes: User types, Booking types, Job types, Bid types, API request/response types

**Section 5: Database Schema Requirements**

Provide a complete Prisma schema with the following models (tables):

**User Model:**
- id (UUID primary key)
- email (unique, required)
- password_hash (nullable if using OAuth)
- role (enum: CUSTOMER, OPERATOR, ADMIN)
- first_name, last_name
- phone_number
- email_verified (boolean)
- created_at, updated_at
- Relationships: bookings (one-to-many), operator_profile (one-to-one if role is OPERATOR)

**OperatorProfile Model:**
- id (UUID primary key)
- user_id (foreign key to User, unique)
- company_name (required)
- company_registration_number
- vat_number
- operating_license_url (file upload)
- insurance_document_url (file upload)
- service_areas (JSON array of postcodes/regions)
- available_vehicle_types (JSON array or separate relation)
- approval_status (enum: PENDING, APPROVED, REJECTED, SUSPENDED)
- reputation_score (decimal, default 5.0)
- bank_account_details (encrypted JSON)
- created_at, updated_at
- Relationships: user, vehicles, bids, assigned_jobs

**Vehicle Model:**
- id (UUID primary key)
- operator_id (foreign key to OperatorProfile)
- vehicle_type (enum: SALOON, ESTATE, MPV, EXECUTIVE, MINIBUS)
- registration_number
- make, model, year
- passenger_capacity
- luggage_capacity
- is_active (boolean)
- created_at, updated_at

**Booking Model:**
- id (UUID primary key)
- booking_reference (unique alphanumeric, indexed)
- customer_id (foreign key to User)
- service_type (enum: AIRPORT_PICKUP, AIRPORT_DROPOFF, POINT_TO_POINT)
- pickup_location (JSON: address, postcode, coordinates)
- dropoff_location (JSON: address, postcode, coordinates)
- via_points (JSON array, nullable)
- pickup_datetime (timestamp with timezone)
- passenger_count (integer)
- luggage_count (integer)
- vehicle_type_requested (enum)
- special_requirements (JSON: child_seats, wheelchair_access, pets, etc.)
- flight_number (text, nullable)
- is_return_journey (boolean)
- return_booking_id (foreign key to Booking, nullable, self-reference)
- quoted_price (decimal, customer-facing price)
- distance_miles (decimal)
- duration_minutes (integer)
- booking_status (enum: PENDING_PAYMENT, PAID, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED, REFUNDED)
- payment_status (enum: PENDING, COMPLETED, FAILED, REFUNDED)
- stripe_payment_intent_id
- created_at, updated_at
- Relationships: customer (User), job (one-to-one), transactions

**Job Model:**
- id (UUID primary key)
- booking_id (foreign key to Booking, unique)
- broadcast_at (timestamp)
- bidding_window_closes_at (timestamp)
- job_status (enum: OPEN_FOR_BIDDING, BIDDING_CLOSED, ASSIGNED, COMPLETED, CANCELLED)
- assigned_operator_id (foreign key to OperatorProfile, nullable)
- winning_bid_id (foreign key to Bid, nullable)
- platform_margin (decimal, calculated: quoted_price - winning_bid_amount)
- driver_name (text, nullable, filled by operator)
- driver_phone (text, nullable)
- driver_vehicle_registration (text, nullable)
- completed_at (timestamp, nullable)
- created_at, updated_at
- Relationships: booking, bids, assigned_operator

**Bid Model:**
- id (UUID primary key)
- job_id (foreign key to Job)
- operator_id (foreign key to OperatorProfile)
- bid_amount (decimal, must be <= booking.quoted_price)
- bid_status (enum: PENDING, WON, LOST, WITHDRAWN)
- submitted_at (timestamp)
- created_at, updated_at
- Unique constraint: (job_id, operator_id) - one bid per operator per job
- Relationships: job, operator

**PricingRule Model:**
- id (UUID primary key)
- rule_type (enum: BASE_FARE, PER_MILE_RATE, VEHICLE_MULTIPLIER, TIME_SURCHARGE, HOLIDAY_SURCHARGE, AIRPORT_FEE)
- vehicle_type (enum, nullable - applies to specific vehicle type)
- base_amount (decimal)
- multiplier (decimal, nullable)
- time_start (time, nullable - for time-based surcharges)
- time_end (time, nullable)
- date_start (date, nullable - for holiday surcharges)
- date_end (date, nullable)
- is_active (boolean)
- created_at, updated_at

**Transaction Model:**
- id (UUID primary key)
- booking_id (foreign key to Booking)
- transaction_type (enum: CUSTOMER_PAYMENT, OPERATOR_PAYOUT, REFUND, PLATFORM_COMMISSION)
- amount (decimal)
- currency (default: GBP)
- stripe_transaction_id (nullable)
- recipient_id (foreign key to User, nullable - for payouts)
- transaction_status (enum: PENDING, COMPLETED, FAILED)
- processed_at (timestamp, nullable)
- created_at, updated_at

**Notification Model:**
- id (UUID primary key)
- recipient_id (foreign key to User)
- notification_type (enum: EMAIL, SMS)
- template_name (text - e.g., 'booking_confirmation', 'new_job_alert')
- recipient_email_or_phone (text)
- subject (text, nullable)
- message_body (text)
- sent_at (timestamp, nullable)
- delivery_status (enum: PENDING, SENT, FAILED, BOUNCED)
- external_id (text, nullable - SendGrid/Twilio message ID)
- retry_count (integer, default 0)
- created_at, updated_at

**Additional Requirements:**
- All timestamps should use `timestamp with timezone` (Prisma: DateTime)
- All monetary values should use `decimal(10,2)` precision
- Use UUIDs for all primary keys for security and scalability
- Add indexes on: booking_reference, customer_id, operator_id, job_status, booking_status, bidding_window_closes_at
- Add soft delete capability (deleted_at field) for critical tables like Booking, User
- Ensure proper foreign key constraints with ON DELETE behaviors (CASCADE, SET NULL, or RESTRICT as appropriate)

**Section 6: Frontend Design & Responsiveness Standards**

**Design Principles:**
- ⚠️ **CRITICAL**: Create 100% original design and copywriting
- ⚠️ **DO NOT copy** ots-uk.co.uk design, layout, color scheme, or content (copyright infringement risk)
- ✅ **Use ots-uk.co.uk ONLY as functional reference** (what features they have, how booking flow works)
- ✅ **Create unique branding**: original color palette, typography, logo concept, UI patterns
- ✅ **Professional aesthetic**: trustworthy, modern, clean design appropriate for transport booking
- ✅ **Accessibility**: WCAG 2.1 AA compliance (color contrast, keyboard navigation, screen reader support)

**Tailwind CSS Configuration Requirements:**

*Centralized Theme in `tailwind.config.ts`:*
- All colors defined in `theme.extend.colors` - NO hardcoded hex values in components
- Define color palette with semantic names: primary, secondary, accent, neutral, success, warning, error
- Each color should have shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- All spacing values in `theme.extend.spacing` if custom values needed
- Typography scale in `theme.extend.fontSize` with line heights
- Border radius values in `theme.extend.borderRadius`
- Box shadows in `theme.extend.boxShadow`
- Breakpoints in `theme.extend.screens` if custom breakpoints needed
- Easy theme switching: changing colors in config should update entire app

*Example Structure:*
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#...',
          // ... all shades
          900: '#...'
        },
        // ... other color families
      },
      // ... other theme values
    }
  }
}
```

**Responsive Design Requirements:**

*Mobile-First Approach:*
- Design for mobile first (320px minimum width), then scale up
- All layouts must work on: iPhone SE (375px), standard mobile (390px-428px), tablets (768px-1024px), desktop (1280px+)
- Test at various viewport heights: 600px, 800px, 1080px, 1440px

*Breakpoint Strategy:*
- sm: 640px (large phones, small tablets)
- md: 768px (tablets)
- lg: 1024px (small laptops)
- xl: 1280px (desktops)
- 2xl: 1536px (large desktops)

*Responsive Rules:*
- ❌ **NEVER use hardcoded pixel values** like `w-[900px]`, `h-[450px]`, `text-[18px]`
- ✅ **ALWAYS use Tailwind utility classes** with theme values: `w-full`, `max-w-4xl`, `h-screen`, `text-lg`
- ✅ **Use responsive variants**: `w-full md:w-1/2 lg:w-1/3`
- ✅ **Flexible layouts**: Use flexbox and grid with responsive classes
- ✅ **Touch-friendly**: Minimum 44px × 44px tap targets on mobile (buttons, links, form inputs)
- ✅ **Readable text**: Minimum 16px base font size on mobile, proper line height (1.5-1.75)
- ✅ **Proper spacing**: Adequate padding and margins that scale with breakpoints

**Landing Page Structure (Marketing Site):**

Required sections in order:
1. **Hero Section**: Eye-catching headline, subheadline, primary CTA (Get a Quote / Book Now), hero image or illustration, trust indicators (e.g., "Trusted by 10,000+ customers")
2. **Booking Form Section** (can be in hero or separate): Prominent booking form with journey input fields, instant quote display
3. **How It Works**: 3-4 step process explanation with icons (e.g., 1. Enter details, 2. Get instant quote, 3. Pay securely, 4. Receive driver details)
4. **Vehicle Types Showcase**: Grid/carousel of available vehicle types with images, capacity, features, starting prices
5. **Service Areas**: Map or list of covered airports and regions, "We cover all major UK airports" messaging
6. **Why Choose Us / Benefits**: USPs like competitive pricing (bidding system), professional drivers, 24/7 support, secure payments, no hidden fees
7. **Pricing Transparency**: Clear explanation of pricing (no surge pricing, upfront quotes, what's included)
8. **Testimonials / Social Proof**: Customer reviews, ratings, trust badges (if available)
9. **FAQ Section**: Common questions about bookings, payments, cancellations, special requirements
10. **Footer**: Links (About, Contact, Terms, Privacy, Operator Registration), contact information, social media, payment methods accepted

**Component Design Standards:**
- Consistent button styles (primary, secondary, outline variants)
- Form inputs with proper labels, placeholders, error states, focus states
- Loading states for async operations (spinners, skeleton screens)
- Error and success message displays (toasts, alerts, inline validation)
- Modal/dialog patterns for confirmations and multi-step flows
- Card components for displaying bookings, jobs, bids
- Navigation: responsive header with mobile menu, breadcrumbs for multi-step flows

**Section 7: Code Consistency Standards**

**TypeScript Standards:**

*Shared Types Location:*
- Create `packages/shared-types` directory or `shared` folder in monorepo
- Export all shared types, interfaces, enums, and Zod schemas
- Both frontend and backend import from this shared location
- Keep frontend-specific and backend-specific types in their respective projects

*Type Definitions:*
- Enable `strict: true` in tsconfig.json for both projects
- Use `interface` for object shapes that may be extended, `type` for unions/intersections
- Avoid `any` type - use `unknown` and type guards if type is truly unknown
- Use `enum` for fixed sets of values (e.g., UserRole, BookingStatus, VehicleType)
- Define Zod schemas alongside TypeScript types for runtime validation
- Use `z.infer<typeof schema>` to derive TypeScript types from Zod schemas

*Naming Conventions:*
- Types/Interfaces: PascalCase (e.g., `UserProfile`, `BookingRequest`)
- Enums: PascalCase for enum name, SCREAMING_SNAKE_CASE for values (e.g., `enum UserRole { CUSTOMER = 'CUSTOMER' }`)
- Variables/Functions: camelCase (e.g., `calculateQuote`, `bookingData`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `MAX_PASSENGERS`, `DEFAULT_BIDDING_WINDOW`)
- React Components: PascalCase (e.g., `BookingForm`, `VehicleCard`)
- Files: kebab-case (e.g., `booking-form.tsx`, `calculate-quote.ts`)

*Example Shared Type:*
```typescript
// packages/shared-types/booking.ts
import { z } from 'zod';

export enum ServiceType {
  AIRPORT_PICKUP = 'AIRPORT_PICKUP',
  AIRPORT_DROPOFF = 'AIRPORT_DROPOFF',
  POINT_TO_POINT = 'POINT_TO_POINT'
}

export const BookingRequestSchema = z.object({
  pickupLocation: z.object({
    address: z.string(),
    postcode: z.string(),
    lat: z.number(),
    lng: z.number()
  }),
  // ... other fields
});

export type BookingRequest = z.infer<typeof BookingRequestSchema>;
```

**Database Field Naming:**
- Use snake_case for all PostgreSQL column names (e.g., `first_name`, `created_at`, `booking_reference`)
- Prisma will auto-map to camelCase in generated client (e.g., `firstName`, `createdAt`, `bookingReference`)
- Boolean fields: prefix with `is_` or `has_` (e.g., `is_active`, `has_wheelchair_access`)
- Timestamp fields: suffix with `_at` (e.g., `created_at`, `updated_at`, `completed_at`)
- Foreign keys: suffix with `_id` (e.g., `user_id`, `operator_id`, `booking_id`)

**API Naming Conventions:**

*Endpoint Structure (RESTful):*
- Use kebab-case for multi-word resources: `/api/transport-companies`, `/api/pricing-rules`
- Resource-based URLs: `/api/bookings`, `/api/jobs`, `/api/bids`
- Use HTTP methods correctly: GET (read), POST (create), PUT/PATCH (update), DELETE (delete)
- Nested resources: `/api/jobs/:jobId/bids`, `/api/bookings/:bookingId/transactions`
- Actions that don't fit REST: POST `/api/jobs/:jobId/assign`, POST `/api/bookings/:bookingId/refund`

*Examples:*
- `GET /api/bookings` - List all bookings (with pagination, filters)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id` - Update booking
- `POST /api/jobs/:jobId/bids` - Submit bid on job
- `GET /api/operators/dashboard` - Get operator dashboard data

**API Response Format:**

*Success Response:*
```typescript
{
  success: true,
  data: { /* response payload */ },
  meta: { /* pagination, timestamps, etc. */ }
}
```

*Error Response:*
```typescript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR', // machine-readable error code
    message: 'Invalid booking details', // human-readable message
    details: [ /* array of specific validation errors */ ]
  }
}
```

*HTTP Status Codes:*
- 200: Success (GET, PATCH, PUT)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (validation errors)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (authenticated but not authorized)
- 404: Not Found
- 409: Conflict (e.g., duplicate booking reference)
- 500: Internal Server Error

**Component Structure (Frontend):**

*Directory Organization:*
```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/       # Marketing pages (landing, about, etc.)
│   ├── (booking)/         # Booking flow pages
│   ├── dashboard/         # Customer dashboard
│   ├── operator/          # Operator portal
│   ├── admin/             # Admin panel
│   └── api/               # API route handlers (if any client-side API routes)
├── components/
│   ├── ui/                # Reusable UI components (Button, Input, Card, etc.)
│   ├── forms/             # Form components (BookingForm, BidForm, etc.)
│   ├── layout/            # Layout components (Header, Footer, Sidebar)
│   └── features/          # Feature-specific components
├── lib/
│   ├── api/               # API client functions
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── validations/       # Zod schemas for forms
│   └── constants.ts       # App constants
├── types/                 # Frontend-specific types
└── styles/                # Global styles, Tailwind config
```

*Backend Directory Organization:*
```
backend/
├── src/
│   ├── routes/            # Express route handlers
│   ├── controllers/       # Business logic controllers
│   ├── services/          # Business logic services
│   ├── middleware/        # Express middleware (auth, validation, error handling)
│   ├── models/            # Prisma client, database utilities
│   ├── jobs/              # Bull/BullMQ job definitions
│   ├── integrations/      # Third-party API integrations (Stripe, Google Maps, etc.)
│   ├── utils/             # Utility functions
│   ├── validations/       # Zod schemas for request validation
│   ├── types/             # Backend-specific types
│   └── server.ts          # Express app entry point
├── prisma/
│   ├── schema.prisma      # Prisma schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Database seeding script
└── tests/                 # Test files
```

**Code Quality Standards:**
- Use ESLint with TypeScript rules for both projects
- Use Prettier for consistent code formatting
- Write JSDoc comments for complex functions and public APIs
- Separate business logic from presentation (controllers/services pattern in backend, custom hooks in frontend)
- Use custom hooks for reusable logic in React components
- Keep components small and focused (single responsibility)
- Prefer composition over prop drilling (use Context API for deeply nested state)

**Section 8: Development Workflow & Best Practices**

**Git Workflow:**
- Branch naming: `feature/booking-flow`, `fix/payment-validation`, `refactor/api-responses`
- Commit message format: `type(scope): description` (e.g., `feat(booking): add quote calculation`, `fix(auth): resolve token expiration`)
- Types: feat, fix, refactor, docs, test, chore
- Keep commits atomic and focused
- Write descriptive commit messages explaining "why" not just "what"

**Testing Requirements:**

*Backend Testing:*
- Unit tests for services and utility functions (Jest)
- Integration tests for API endpoints (Supertest)
- Test database operations with test database or mocks
- Test coverage target: 70%+ for critical paths (booking flow, bidding system, payment processing)

*Frontend Testing:*
- Component tests for UI components (React Testing Library)
- Integration tests for forms and user flows
- E2E tests for critical paths (Playwright or Cypress) - optional for MVP
- Test coverage target: 60%+ for critical components

**Code Review Checklist:**
- [ ] TypeScript strict mode compliance (no `any`, proper types)
- [ ] Zod validation for all user inputs and API requests
- [ ] Error handling implemented (try-catch, error boundaries)
- [ ] Loading and error states in UI
- [ ] Responsive design tested at multiple breakpoints
- [ ] Accessibility: keyboard navigation, ARIA labels, color contrast
- [ ] No hardcoded values (use environment variables for config)
- [ ] No sensitive data in logs or client-side code
- [ ] Database queries optimized (proper indexes, avoid N+1 queries)
- [ ] API responses follow standard format
- [ ] Proper HTTP status codes used
- [ ] Authentication and authorization checks in place
- [ ] Input sanitization to prevent XSS/SQL injection
- [ ] Rate limiting on sensitive endpoints (login, payment)

**Environment Variables:**

*Frontend (.env.local):*
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

*Backend (.env):*
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_MAPS_API_KEY=...
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
NODE_ENV=development
PORT=4000
```

**Deployment Process:**

*Frontend (Vercel):*
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Automatic deployments on push to main branch
4. Preview deployments for pull requests

*Backend (Railway/Render):*
1. Connect GitHub repository to Railway/Render
2. Configure environment variables
3. Set up PostgreSQL and Redis add-ons
4. Configure build command: `npm run build`
5. Configure start command: `npm run start`
6. Set up health check endpoint: `GET /health`

*Database Migrations:*
- Run `npx prisma migrate deploy` in production
- Never run `prisma migrate dev` in production
- Always test migrations in staging environment first

**Monitoring & Logging:**
- Use structured logging (Winston or Pino)
- Log levels: error, warn, info, debug
- Never log sensitive data (passwords, tokens, credit card numbers)
- Set up error tracking (Sentry or similar) - optional for MVP
- Monitor API response times and error rates
- Set up database query monitoring

---

**DELIVERABLES**

Create the following documentation files in the project root:

1. **CLAUDE.md** - This complete project guidelines document (all sections above)

2. **DATABASE_SCHEMA.md** - Detailed database schema documentation including:
   - Complete Prisma schema code (ready to copy into `schema.prisma`)
   - Entity-Relationship Diagram (text description or Mermaid diagram)
   - Explanation of each model and its relationships
   - Index strategy and rationale
   - Sample queries for common operations

3. **API_SPECIFICATION.md** - Complete API documentation including:
   - All API endpoints with HTTP methods
   - Request/response schemas (TypeScript types and Zod schemas)
   - Authentication requirements for each endpoint
   - Example requests and responses
   - Error codes and messages
   - Rate limiting rules

4. **FRONTEND_STRUCTURE.md** - Frontend architecture documentation including:
   - Complete directory structure with explanations
   - Page routing structure (all Next.js routes)
   - Component hierarchy and reusability strategy
   - State management approach (Context API, Zustand usage)
   - Form handling patterns
   - API client implementation approach
   - Authentication flow (login, logout, session management)

5. **TAILWIND_THEME.md** - Complete Tailwind configuration including:
   - Full color palette with hex values (primary, secondary, accent, neutral, semantic colors)
   - Typography scale (font sizes, weights, line heights)
   - Spacing scale (if custom values needed)
   - Border radius values
   - Box shadow definitions
   - Breakpoint strategy
   - Complete `tailwind.config.ts` code ready to use
   - Example component showing proper usage of theme values

---

**IMPORTANT CONSTRAINTS:**

1. ✅ **Documentation ONLY** - Do NOT create any code files, components, or implementation yet
2. ✅ **Consistency** - All five documentation files must be consistent with each other (same naming conventions, same architecture decisions, same scope)
3. ✅ **Completeness** - Documentation should be detailed enough that another developer (or AI) could implement the entire project following these guidelines
4. ✅ **Scope Adherence** - Only document features listed in "Features TO IMPLEMENT" section
5. ✅ **Separate Apps** - All documentation must reflect the separate backend/frontend architecture

---

**IMMEDIATE NEXT STEPS:**

1. Acknowledge that you understand these requirements
2. Create all five documentation files as specified above
3. After documentation is complete and approved, await further instructions before starting any implementation
4. Do NOT write any application code (components, API routes, database migrations) until documentation is reviewed and approved

Do you understand these requirements and are you ready to create the five documentation files for the separate backend/frontend architecture?