# COMPREHENSIVE FIX PLAN - Booking Flow Issues

**Date:** 2026-01-02  
**Status:** 📋 READY FOR IMPLEMENTATION  
**Priority Order:** Critical → High → Medium

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Critical Fixes](#critical-fixes)
3. [High Priority Fixes](#high-priority-fixes)
4. [Medium Priority Fixes](#medium-priority-fixes)
5. [Implementation Order](#implementation-order)
6. [Testing Strategy](#testing-strategy)

---

## 🎯 OVERVIEW

### Issues Summary

| Priority | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 3 | Race conditions, payment timing, schema mismatch |
| 🟠 High | 3 | State persistence, error handling |
| 🟡 Medium | 3 | Code cleanup, architectural improvements |

### Files to Modify

1. `lib/types/booking.types.ts` - Fix postcode validation
2. `app/checkout/_components/CheckoutContent.tsx` - Fix race condition, state persistence
3. `app/checkout/_components/PaymentSection.tsx` - Fix payment intent timing
4. `app/checkout/_components/AuthSection.tsx` - Improve error handling
5. `lib/utils/errorHandler.ts` - Create centralized error handler (NEW FILE)

---

## 🔴 CRITICAL FIXES

### FIX #1: Postcode Validation Schema Mismatch
**Priority:** 🔴 CRITICAL  
**File:** `lib/types/booking.types.ts`  
**Lines:** 23, 27  
**Issue:** Frontend requires postcodes, backend accepts optional

**Current Code:**
```typescript
const JourneySchema = z.object({
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  pickupPostcode: z.string().min(1, 'Pickup postcode is required'),  // ❌
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffAddress: z.string().min(1, 'Dropoff address is required'),
  dropoffPostcode: z.string().min(1, 'Dropoff postcode is required'), // ❌
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  // ... rest of schema
});
```

**Fixed Code:**
```typescript
const JourneySchema = z.object({
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  pickupPostcode: z.string().optional(),  // ✅ Match backend
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffAddress: z.string().min(1, 'Dropoff address is required'),
  dropoffPostcode: z.string().optional(), // ✅ Match backend
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  // ... rest of schema
});
```

**Impact:**
- ✅ Aligns with backend schema
- ✅ Allows bookings for locations without postcodes (e.g., Baker Street Station)
- ✅ Removes need for empty string workaround

**Testing:**
- Test booking with postcode (e.g., "10 Downing Street")
- Test booking without postcode (e.g., "Baker Street Station")

---

### FIX #2: Race Condition in Booking Creation
**Priority:** 🔴 CRITICAL  
**File:** `app/checkout/_components/CheckoutContent.tsx`  
**Lines:** 99-207  
**Issue:** Function recreated on every render, causing multiple API calls

**Current Code:**
```typescript
const createBookingForPayment = async () => {
  // ... function body
};

useEffect(() => {
  if (step === 'payment' && user && quoteData && !bookingInfo && !isCreatingBooking) {
    createBookingForPayment();  // ❌ Function not stable
  }
}, [step, user, quoteData, bookingInfo, isCreatingBooking]);
```

**Fixed Code:**
```typescript
const createBookingForPayment = useCallback(async () => {
  // ... function body
}, [quoteData, user]); // ✅ Stable dependencies

useEffect(() => {
  if (step === 'payment' && user && quoteData && !bookingInfo && !isCreatingBooking) {
    createBookingForPayment();
  }
}, [step, user, quoteData, bookingInfo, isCreatingBooking, createBookingForPayment]);
```

**Required Import:**
```typescript
import { useState, useEffect, useRef, useCallback } from 'react';
```

**Impact:**
- ✅ Prevents multiple booking creation calls
- ✅ Stable function reference
- ✅ Fixes reported "multiple API calls" issue

**Testing:**
- Monitor network tab during checkout
- Verify only ONE booking creation call
- Test with React StrictMode enabled

---

### FIX #3: Payment Intent Created Too Early
**Priority:** 🔴 CRITICAL  
**File:** `app/checkout/_components/PaymentSection.tsx`  
**Lines:** 194-225  
**Issue:** Payment intent created before booking confirmation

**Current Code:**
```typescript
useEffect(() => {
  const initializePayment = async () => {
    // Creates payment intent immediately
  };
  initializePayment();
}, []); // ❌ No dependencies
```

**Fixed Code:**
```typescript
useEffect(() => {
  // Only create payment intent if booking exists
  if (!bookingId && !bookingGroupId) {
    return;
  }

  const initializePayment = async () => {
    // ... existing code
  };
  
  initializePayment();
}, [bookingId, bookingGroupId]); // ✅ Wait for booking
```

**Impact:**
- ✅ Ensures booking exists before creating payment intent
- ✅ Prevents orphaned payment intents
- ✅ Proper dependency chain

**Testing:**
- Verify payment intent created AFTER booking
- Check network tab for correct sequence
- Test with slow network (throttling)

---

## 🟠 HIGH PRIORITY FIXES

### FIX #4: Remove Empty String Workaround
**Priority:** 🟠 HIGH
**File:** `app/checkout/_components/CheckoutContent.tsx`
**Lines:** 133, 137, 165, 169, 185, 189

**Current:**
```typescript
pickupPostcode: quoteData.pickup.postcode || '',  // ❌
```

**Fixed:**
```typescript
pickupPostcode: quoteData.pickup.postcode || undefined,  // ✅
```

**Note:** Apply AFTER Fix #1

---

### FIX #5: Booking State Persistence
**Priority:** 🟠 HIGH
**File:** `app/checkout/_components/CheckoutContent.tsx`

**Add after booking creation:**
```typescript
sessionStorage.setItem('pendingBookingId', booking.id);
sessionStorage.setItem('pendingBookingReference', booking.bookingReference);
```

**Add recovery on mount:**
```typescript
useEffect(() => {
  const pendingBookingId = sessionStorage.getItem('pendingBookingId');
  const pendingBookingReference = sessionStorage.getItem('pendingBookingReference');

  if (pendingBookingId && pendingBookingReference && user && !bookingInfo) {
    setBookingInfo({
      type: 'single',
      bookingId: pendingBookingId,
      bookingReference: pendingBookingReference,
    });
  }
}, [user, bookingInfo]);
```

**Clear on success:**
```typescript
sessionStorage.removeItem('pendingBookingId');
sessionStorage.removeItem('pendingBookingReference');
```

---

### FIX #6: Persist Retry Count
**Priority:** 🟠 HIGH
**File:** `app/checkout/_components/CheckoutContent.tsx`

**Replace:**
```typescript
const bookingAttemptsRef = useRef(0);  // ❌
```

**With:**
```typescript
const getRetryCount = () => {
  const stored = sessionStorage.getItem('bookingRetryCount');
  return stored ? parseInt(stored, 10) : 0;
};

const [retryCount, setRetryCount] = useState(getRetryCount());

// In createBookingForPayment:
const newRetryCount = retryCount + 1;
setRetryCount(newRetryCount);
sessionStorage.setItem('bookingRetryCount', String(newRetryCount));

if (newRetryCount >= 3) {
  setError('Unable to create booking. Please try again later.');
  return;
}

// On success:
setRetryCount(0);
sessionStorage.removeItem('bookingRetryCount');
```

---

## 🟡 MEDIUM PRIORITY FIXES

### FIX #7: Centralized Error Handling
**Priority:** 🟡 MEDIUM
**File:** `lib/utils/errorHandler.ts` (NEW)

**Create:**
```typescript
export interface ApiError {
  error?: { code?: string; message?: string; };
  message?: string;
}

export const extractErrorMessage = (error: unknown): string => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;

  if (typeof error === 'object') {
    const apiError = error as ApiError;
    if (apiError.error?.message) return apiError.error.message;
    if (apiError.message) return apiError.message;
  }

  return 'An unexpected error occurred';
};
```

**Use in components:**
```typescript
import { extractErrorMessage } from '@/lib/utils/errorHandler';

catch (error) {
  setError(extractErrorMessage(error));
}
```

---

### FIX #8: Remove Unused State
**Priority:** 🟡 MEDIUM
**File:** `app/checkout/_components/CheckoutContent.tsx`
**Line:** 94

**Remove:**
```typescript
const [isProcessing, setIsProcessing] = useState(false);  // ❌ Never used
```

---

### FIX #9: Quote Expiry Validation
**Priority:** 🟡 MEDIUM
**Files:** `app/quote/page.tsx`, `app/checkout/_components/CheckoutContent.tsx`

**When storing quote:**
```typescript
const quoteWithTimestamp = {
  ...quoteData,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
};
sessionStorage.setItem('quoteData', JSON.stringify(quoteWithTimestamp));
```

**In checkout (validate):**
```typescript
useEffect(() => {
  const stored = sessionStorage.getItem('quoteData');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
      sessionStorage.removeItem('quoteData');
      router.push('/quote?expired=true');
      return;
    }
    setQuoteData(parsed);
  }
}, []);
```

---

## 📋 IMPLEMENTATION ORDER

### Phase 1: Critical (30 min)
1. Fix #1: Postcode schema
2. Fix #4: Remove empty string
3. Fix #2: useCallback
4. Fix #3: Payment timing

### Phase 2: High Priority (45 min)
5. Fix #5: State persistence
6. Fix #6: Retry count

### Phase 3: Medium Priority (1 hour)
7. Fix #7: Error handler
8. Fix #8: Remove unused
9. Fix #9: Quote expiry

---

## 🧪 TESTING STRATEGY

### Scenario 1: New User (Happy Path)
1. Quote with no postcode location
2. Proceed to checkout
3. Create password → Auto-login
4. **Verify:** ONE booking API call
5. **Verify:** Payment intent AFTER booking
6. Complete payment
7. **Verify:** Success

### Scenario 2: Page Refresh
1. Complete checkout to payment step
2. Refresh page
3. **Verify:** Booking restored
4. Complete payment
5. **Verify:** Success

### Scenario 3: Retry Limit
1. Start checkout
2. Simulate failure (disconnect)
3. Retry 3 times
4. **Verify:** Error after 3 attempts
5. Refresh page
6. **Verify:** Count persists

### Scenario 4: Quote Expiry
1. Create quote
2. Set `expiresAt` to past
3. Go to checkout
4. **Verify:** Redirect to quote page

---

## ✅ COMPLETION CHECKLIST

- [ ] Fix #1: Postcode schema
- [ ] Fix #2: useCallback
- [ ] Fix #3: Payment timing
- [ ] Fix #4: Empty string removed
- [ ] Fix #5: State persistence
- [ ] Fix #6: Retry persists
- [ ] Fix #7: Error handler
- [ ] Fix #8: Unused removed
- [ ] Fix #9: Quote expiry
- [ ] All tests pass
- [ ] Network tab correct
- [ ] No console errors

---

**END OF FIX PLAN** 🚀

