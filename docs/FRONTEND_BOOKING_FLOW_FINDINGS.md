# FRONTEND BOOKING FLOW - ANALYSIS & FINDINGS

**Date:** 2026-01-02  
**Scope:** Frontend booking workflow from quote to payment  
**Status:** ⚠️ CRITICAL ISSUES IDENTIFIED

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Actual User Flow](#actual-user-flow)
3. [Critical Issues](#critical-issues)
4. [Data Flow Analysis](#data-flow-analysis)
5. [State Management](#state-management)
6. [Authentication Flow](#authentication-flow)
7. [What's Working Well](#whats-working-well)
8. [Next Steps](#next-steps)

---

## 🎯 EXECUTIVE SUMMARY

### Issues Found
- **5 Critical Issues** requiring immediate fixes
- **3 Architectural Concerns** for future improvement
- **2 Data Discrepancies** between frontend and backend expectations

### Key Findings
1. ✅ Quote form and result pages work correctly
2. ❌ Booking creation has race condition causing multiple API calls
3. ❌ Customer details from quote form NOT sent to booking API
4. ⚠️ Payment intent created before booking confirmation
5. ⚠️ No state persistence on page refresh

---

## 🔄 ACTUAL USER FLOW

### Step 1: Quote Form (`/quote`)
**Status:** ✅ Working as intended

**User Actions:**
1. Fill 4-step form (Journey → Passengers → Vehicle → Contact)
2. Submit form → API call to `/api/maps/quote/single` or `/api/maps/quote/return`
3. Data stored in `sessionStorage` under key `quoteData`
4. Redirect to `/quote/result`

**Data Collected:**
```typescript
{
  journeyType: 'one-way' | 'return',
  pickup: { address, postcode, lat, lng },
  dropoff: { address, postcode, lat, lng },
  serviceType, pickupDatetime, returnDatetime,
  flightNumber, passengers, luggage, vehicleType,
  childSeats, wheelchairAccess, pets, meetAndGreet, specialNotes,
  customerDetails: { firstName, lastName, email, phone },  // ⚠️ IMPORTANT
  quote: { /* API response */ }
}
```

---

### Step 2: Quote Result (`/quote/result`)
**Status:** ✅ Working as intended

**User Actions:**
1. Review quote summary and price breakdown
2. Click "Proceed to Book" → redirect to `/checkout`

---

### Step 3: Checkout (`/checkout`)
**Status:** ⚠️ CRITICAL ISSUES

**Flow Diagram:**
```
CheckoutContent Loads
  ↓
Load quoteData from sessionStorage
  ↓
Check authentication (getCurrentUser())
  ├─ Authenticated → setStep('payment')
  └─ Not Authenticated → setStep('auth')
      ↓
  AuthSection (create-password mode)
    • Pre-filled: email, firstName, lastName, phone
    • User enters: password, confirmPassword
    • Submit → Register + Auto-login
    • onSuccess(user) → setStep('payment')
      ↓
  useEffect triggers (step === 'payment' && user)
    • createBookingForPayment() called
    • POST /bookings or /bookings/return
    • Booking status: PENDING_PAYMENT
    • Store bookingInfo: { bookingId, bookingReference }
      ↓
  PaymentSection
    • useEffect on mount → Create payment intent
    • POST /payments/intent or /payments/group/intent
    • Stripe Elements loads
    • User enters card → Submit
    • stripe.confirmPayment() + POST /payments/confirm
    • Booking status → PAID
    • onSuccess(paymentIntentId)
      ↓
  handlePaymentSuccess()
    • Store bookingConfirmation in sessionStorage
    • Clear quoteData
    • Redirect to /checkout/confirmation
```

---

## 🚨 CRITICAL ISSUES

### ISSUE #1: Race Condition in Booking Creation 🔴
**Severity:** CRITICAL  
**File:** `app/checkout/_components/CheckoutContent.tsx`  
**Lines:** 203-207

**Problem:**
```typescript
useEffect(() => {
  if (step === 'payment' && user && quoteData && !bookingInfo && !isCreatingBooking) {
    createBookingForPayment();  // ❌ Not in dependency array
  }
}, [step, user, quoteData, bookingInfo, isCreatingBooking]);
```

**Root Cause:**
- `createBookingForPayment` function recreated on every render
- Function not wrapped in `useCallback`
- Causes useEffect to trigger multiple times
- Results in multiple booking creation API calls

**Impact:**
- Multiple API calls to create booking
- Potential duplicate bookings in database
- Poor UX (loading states flicker)
- Wasted backend resources

**Evidence:**
User reported: "booking API call is being triggered multiple times"

### ISSUE #3: Retry Limit Doesn't Persist 🟡
**Severity:** MEDIUM
**File:** `app/checkout/_components/CheckoutContent.tsx`
**Line:** 97

**Current Code:**
```typescript
const bookingAttemptsRef = useRef(0);  // ✅ Recently added
```

**Problem:**
- Retry counter stored in `useRef`
- Resets to 0 on page refresh
- User can bypass 3-attempt limit by refreshing page

**Recommended Fix:**
```typescript
const getRetryCount = () => {
  const stored = sessionStorage.getItem('bookingRetryCount');
  return stored ? parseInt(stored) : 0;
};

const [retryCount, setRetryCount] = useState(getRetryCount());

// In createBookingForPayment:
sessionStorage.setItem('bookingRetryCount', String(retryCount + 1));
```

---

### ISSUE #4: Payment Intent Created Too Early 🔴
**Severity:** CRITICAL
**File:** `app/checkout/_components/PaymentSection.tsx`
**Lines:** 194-225

**Current Code:**
```typescript
useEffect(() => {
  const initializePayment = async () => {
    // Creates payment intent immediately on mount
  };
  initializePayment();
}, []); // ❌ No dependencies
```

**Problem:**
- Payment intent created as soon as PaymentSection mounts
- Booking might still be creating (race condition)
- If booking creation fails, payment intent is orphaned
- No validation that booking exists before creating payment intent

**Recommended Fix:**
```typescript
useEffect(() => {
  // Only create payment intent if booking is confirmed
  if (bookingId || bookingGroupId) {
    initializePayment();
  }
}, [bookingId, bookingGroupId]);
```

---

### ISSUE #5: Missing Customer Details in Booking API Call ❌
**Severity:** CRITICAL
**File:** `app/checkout/_components/CheckoutContent.tsx`
**Lines:** 118-136

**Current Code:**
```typescript
const booking = await createBooking({
  pickupAddress: quoteData.pickup.address,
  pickupPostcode: quoteData.pickup.postcode || '',
  pickupLat: quoteData.pickup.lat,
  pickupLng: quoteData.pickup.lng,
  dropoffAddress: quoteData.dropoff.address,
  dropoffPostcode: quoteData.dropoff.postcode || '',
  dropoffLat: quoteData.dropoff.lat,
  dropoffLng: quoteData.dropoff.lng,
  pickupDatetime: new Date(quoteData.pickupDatetime),
  passengerCount: quoteData.passengers,
  luggageCount: quoteData.luggage,
  vehicleType: quoteData.vehicleType as VehicleType,
  serviceType: quoteData.serviceType as ServiceType,
  flightNumber: quoteData.flightNumber,
  specialRequirements: specialReqs.join('; ') || undefined,
  customerPrice: singleQuote.totalPrice,
  isReturnJourney: false,
});
```

**Missing Fields:**
```typescript
// ❌ NOT SENT:
customerName: `${quoteData.customerDetails.firstName} ${quoteData.customerDetails.lastName}`,
customerEmail: quoteData.customerDetails.email,
customerPhone: quoteData.customerDetails.phone,
```

**Impact:**
- Backend doesn't receive customer contact details
- Can't send confirmation emails
- Operators don't have customer contact info
- **CRITICAL:** Must verify if backend extracts from JWT token or expects in request body

**Action Required:**
- Check backend DTO to see if these fields are required
- Verify if backend auto-populates from authenticated user
- Add fields to request if required by backend

---

### ISSUE #6: Inconsistent Error Handling 🟡
**Severity:** MEDIUM
**Files:** Multiple

**Problem A - AuthSection.tsx (Lines 81-99):**
```typescript
catch (error: any) {
  if (error.issues) {
    // Zod validation errors
  } else if (error.error) {
    // API errors - assumes specific structure
  } else {
    // Generic fallback
  }
}
```

**Problem B - CheckoutContent.tsx (Line 196):**
```typescript
catch (err) {
  console.error('Booking creation failed:', err);
  setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
}
```

**Problem C - PaymentSection.tsx (Line 93):**
```typescript
catch (err) {
  console.error('Payment confirmation failed:', err);
  setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
}
```

**Issues:**
- Assumes API error structure without validation
- Generic error messages don't help users
- Doesn't extract structured error messages from API responses
- Inconsistent error handling patterns across components

**Recommended Fix:**
Create centralized error handler utility:
```typescript
// lib/utils/errorHandler.ts
export const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    if ('error' in error && error.error && typeof error.error === 'object') {
      if ('message' in error.error) return String(error.error.message);
    }
    if ('message' in error) return String(error.message);
  }
  return 'An unexpected error occurred';
};
```

---

## 📊 DATA FLOW ANALYSIS

### Quote Data Structure (sessionStorage key: `quoteData`)

**Complete Structure:**
```typescript
{
  // Journey Details
  journeyType: 'one-way' | 'return',
  pickup: {
    address: string,
    postcode: string | null,  // ⚠️ Can be null for stations
    lat: number,
    lng: number
  },
  dropoff: {
    address: string,
    postcode: string | null,  // ⚠️ Can be null for stations
    lat: number,
    lng: number
  },
  serviceType: 'AIRPORT_PICKUP' | 'AIRPORT_DROPOFF' | 'POINT_TO_POINT',
  pickupDatetime: string,  // ISO format
  returnDatetime?: string,  // ISO format (if return journey)

  // Passenger & Luggage
  passengers: number,
  luggage: number,

  // Vehicle & Options
  vehicleType: 'SALOON' | 'ESTATE' | 'MPV' | 'EXECUTIVE' | 'MINIBUS',
  childSeats: number,
  wheelchairAccess: boolean,
  pets: boolean,
  meetAndGreet: boolean,

  // Additional Info
  flightNumber?: string,
  specialNotes?: string,

  // Customer Details (⚠️ CRITICAL - NOT sent to booking API)
  customerDetails: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string
  },

  // Quote Response
  quote: SingleJourneyQuote | ReturnJourneyQuote
}
```

---

### Booking Creation Payload (Current Implementation)

**Single Journey:**
```typescript
{
  pickupAddress: string,
  pickupPostcode: string,  // ⚠️ Sends "" if null
  pickupLat: number,
  pickupLng: number,
  dropoffAddress: string,
  dropoffPostcode: string,  // ⚠️ Sends "" if null
  dropoffLat: number,
  dropoffLng: number,
  pickupDatetime: Date,
  passengerCount: number,
  luggageCount: number,
  vehicleType: VehicleType,
  serviceType: ServiceType,
  flightNumber?: string,
  specialRequirements?: string,
  customerPrice: number,
  isReturnJourney: boolean
}
```

**Return Journey:**
```typescript
{
  outboundJourney: { /* same as single journey */ },
  returnJourney: { /* same as single journey */ },
  totalPrice: number
}
```

**❌ MISSING FIELDS (Need Backend Verification):**
- `customerName` or `customer_name`
- `customerEmail` or `customer_email`
- `customerPhone` or `customer_phone`

---

### Booking Response (Expected)

```typescript
{
  id: string,
  bookingReference: string,
  status: 'PENDING_PAYMENT',
  // ... other fields
}
```

**Stored in State:**
```typescript
bookingInfo: {
  bookingId: string,
  bookingReference: string
}
```

---

### Payment Intent Creation Payload

**Single Journey:**
```typescript
{
  bookingId: string,
  amount: number,
  currency: 'gbp'
}
```

**Return Journey:**
```typescript
{
  bookingGroupId: string,
  amount: number,
  currency: 'gbp'
}
```

---

### Confirmation Data (sessionStorage key: `bookingConfirmation`)

```typescript
{
  bookingReference: string,
  // Potentially other fields
}
```

---

### ISSUE #2: Missing useCallback Wrapper 🔴
**Severity:** HIGH  
**File:** `app/checkout/_components/CheckoutContent.tsx`  
**Line:** 99

**Current Code:**
```typescript
const createBookingForPayment = async () => {
  // Function body
};
```

**Required Fix:**
```typescript
const createBookingForPayment = useCallback(async () => {
  // Function body
}, [quoteData, user]); // Add stable dependencies
```

---

## 🧠 STATE MANAGEMENT

### CheckoutContent Component State

**File:** `app/checkout/_components/CheckoutContent.tsx`

```typescript
// Data State
const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
const [user, setUser] = useState<User | null>(null);
const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);

// UI State
const [loading, setLoading] = useState(true);
const [step, setStep] = useState<'auth' | 'payment'>('auth');
const [isProcessing, setIsProcessing] = useState(false);  // ⚠️ NEVER SET TO TRUE
const [isCreatingBooking, setIsCreatingBooking] = useState(false);
const [error, setError] = useState<string | null>(null);

// Refs
const bookingAttemptsRef = useRef(0);  // ✅ Recently added for retry limit
```

**Issues:**
1. ⚠️ `isProcessing` is declared but never set to `true` - unused state
2. ⚠️ `bookingAttemptsRef` doesn't persist across page reloads

---

## 🏗️ ARCHITECTURAL CONCERNS

### CONCERN #1: SessionStorage Dependency
**Severity:** MEDIUM

**Issue:** All critical data stored in sessionStorage with no server-side validation

**Recommended:** Store quote ID in URL, fetch from backend when needed

---

### CONCERN #2: No Booking State Persistence
**Severity:** HIGH

**Issue:** If user refreshes during payment, booking is lost and orphaned in database

**Recommended:** Store `bookingId` in sessionStorage, add resume payment logic

---

### CONCERN #3: No Quote Expiry Validation
**Severity:** MEDIUM

**Issue:** Quote data stored indefinitely, prices could change

**Recommended:** Add timestamp and 30-minute expiry validation

---

## 🔐 AUTHENTICATION FLOW

### Critical Question for Backend

**Does backend extract customer details from JWT token?**

Frontend currently does NOT send:
- `customer_name` / `customerName`
- `customer_email` / `customerEmail`
- `customer_phone` / `customerPhone`

**ACTION REQUIRED:** Verify backend DTO before fixing frontend.

---

## ✅ WHAT'S WORKING WELL

- ✅ Quote form with 4-step wizard and validation
- ✅ Google Maps autocomplete integration
- ✅ Seamless account creation at checkout
- ✅ Auto-login after registration
- ✅ Stripe Elements integration
- ✅ Responsive design and loading states

---

## 📝 NEXT STEPS

### Phase 2: Backend Analysis (NEXT)

**Required Files:**
1. `src/modules/bookings/bookings.controller.ts`
2. `src/modules/bookings/bookings.service.ts`
3. `src/modules/bookings/dto/create-booking.dto.ts`
4. `src/modules/payments/payments.controller.ts`
5. `prisma/schema.prisma`

**Questions to Answer:**
1. Does backend expect customer details in booking request?
2. What fields are required vs optional in booking DTO?
3. How does backend handle empty postcode strings?
4. What's the complete booking status lifecycle?

---

### Phase 3: Create Fix Plan

After backend analysis, document required frontend changes and priority order.

---

### Phase 4: Implement Fixes

**Planned Fixes (pending backend verification):**
1. Wrap `createBookingForPayment` in `useCallback`
2. Add customer details to booking request (if required)
3. Delay payment intent creation until booking confirmed
4. Persist retry count in sessionStorage
5. Add booking state persistence
6. Centralize error handling

---

## 📊 SUMMARY

### Critical Issues (Must Fix)
1. ❌ Race condition causing multiple booking API calls
2. ❌ Missing customer details in booking request (needs verification)
3. ❌ Payment intent created before booking confirmation

### High Priority
4. ⚠️ No booking state persistence on page refresh
5. ⚠️ Retry limit doesn't persist across reloads
6. ⚠️ Inconsistent error handling

### Medium Priority
7. ⚠️ SessionStorage dependency
8. ⚠️ No quote expiry validation
9. ⚠️ Unused state variables

---

**END OF FRONTEND ANALYSIS**

**Next:** Backend analysis to verify data contract and fix alignment issues.
