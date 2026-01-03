# BACKEND API ANALYSIS - Booking & Payment Flow

**Date:** 2026-01-02  
**Backend URL:** `http://localhost:4000`  
**Status:** ✅ ANALYZED

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [API Endpoints](#api-endpoints)
3. [Data Contract Analysis](#data-contract-analysis)
4. [Critical Findings](#critical-findings)
5. [Frontend-Backend Alignment](#frontend-backend-alignment)

---

## 🎯 EXECUTIVE SUMMARY

### Key Findings

1. ✅ **Backend DOES NOT require customer details in booking request**
2. ✅ **Backend extracts customer info from JWT token (authenticated user)**
3. ❌ **Frontend schema REQUIRES postcodes, but backend accepts optional**
4. ✅ **Booking creation flow matches expected sequence**
5. ✅ **Payment intent requires booking ID (correct dependency)**

### Critical Discrepancy

**Frontend Type Definition (lib/types/booking.types.ts:22-27):**
```typescript
pickupPostcode: z.string().min(1, 'Pickup postcode is required'),  // ❌ WRONG
dropoffPostcode: z.string().min(1, 'Dropoff postcode is required'), // ❌ WRONG
```

**Actual Backend Expectation:**
```typescript
pickupPostcode: z.string().optional(),  // ✅ CORRECT
dropoffPostcode: z.string().optional(), // ✅ CORRECT
```

**Impact:** Frontend validation is STRICTER than backend, causing unnecessary validation errors.

---

## 🔌 API ENDPOINTS

### Authentication Endpoints

#### POST /auth/register
**Purpose:** Create new user account  
**Authentication:** None (public)  
**Request Body:**
```typescript
{
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber?: string,
  role: 'CUSTOMER' | 'OPERATOR' | 'ADMIN'
}
```
**Response:**
```typescript
{
  success: true,
  data: {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string | null,
    role: string,
    createdAt: string
  }
}
```

---

#### POST /auth/login
**Purpose:** Authenticate user and get JWT token  
**Authentication:** None (public)  
**Request Body:**
```typescript
{
  email: string,
  password: string
}
```
**Response:**
```typescript
{
  success: true,
  data: {
    user: User,
    access_token: string  // JWT token
  }
}
```

**JWT Token Contains:**
- `sub`: User ID
- `email`: User email
- `role`: User role
- `firstName`: User first name
- `lastName`: User last name
- `phoneNumber`: User phone number

---

### Booking Endpoints

#### POST /bookings
**Purpose:** Create one-way booking  
**Authentication:** Required (JWT Bearer token)  
**Request Body:**
```typescript
{
  pickupAddress: string,
  pickupPostcode?: string,  // ⚠️ OPTIONAL (not required)
  pickupLat: number,
  pickupLng: number,
  dropoffAddress: string,
  dropoffPostcode?: string,  // ⚠️ OPTIONAL (not required)
  dropoffLat: number,
  dropoffLng: number,
  pickupDatetime: Date | string,
  passengerCount: number,  // 1-16
  luggageCount: number,    // >= 0
  vehicleType: 'SALOON' | 'ESTATE' | 'MPV' | 'EXECUTIVE' | 'MINIBUS',
  serviceType: 'AIRPORT_PICKUP' | 'AIRPORT_DROPOFF' | 'POINT_TO_POINT',
  flightNumber?: string,
  specialRequirements?: string,
  customerPrice: number,
  isReturnJourney: false
}
```

**❌ NOT REQUIRED (Backend extracts from JWT):**
- `customerName` - Extracted from `${user.firstName} ${user.lastName}`
- `customerEmail` - Extracted from `user.email`
- `customerPhone` - Extracted from `user.phoneNumber`

**Response:**
```typescript
{
  success: true,
  data: {
    isReturnJourney: false,
    booking: {
      id: string,
      bookingReference: string,  // e.g., "TTS-ABC12345"
      customerId: string,
      status: 'PENDING_PAYMENT',
      customerName: string,      // Auto-populated from JWT
      customerEmail: string,     // Auto-populated from JWT
      customerPhone: string,     // Auto-populated from JWT
      // ... all other booking fields
    }
  }
}
```

---

#### POST /bookings/return
**Purpose:** Create return journey (2 bookings + booking group)
**Authentication:** Required (JWT Bearer token)
**Request Body:**
```typescript
{
  isReturnJourney: true,
  outbound: {
    pickupAddress, pickupPostcode, pickupLat, pickupLng,
    dropoffAddress, dropoffPostcode, dropoffLat, dropoffLng,
    pickupDatetime, passengerCount, luggageCount,
    vehicleType, serviceType, flightNumber,
    specialRequirements, customerPrice
  },
  returnJourney: { /* same structure */ },
  totalPrice: number,
  discountAmount?: number
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    isReturnJourney: true,
    bookingGroup: {
      id: string,
      groupReference: string,
      status: 'PENDING_PAYMENT',
      bookings: [/* outbound */, /* return */]
    }
  }
}
```

---

### Payment Endpoints

#### POST /payments/intent
**Purpose:** Create Stripe payment intent for single booking
**Request Body:**
```typescript
{ bookingId: string, amount: string }
```

**Response:**
```typescript
{
  success: true,
  data: {
    paymentIntentId: string,
    clientSecret: string,
    bookingId: string,
    amount: number,
    currency: 'gbp'
  }
}
```

---

#### POST /payments/group/intent
**Purpose:** Create payment intent for booking group
**Request Body:**
```typescript
{ bookingGroupId: string, amount: string }
```

---

#### POST /payments/confirm
**Purpose:** Confirm payment after Stripe
**Request Body:**
```typescript
{ bookingId: string, paymentIntentId: string }
```

**Side Effects:**
- Booking status: `PENDING_PAYMENT` → `PAID`
- Job created and broadcast to operators

---

## 📊 DATA CONTRACT ANALYSIS

### Customer Details Handling

**Backend Extracts from JWT Token:**
```typescript
booking.customerId = req.user.sub;
booking.customerName = `${req.user.firstName} ${req.user.lastName}`;
booking.customerEmail = req.user.email;
booking.customerPhone = req.user.phoneNumber;
```

**✅ CONCLUSION:** Frontend does NOT need to send customer details.

---

### Postcode Handling

**Backend Schema:**
```typescript
pickupPostcode: z.string().optional(),  // ✅ Optional
dropoffPostcode: z.string().optional(), // ✅ Optional
```

**Frontend Schema (INCORRECT):**
```typescript
pickupPostcode: z.string().min(1, 'Pickup postcode is required'),  // ❌
dropoffPostcode: z.string().min(1, 'Dropoff postcode is required'), // ❌
```

**Frontend Workaround:**
```typescript
pickupPostcode: quoteData.pickup.postcode || '',  // Sends empty string
```

**Issue:** Frontend validation too strict, sends empty string as workaround.

---

### Booking Status Lifecycle

```
PENDING_PAYMENT → PAID → ASSIGNED → IN_PROGRESS → COMPLETED
```

---

## 🚨 CRITICAL FINDINGS

### FINDING #1: Customer Details NOT Required ✅
**Status:** Frontend is CORRECT
**Reason:** Backend extracts from JWT
**Action:** None

---

### FINDING #2: Postcode Validation Mismatch ❌
**Status:** Frontend too strict
**Impact:** Requires postcodes when backend doesn't

**Fix Required:**
```typescript
// lib/types/booking.types.ts:23, 27
pickupPostcode: z.string().optional(),  // ✅
dropoffPostcode: z.string().optional(), // ✅
```

---

### FINDING #3: Booking Creation Sequence ✅
**Status:** CORRECT
**Flow:** Auth → Create Booking → Create Payment Intent → Confirm Payment

---

## 🔄 FRONTEND-BACKEND ALIGNMENT

### ✅ Aligned

1. Authentication flow
2. Booking creation (no customer details sent)
3. Payment flow sequence
4. Return journey handling

### ❌ Misaligned

1. **Postcode validation** - Frontend too strict
2. **Empty string workaround** - Should send `undefined`

---

## 📝 REQUIRED FIXES

### Fix #1: Postcode Validation Schema
**File:** `lib/types/booking.types.ts` (Lines 23, 27)

**Change:**
```typescript
pickupPostcode: z.string().optional(),
dropoffPostcode: z.string().optional(),
```

---

### Fix #2: Remove Empty String Workaround
**File:** `app/checkout/_components/CheckoutContent.tsx`

**Change:**
```typescript
pickupPostcode: quoteData.pickup.postcode || undefined,
dropoffPostcode: quoteData.dropoff.postcode || undefined,
```

---

## ✅ SUMMARY

| Aspect | Status | Action |
|--------|--------|--------|
| Customer details | ✅ Correct | None |
| Booking sequence | ✅ Correct | None |
| Payment flow | ✅ Correct | None |
| Postcode validation | ❌ Too strict | Fix schema |
| Empty string workaround | ⚠️ Works | Cleanup |

---

**END OF BACKEND ANALYSIS**

**Next:** Create fix plan combining frontend + backend findings.

