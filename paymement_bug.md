# PAYMENT FLOW BUG - FIX DOCUMENTATION

**Date Discovered:** January 8, 2026  
**Severity:** 🔴 CRITICAL - P0  
**Status:** Documented, Ready for Implementation

---

## THE PROBLEM

**Current Broken Flow:**
```
User pays → Frontend calls /payments/confirm → Backend creates job IMMEDIATELY
                                                ↓
                                          Operators notified (WITHOUT verifying payment!)
                                                
Webhook arrives later → Creates duplicate transaction
```

**Critical Issues:**
1. No payment verification - backend trusts client-provided payment intent ID
2. Operators notified BEFORE Stripe confirms payment
3. Vulnerable to fraud - anyone can call `/payments/confirm` with fake payment intent ID
4. Race condition - webhook creates duplicate transactions
5. If payment fails after `/confirm` call, operators already notified

---

## THE SOLUTION

**Industry-Standard Webhook-Driven Flow:**
```
User pays → Stripe confirms → Frontend polls booking status
                              ↓
                        Webhook arrives
                              ↓
                        Backend verifies payment
                        Backend creates job
                        Backend notifies operators
                              ↓
                        Frontend detects PAID status
                              ↓
                        User sees confirmation
```

---

## PHASE 1: BACKEND ISSUES & FIXES

### Issue 1.1: Webhook Handler Incomplete
**File:** `src/integrations/stripe/stripe-webhook.controller.ts`  
**Method:** `handlePaymentSucceeded()` (lines 71-107)

**Current Behavior:**
- ✅ Creates transaction
- ✅ Updates booking to PAID
- ❌ Does NOT create job
- ❌ Does NOT broadcast to operators
- ❌ Does NOT schedule bidding window
- ❌ No duplicate transaction check
- ❌ No booking group support

**Required Fix:**
- Add duplicate transaction check (check if stripeTransactionId already exists)
- Detect if bookingId is actually a bookingGroupId
- For single booking: create job, broadcast to operators, schedule bidding window
- For booking group: create jobs for both legs, broadcast both jobs
- Inject NotificationsService and BiddingQueueService
- Add comprehensive error handling

---

### Issue 1.2: Payments Service Creates Jobs (Wrong Place)
**File:** `src/modules/payments/payments.service.ts`  
**Methods:** `confirmPayment()` (lines 134-175), `confirmGroupPayment()` (lines 181-240)

**Current Behavior:**
- Creates transaction without Stripe verification
- Updates booking to PAID immediately
- Creates job and broadcasts to operators (lines 167-170, 229-232)
- No payment verification

**Required Fix:**
- REMOVE job creation logic from both methods
- REMOVE operator broadcasting logic
- KEEP transaction creation and booking status update
- Job creation should ONLY happen in webhook handler

---

### Issue 1.3: No Shared Job Creation Service
**File:** Need to create `src/modules/jobs/jobs-creation.service.ts`

**Current Behavior:**
- Job creation logic duplicated in PaymentsService
- Cannot be reused by webhook handler

**Required Fix:**
- Extract `createJobForBooking()` from PaymentsService
- Extract `broadcastJobToOperators()` from PaymentsService
- Make it injectable service
- Use in both webhook handler and (optionally) payments service

---

### Issue 1.4: No Duplicate Transaction Prevention
**File:** `src/integrations/stripe/stripe-webhook.controller.ts`

**Current Behavior:**
- Webhook creates transaction without checking if it already exists
- If webhook fires twice, creates duplicate

**Required Fix:**
- Before creating transaction, check if one with same stripeTransactionId exists
- If exists, log and return success (idempotency)
- If not exists, proceed with creation

---

## PHASE 2: FRONTEND ISSUES & FIXES

### Issue 2.1: Frontend Calls /payments/confirm Immediately
**File:** `app/checkout/_components/PaymentSection.tsx`  
**Method:** `handleSubmit()` (lines 67-89)

**Current Behavior:**
- After Stripe confirms payment client-side
- Immediately calls `confirmPayment()` or `confirmGroupPayment()` API
- No verification, just trusts payment succeeded
- Triggers job creation before webhook

**Required Fix:**
- REMOVE calls to `confirmPayment()` and `confirmGroupPayment()`
- After Stripe confirms, show "Processing payment..." loading state
- Start polling booking status
- Wait for booking.status === 'PAID' (set by webhook)
- Only then call onSuccess()

---

### Issue 2.2: No Polling Mechanism
**File:** Need to create `lib/utils/polling.ts`

**Current Behavior:**
- No polling utility exists
- Frontend has no way to wait for webhook processing

**Required Fix:**
- Create `pollUntil()` utility function
- Poll every 2 seconds
- Max 30 attempts (60 seconds total)
- Return when condition met or timeout

---

### Issue 2.3: No Booking Status API Calls
**File:** `lib/api/booking.api.ts`

**Status:** ✅ ALREADY EXISTS - NO FIX NEEDED

