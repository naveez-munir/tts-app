FUNCTIONAL REQUIREMENTS DOCUMENT

Airport Transfer Booking Platform
(OTS-UK Style Marketplace Model)

Version 1.0
December 2025

Prepared for: Hamza

1. Executive Summary
This document outlines the functional requirements for developing an Airport Transfer Booking Platform following the OTS-UK marketplace model. The platform will serve as a middleman connecting customers seeking transportation services with registered transport companies across the UK.
Key Business Model Characteristics:
	•	Asset-light model: No vehicle ownership
	•	Marketplace/aggregator connecting customers with transport operators
	•	Bidding system: Jobs sent to all registered operators, lowest bid wins
	•	Revenue through commission on each completed booking
	•	Primary focus: Airport transfers (with general pickup support)
2. Project Scope
2.1 In Scope
	•	Customer-facing booking website (responsive web application)
	•	Admin panel for platform management
	•	Transport company registration and management portal
	•	Bidding system for job allocation
	•	Payment processing (Stripe integration)
	•	Flight tracking integration for airport pickups
	•	Email/SMS notification system
	•	Quote generation engine with fare calculation
2.2 Out of Scope
	•	Driver mobile application (managed by transport companies)
	•	Real-time driver tracking/GPS (responsibility of transport companies)
	•	Driver dashboard (operators manage their own drivers)
	•	Vehicle dispatch management

3. User Roles & Actors
Role
Description
Customer
End user booking transport services. Can be individual travelers, corporate clients, or travel agents booking on behalf of clients.
Transport Company
Registered operators who bid on jobs and provide vehicles/drivers. They manage their own fleet and drivers externally.
Platform Admin
Internal staff managing the platform, approving operators, handling disputes, managing pricing rules, and monitoring operations.

4. Functional Requirements
4.1 Customer Booking Flow
4.1.1 Journey Input
	•	Pickup location input (address, postcode, or airport selection)
	•	Drop-off location input (address, postcode, or airport selection)
	•	Date and time selection (with timezone handling)
	•	Number of passengers (1-16+)
	•	Luggage count (standard suitcases, hand luggage)
	•	Vehicle type preference (Saloon, Estate, MPV, Executive, Minibus)
	•	Special requirements (child seats, wheelchair access, pets)
	•	Flight number input (for airport pickups - triggers flight tracking)
	•	Return journey option (with discount calculation)
	•	Via points / multiple stops
4.1.2 Quote Generation
	•	Real-time distance calculation via Google Maps API
	•	Base fare + per-mile rate calculation
	•	Vehicle type pricing multipliers
	•	Time-based surcharges (night rates, peak hours)
	•	Holiday surcharges (Christmas, New Year - 50% markup)
	•	Airport fees and tolls inclusion
	•	Return journey discount (5% when booked together)
	•	Meet & Greet add-on pricing
4.1.3 Booking Confirmation & Payment
	•	Customer details collection (name, email, phone)
	•	Passenger details (lead passenger contact)
	•	Secure payment via Stripe (card, Apple Pay, Google Pay)
	•	3D Secure authentication
	•	Booking reference generation
	•	Instant email confirmation with booking details
	•	SMS confirmation option

4.2 Bidding System (Core Differentiator)
This is the unique feature that differentiates from standard OTS model:
4.2.1 Job Broadcasting
	•	Upon customer payment, job is broadcast to ALL registered operators in the service area
	•	Job details shared: pickup/dropoff, date/time, vehicle type, passenger count
	•	Customer-paid price shown as maximum ceiling
	•	Email/SMS notification to operators about new job
4.2.2 Operator Bidding
	•	Operators submit their price to fulfill the job
	•	Bid must be equal to or less than customer-paid price
	•	Bidding window: configurable (e.g., 2-24 hours depending on job urgency)
	•	Real-time bid updates visible to admin
