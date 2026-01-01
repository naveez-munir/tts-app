# FEATURE SCOPE - MVP Features & Out of Scope

---

## ✅ FEATURES TO IMPLEMENT (MVP)

### Customer Booking Flow
- Pickup/drop-off location (Google Maps Places API autocomplete)
- Date and time selection (with timezone handling)
- Passenger count (1-16+), Luggage count
- Vehicle type selection (Saloon, Estate, MPV, Executive, Minibus)
- Special requirements (child seats, wheelchair access, pets)
- Flight number (text field only - NO API integration)
- Return journey option (5% discount)
- Via points / multiple stops support

### Quote Generation Engine
- Real-time distance calculation via Google Maps Distance Matrix API
- Base fare + distance-based pricing (per-mile rate)
- Vehicle type pricing multipliers
- Time-based surcharges (night rates 10pm-6am, peak hours)
- Holiday surcharges (Christmas/New Year - 50% markup)
- Airport fees and tolls inclusion
- Meet & Greet add-on pricing

### Payment Processing (Stripe)
- Card payments, Apple Pay, Google Pay
- 3D Secure (SCA) authentication
- Full payment collected upfront
- Refunds (full/partial)

### Bidding System (Core Feature)
- Auto broadcast to ALL registered operators upon payment
- Operators submit bids (must be ≤ customer-paid price)
- Configurable bidding window (2-24 hours)
- Lowest bid wins automatically
- Tiebreaker: Operator reputation score
- Fallback: Escalate to admin if no bids

### Transport Company Portal
- Registration with document uploads (license, insurance)
- Admin approval workflow
- View available jobs, submit bids
- Manage assigned jobs, submit driver details
- Earnings dashboard, payout history

### Admin Panel
- KPIs dashboard, activity feed, alerts
- Operator management (approve/reject/suspend)
- Booking management (view/modify/cancel/refund)
- Bidding monitoring, manual assignment
- Pricing rules configuration
- Financial reports (CSV/Excel export)
- Payout management

### Notifications
- Email (SendGrid/Mailgun): Booking confirmations, job alerts, payouts
- SMS (Twilio): Urgent alerts, booking confirmations

### Authentication
- JWT-based (access + refresh tokens)
- Multi-role (Customer, Operator, Admin)
- Email verification, password reset

---

## ❌ FEATURES OUT OF SCOPE (DO NOT IMPLEMENT)

### Flight Tracking
- ❌ Flight tracking API integration
- ❌ Auto-adjustment based on flight delays
- ✅ Flight number collected as TEXT ONLY

### Driver & Vehicle Management
- ❌ Driver mobile app
- ❌ Real-time GPS tracking
- ❌ Driver dashboard
- ✅ Operators manage drivers externally

### Communication
- ❌ In-app chat/messaging
- ❌ WebSockets/push notifications
- ✅ Email and SMS only

### Marketing & Loyalty
- ❌ Loyalty programs, referrals
- ❌ Promo codes, discount coupons
- ❌ Dynamic/surge pricing

### Advanced Features
- ❌ Multi-language (English only)
- ❌ Multi-currency (GBP only)
- ❌ Corporate accounts
- ❌ Customer reviews (public display)
- ❌ Mobile apps (web-only for MVP)