**Audit Finding (Jan 8, 2026):**
- `getBookingById(id)` already exists (lines 73-76)
- `getBookingGroupById(groupId)` already exists (lines 93-98)
- These can be used directly for polling

---

### Issue 2.4: Immediate Redirect Without Waiting
**File:** `app/checkout/_components/CheckoutContent.tsx`  
**Method:** `handlePaymentSuccess()` (lines 270-295)

**Current Behavior:**
- Receives paymentIntentId from PaymentSection
- Immediately stores in sessionStorage
- Immediately redirects to confirmation page
- Doesn't wait for webhook

**Required Fix:**
- No major changes needed
- PaymentSection will now only call this AFTER polling completes
- This method runs only when booking is confirmed PAID

---

### Issue 2.5: No Timeout Handling
**File:** `app/checkout/_components/PaymentSection.tsx`

**Current Behavior:**
- No handling for webhook delays
- No graceful degradation if webhook takes too long

**Required Fix:**
- If polling times out (60 seconds), show graceful message
- Display: "Payment received! We're processing your booking. You'll receive email confirmation shortly."
- Allow user to continue (don't block indefinitely)
- Log timeout for monitoring

---

### Issue 2.6: No Loading State for Webhook Processing
**File:** Need to create `app/checkout/_components/PollingLoadingState.tsx`

**Current Behavior:**
- No UI component for "waiting for webhook" state

**Required Fix:**
- Create loading component with progress indicator
- Show "Processing your payment..." message
- Display progress bar based on polling attempts
- Show helpful text: "This usually takes 5-10 seconds"

---

## IMPLEMENTATION STEPS

### Phase 1: Backend (6.5 hours)
1. Create `jobs-creation.service.ts` - Extract job creation logic (1 hour)
2. Update webhook handler - Add job creation, duplicate check, booking group support (2 hours)
3. Update payments service - Remove job creation logic (1 hour)
4. Add duplicate transaction prevention (30 mins)
5. Backend testing - Single booking, return journey, duplicates (2 hours)

### Phase 2: Frontend (6 hours)
1. Create polling utility `polling.ts` (1 hour)
2. ~~Add booking API functions to `booking.api.ts`~~ - ✅ Already exists (0 mins)
3. Update PaymentSection - Remove confirm calls, add polling (2 hours)
4. Create PollingLoadingState component (30 mins)
5. Add timeout handling (1 hour)
6. Frontend testing - Happy path, delays, timeouts (1.5 hours)

### Integration Testing (4 hours)
1. End-to-end testing - Payment to operator notification (2 hours)
2. Test edge cases - Webhook delays, failures, duplicates (1 hour)
3. Deployment to staging and production (1 hour)

**Total Estimated Time:** 16.5 hours

---

## FILES TO MODIFY

### Backend (Phase 1)
- `src/integrations/stripe/stripe-webhook.controller.ts` - Add job creation to webhook
- `src/modules/payments/payments.service.ts` - Remove job creation
- `src/modules/jobs/jobs-creation.service.ts` - NEW FILE - Shared job creation logic
- `src/modules/payments/payments.module.ts` - Update imports

### Frontend (Phase 2)
- `lib/utils/polling.ts` - NEW FILE - Polling utility
- ~~`lib/api/booking.api.ts`~~ - ✅ Already has getBookingById functions
- `app/checkout/_components/PaymentSection.tsx` - Remove confirm, add polling
- `app/checkout/_components/PollingLoadingState.tsx` - NEW FILE - Loading UI
- `app/checkout/_components/CheckoutContent.tsx` - Minor updates (if needed)

---

## TESTING CHECKLIST

### Backend Testing
- [ ] Single booking: Webhook creates job and notifies operators
- [ ] Return journey: Webhook creates 2 jobs and broadcasts both
- [ ] Duplicate webhook: Second webhook doesn't create duplicate transaction
- [ ] Invalid payment intent: Webhook handles gracefully
- [ ] Bidding window scheduled correctly

### Frontend Testing
- [ ] Payment succeeds → Polling starts → Status PAID → Redirect
- [ ] Webhook delayed → Polling waits → Eventually succeeds
- [ ] Webhook timeout → Graceful error message shown
- [ ] Network error during polling → Error handled
- [ ] Single booking flow works
- [ ] Return journey flow works

### Integration Testing
- [ ] Customer pays → Webhook processes → Operators receive email/SMS
- [ ] Return journey → 2 jobs created → 2 operator broadcasts
- [ ] Payment fails → No job created → No operators notified
- [ ] No duplicate transactions created

---

## SUCCESS CRITERIA

Fix is complete when:
- ✅ Webhook creates jobs (not /payments/confirm endpoint)
- ✅ Frontend polls booking status (no immediate redirect)
- ✅ No duplicate transactions created
- ✅ Operators only notified after payment verified by Stripe
- ✅ All tests passing
- ✅ Deployed to production and monitored for 48 hours

---

**Next Action:** Start Phase 1 - Backend Webhook Fix