4.2.3 Job Assignment
	•	Lowest bid wins automatically (or admin manual selection option)
	•	Operator reputation score as tiebreaker
	•	Job locked to winning operator
	•	Platform margin = Customer price - Winning bid
	•	Operator provides: vehicle info, driver name, driver contact number
	•	Customer receives 'Journey Details' email with driver information
4.2.4 Fallback Mechanism
	•	If no bids received within window: escalate to admin
	•	Admin can manually assign or contact operators
	•	Customer notification if job cannot be fulfilled (with refund)

4.3 Transport Company Portal
4.3.1 Registration & Onboarding
	•	Company details (name, registration number, VAT)
	•	Operating license upload and verification
	•	Insurance documentation
	•	Service areas selection (postcodes/regions covered)
	•	Vehicle types available
	•	Admin approval workflow
4.3.2 Job Management
	•	View available jobs in service area
	•	Submit bids on jobs
	•	View won/assigned jobs
	•	Submit driver details for assigned jobs (name, phone, vehicle reg)
	•	Mark job as completed
	•	Job history and earnings dashboard
4.3.3 Financial
	•	Earnings summary
	•	Payout schedule (weekly/bi-weekly)
	•	Invoice generation
	•	Bank details management for payouts

4.4 Flight Tracking Integration
For airport pickup jobs, the system will integrate with flight tracking APIs to monitor flight status:
	•	Customer provides flight number during booking
	•	System polls flight status every 15-30 minutes (configurable)
	•	Auto-adjustment of pickup time based on actual landing time
	•	Notification to operator about flight delays/early arrivals
	•	Terminal and gate information (where available)
Recommended API Options:
Provider
Pricing
Notes
AviationStack
Free tier: 100/month
Good for MVP, affordable paid tiers
FlightAware
~$0.01-0.02/call
Industry standard, most reliable
OpenSky
Free (open source)
Limited data, good for testing
4.5 Admin Panel
	•	Dashboard with KPIs (bookings, revenue, active operators)
	•	Booking management (view, modify, cancel, refund)
	•	Operator approval and management
	•	Bidding monitoring and manual job assignment
	•	Pricing rules configuration
	•	Surcharge management (holidays, peak times)
	•	Customer support tools
	•	Financial reports and payouts
	•	Operator performance and ratings

5. Service Types
Service Type
Description
Special Features
Airport Pickup
Collecting passengers from airport arrivals
Flight tracking, Meet & Greet option, terminal info
Airport Drop-off
Taking passengers to airport departures
Recommended 2-hour buffer, terminal selection
Point-to-Point
Any location to any location
Via points, multiple stops
Corporate
Business account bookings
Monthly invoicing, dedicated support
Events
Conferences, sporting events, tours
Group bookings, itinerary management

6. Third-Party Integrations
6.1 Required Integrations
Service
Purpose
Est. Cost
Priority
Stripe
Payment processing, payouts to operators
2.9% + 30p/txn
Critical
Google Maps API
Distance calculation, route planning, address autocomplete
~$5-7/1000 requests
Critical
Flight API
Real-time flight status tracking
$0-100/month
High
SendGrid/Mailgun
Transactional emails
Free-$20/month
Critical
Twilio
SMS notifications
~$0.04/SMS
High
6.2 Google Maps API Details
	•	Places API - Address autocomplete and validation
	•	Distance Matrix API - Calculate distance and duration
	•	Geocoding API - Convert addresses to coordinates
	•	Maps JavaScript API - Display maps on booking page (optional)

7. Recommended Technical Stack
Layer
Technology
Rationale
Frontend
Next.js 14 (React)
SSR, SEO, your expertise
Styling
Tailwind CSS
Rapid development, responsive
Backend
Next.js API Routes or Node.js/Express
JavaScript ecosystem consistency
Database
PostgreSQL
Relational data, your experience
ORM
Prisma
Type safety, migrations
Authentication
NextAuth.js / Clerk
Multi-role auth support
Hosting
Vercel + Supabase/Railway (DB)
Scalable, cost-effective
Job Queue
Bull/BullMQ with Redis
Bidding timeouts, notifications

