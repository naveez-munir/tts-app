# ARCHITECTURE & TECHNICAL STACK

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND APPLICATION                      │
│  Next.js 16 + React 19 + TypeScript + Tailwind CSS 4        │
│  Deployed on: Vercel                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    REST API (JSON)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND APPLICATION                       │
│  NestJS + TypeScript + Prisma ORM                           │
│  Deployed on: Railway or Render                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────┐  ┌──────────────────────┐
│   PostgreSQL 15+     │  │   Redis (BullMQ)     │
│   Railway/Supabase   │  │   Upstash/Railway    │
└──────────────────────┘  └──────────────────────┘
```

---

## Frontend Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | App Router, SSR, routing |
| React 19 | UI library |
| TypeScript 5 | Type safety (strict mode) |
| Tailwind CSS 4 | Styling |
| React Hook Form + Zod | Form handling & validation |
| Zustand | Complex state (booking flow) |
| Axios | HTTP client |

---

## Backend Stack

| Technology | Purpose |
|------------|---------|
| Node.js 20+ | Runtime |
| NestJS | Framework |
| TypeScript 5 | Type safety (strict mode) |
| PostgreSQL 15+ | Database |
| Prisma 5+ | ORM |
| Passport.js | Authentication (JWT) |
| BullMQ + Redis | Job queue |
| Zod | Request/response validation |

---

## Third-Party Integrations

| Service | Purpose | Priority |
|---------|---------|----------|
| **Stripe** | Payment processing, payouts | Critical |
| **Google Maps API** | Distance calculation, autocomplete | Critical |
| **SendGrid/Mailgun** | Transactional emails | Critical |
| **Twilio** | SMS notifications | High |
| **AWS S3/Cloudinary** | File storage | High |

---

## Shared Types Package

```
packages/shared-types/
├── index.ts              # Main export
├── user.types.ts         # User, OperatorProfile
├── booking.types.ts      # Booking, Job, Bid
├── payment.types.ts      # Transaction, Payment
├── enums.ts              # UserRole, BookingStatus, etc.
└── schemas/              # Zod schemas
```

---

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_MAPS_API_KEY=...
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
```

