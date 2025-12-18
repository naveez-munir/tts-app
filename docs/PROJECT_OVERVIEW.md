# PROJECT OVERVIEW - Airport Transfer Booking Platform

**Version:** 1.0  
**Last Updated:** December 2025

---

## Description

Marketplace platform connecting customers seeking airport transfers with registered transport operators across the UK.

## Business Model

- **Asset-light aggregator**: No vehicle ownership
- **Bidding system**: Jobs broadcast to all operators, lowest bid wins
- **Revenue model**: Commission (Customer Price - Winning Bid)
- **Primary service**: Airport transfers with point-to-point support

## Core Differentiator

Automated bidding system where all registered operators in the service area receive job notifications and compete by submitting bids. The lowest bid automatically wins, maximizing platform margin while ensuring competitive pricing.

## Target Timeline

**10-12 weeks for MVP** (Minimum Viable Product)

---

## Vehicle Types

| Vehicle Type | Passengers | Luggage | Description |
|--------------|------------|---------|-------------|
| Saloon | 1-4 | 2 large, 2 hand | Standard sedan (e.g., Toyota Prius, VW Passat) |
| Estate | 1-4 | 4 large, 2 hand | Estate car with extra luggage space |
| MPV/People Carrier | 5-6 | 4 large, 4 hand | 7-seater (e.g., Ford Galaxy, VW Sharan) |
| Executive | 1-4 | 2 large, 2 hand | Premium sedan (e.g., Mercedes E-Class, BMW 5 Series) |
| Minibus | 7-16 | 10+ large | Large group transport |

---

## User Roles

- **CUSTOMER**: Can create bookings, view own bookings, make payments
- **OPERATOR**: Can view jobs, submit bids, manage assigned jobs, view earnings
- **ADMIN**: Full access to all features, operator approval, pricing configuration

---

## Key Takeaways

1. **Scope Discipline**: Only implement MVP features. No additions without explicit approval.
2. **Architecture**: Separate NestJS backend + Next.js frontend with shared types package.
3. **Core Feature**: Bidding system where operators compete for jobs - this is the differentiator.
4. **Timeline**: 10-12 weeks for MVP with focused scope.
5. **Quality**: Type-safe, tested, accessible, responsive, and secure.

---

## Development Phases (Recommended)

1. **Phase 1**: Project setup, database schema, authentication
2. **Phase 2**: Customer booking flow, quote engine, Google Maps integration
3. **Phase 3**: Stripe payment integration, booking confirmation
4. **Phase 4**: Operator portal, registration, job viewing
5. **Phase 5**: Bidding system, job assignment, notifications
6. **Phase 6**: Admin panel, operator management, reports
7. **Phase 7**: Testing, bug fixes, security audit
8. **Phase 8**: Deployment, monitoring setup