8. System Workflow
8.1 Complete Booking Flow
PHASE 1: CUSTOMER BOOKING
	•	Customer enters journey details on website
	•	System calculates fare via Google Maps + pricing rules
	•	Customer reviews quote and proceeds to payment
	•	Payment processed via Stripe
	•	Customer receives 'Booking Acknowledgement' email

PHASE 2: BIDDING PROCESS
	•	Job broadcast to all operators in service area
	•	Operators receive notification (email/SMS/dashboard)
	•	Operators submit bids within bidding window
	•	System auto-selects lowest bid (or admin selects)
	•	Job assigned to winning operator

PHASE 3: FULFILLMENT
	•	Operator provides driver details (name, phone, vehicle)
	•	Customer receives 'Journey Details' email
	•	Flight tracking active (if airport pickup)
	•	Driver completes journey
	•	Operator marks job complete
	•	Operator paid (customer price minus platform margin)

9. Development Timeline
Estimated timeline for a single developer working full-time:
Phase
Deliverables
Duration
Cumulative
Phase 1
Project setup, DB schema, authentication, basic UI framework
2 weeks
2 weeks
Phase 2
Customer booking flow, Google Maps integration, quote engine
3 weeks
5 weeks
Phase 3
Stripe payment integration, booking confirmation emails
2 weeks
7 weeks
Phase 4
Operator portal, registration, job viewing
2 weeks
9 weeks
Phase 5
Bidding system, job assignment, notifications
3 weeks
12 weeks
Phase 6
Admin panel, operator management, reports
2 weeks
14 weeks
Phase 7
Flight tracking integration
1 week
15 weeks
Phase 8
Testing, bug fixes, security audit
2 weeks
17 weeks
Phase 9
Deployment, monitoring setup, documentation
1 week
18 weeks
Total Estimated Duration: 18-20 weeks (4-5 months)
MVP Option (Faster Launch):
For a quicker launch, an MVP could be delivered in 10-12 weeks by:
	•	Simplifying admin panel to essential features only
	•	Manual operator assignment instead of full bidding system initially
	•	Basic flight tracking or manual input
	•	Limited vehicle types

10. Cost Estimates
10.1 Development Costs
Based on typical UK freelance rates:
Item
Estimate
Full Platform Development (18 weeks)
£15,000 - £25,000
MVP Development (12 weeks)
£10,000 - £15,000
UI/UX Design (optional)
£2,000 - £5,000
10.2 Monthly Running Costs
Service
Monthly Cost
Hosting (Vercel Pro)
$20/month
Database (Supabase/Railway)
$25-50/month
Google Maps API
$50-200/month (usage based)
Flight Tracking API
$0-100/month
Email Service
$0-20/month
SMS (Twilio)
$20-100/month (usage based)
Domain & SSL
$15/month avg
TOTAL (estimated)
$130 - $500/month

11. Risks & Mitigations
Risk
Impact
Mitigation
No operator bids on job
Customer stranded, refund required
Build operator network first, admin manual assignment fallback
Operator no-show
Customer complaint, reputation damage
Operator rating system, penalties, backup operator list
Flight API costs spike
Increased operating costs
Implement caching, use free tier initially, optimize polling
Payment disputes
Chargebacks, financial loss
Clear T&Cs, booking confirmation proof, Stripe Radar
Low initial bookings
Operators lose interest
Guaranteed minimum payouts initially, marketing focus

12. Recommended Next Steps
	•	Review and finalize this requirements document
	•	Decide on MVP vs Full build approach
	•	Create wireframes/mockups for key screens
	•	Set up development environment and project structure
	•	Design database schema
	•	Register for required API accounts (Google Maps, Stripe, Flight API)
	•	Begin Phase 1 development
