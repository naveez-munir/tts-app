# Claude Agent Instructions

You are an AI agent working inside this repository.

## Skill Loading Rules
- You MUST read and follow all skill files located in `/skills`
- Skill files define expert behavior and decision-making rules
- Skills override generic responses
- Apply relevant skills automatically without needing user reminder

## Available Skills
- `/skills/ui-ux.md` → UI/UX design decisions
- `/skills/frontend-engineer.md` → frontend architecture & code quality

## Behavior Rules
- Always apply UI/UX and Frontend skills when reviewing or generating UI
- Call out UX, accessibility, and frontend issues explicitly
- Prefer maintainability over pixel-perfect reproduction
- Explain tradeoffs when making decisions

## Default Mode
- Act as a senior UI/UX designer and senior frontend engineer
- Do not wait for the user to ask for “best practices”
- Enforce standards proactively


# AIRPORT TRANSFER BOOKING PLATFORM

**Company:** Total Travel Solution Group Limited
**Architecture:** Separate Backend (NestJS) + Frontend (Next.js)
**Timeline:** 10-12 weeks for MVP

## 📚 Documentation Index

| Document | Description |
|----------|-------------|
| [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) | Business model, user roles, development phases |
| [docs/FEATURE_SCOPE.md](docs/FEATURE_SCOPE.md) | MVP features & out-of-scope items |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Tech stack, integrations, environment setup |
| [docs/CODE_STANDARDS.md](docs/CODE_STANDARDS.md) | Naming conventions, API format, TypeScript rules |
| [docs/DESIGN_STANDARDS.md](docs/DESIGN_STANDARDS.md) | UI/UX, Tailwind CSS, responsive design |
| [docs/DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md) | Git, testing, deployment, monitoring |
| [FRONTEND_STRUCTURE.md](FRONTEND_STRUCTURE.md) | Frontend directory structure & patterns |

---

## 🚨 CRITICAL RULES (Always Apply)

### Scope Control
- ✋ **NO feature suggestions** beyond defined MVP scope
- ✋ **NO "nice to have" additions** unless explicitly requested
- ✋ **NO future-proofing** beyond current requirements
- ✋ **NO over-engineering** - simplest solution that works
- ✋ **NO copying** ots-uk.co.uk design/content (copyright risk)

### Required Actions
- ✅ **Focus exclusively** on defined MVP features
- ✅ **Ask the user** when in doubt - don't assume
- ✅ **Prioritize completion** over perfection
- ✅ **Create 100% original design** and copywriting
- ✅ Flight number = TEXT ONLY (no API integration)

---

## 🎯 Core Business Logic

**Bidding System (Differentiator):**
1. Customer pays upfront → Job broadcast to ALL operators
2. Operators submit bids (≤ customer price)
3. Lowest bid wins automatically
4. Platform margin = Customer Price - Winning Bid

**User Roles:**
- **CUSTOMER**: Create bookings, make payments
- **OPERATOR**: View jobs, submit bids, manage assigned jobs
- **ADMIN**: Full access, operator approval, pricing config

---

## 🛠 Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | NestJS, TypeScript, Prisma, PostgreSQL |
| Queue | BullMQ + Redis |
| Payments | Stripe |
| Maps | Google Maps API |
| Email | SendGrid/Mailgun |
| SMS | Twilio |

---

## 📁 Key File Naming Rules

- **React Components**: `PascalCase.tsx` (e.g., `BookingForm.tsx`)
- **Route Folders**: `kebab-case` (e.g., `app/about/`)
- **Utilities**: `camelCase.ts` (e.g., `utils.ts`)
- **Database columns**: `snake_case` (Prisma maps to camelCase)

---

## 🎨 Design Rules

- All colors via `@theme inline` in globals.css - NO hardcoded hex
- Mobile-first responsive design (320px minimum)
- WCAG 2.1 AA accessibility compliance
- Touch targets: minimum 44px × 44px
- NO global CSS overrides on Tailwind defaults

---

## ❌ Out of Scope (DO NOT IMPLEMENT)

- Flight tracking API integration
- Driver mobile app / GPS tracking
- In-app chat / WebSocket notifications
- Loyalty programs / promo codes
- Multi-language / multi-currency
- Mobile apps (web-only for MVP)

---

**For detailed specifications, refer to the docs/ folder.**