# Operator Registration Issues - Analysis

**Date**: January 13, 2026
**Status**: ⚠️ 3 Confirmed Issues (1 Fixed, 2 Pending)

---

## ✅ What's Working Correctly

The frontend registration flow is **correctly implemented**:
- ✅ Form has 3 steps (Personal, Company, Services)
- ✅ Collects serviceAreas and vehicleTypes in Step 3
- ✅ Makes 3 API calls: register user → login → create operator profile
- ✅ Sends all required data to backend

---

## ✅ Issue #1: Document API Endpoint Mismatch - FIXED

**Severity**: HIGH
**File**: `lib/api/operator.api.ts` (Line 258)
**Status**: ✅ FIXED

**Problem**:
```typescript
// Was (WRONG):
const response = await apiClient.get('/uploads/documents');

// Now (CORRECT):
const response = await apiClient.get('/operators/documents');
```

**Impact**: 404 error when fetching operator documents

**Fix Applied**: Changed endpoint path from `/uploads/documents` to `/operators/documents` ✅

---

## ❌ Issue #2: Phone Number Not Persisted

**Severity**: MEDIUM  
**Location**: Backend (not in this repository)

**Problem**: 
- Frontend sends `phoneNumber` during registration
- Backend doesn't accept/save it
- Phone number is NULL in database

**Impact**: Operators cannot see or edit their phone number

**Fix Required** (Backend):
1. Add `phoneNumber` to `RegisterSchema`
2. Add `phoneNumber` to `UsersService.create()` method
3. Ensure it's saved to database

---

## ❌ Issue #3: Vehicle Types Not Returned by Backend API

**Severity**: HIGH
**Location**: Backend API (not in this repository)
**Status**: ❌ BACKEND FIX REQUIRED

**Frontend Status**: ✅ CORRECTLY IMPLEMENTED
- ✅ Registration form has 3 steps (Personal, Company, Service Details)
- ✅ Step 3 collects `serviceAreas` and `vehicleTypes`
- ✅ Form sends data to `POST /operators/register` with serviceAreas & vehicleTypes
- ✅ Profile page tries to display vehicleTypes

**Problem**:
The backend's `GET /operators/dashboard` response doesn't include a `vehicleTypes` field in the `OperatorProfile` object.

**Current Backend Response**:
```typescript
{
  profile: {
    id: "...",
    companyName: "...",
    serviceAreas: [
      { id: "...", operatorId: "...", postcode: "SW1A", createdAt: "..." }
    ],
    vehicles: [],  // ← Empty if no vehicles added yet
    // ❌ NO vehicleTypes field!
  }
}
```

**Frontend Workaround** (Line 66-68 in OperatorProfileContent.tsx):
```typescript
// Frontend tries to extract vehicle types from vehicles array
const vehicleTypes = (profileData.vehicleTypes || profileData.vehicles || []).map((v: any) =>
  typeof v === 'string' ? v : v.vehicleType || v.type
);
// ❌ This returns empty array if no vehicles added yet!
```

**Impact**:
- Operators see "No vehicle types configured" even after selecting them during registration
- The `vehicleTypes` selected during registration are stored in the backend but not returned in API responses
- Operators cannot see which vehicle types they registered for

**Fix Required** (Backend):
1. Add `vehicleTypes` field to `OperatorProfile` response
2. Return the vehicle types that were submitted during registration
3. Options:
   - **Option A**: Add a `vehicle_types` JSON column to `operator_profiles` table
   - **Option B**: Return distinct vehicle types from the `vehicles` table
   - **Option C**: Create a separate `operator_vehicle_types` junction table

---

## Next Steps

1. ✅ ~~Fix Issue #1 (Document API endpoint)~~ - COMPLETED
2. ⏳ Fix Issue #2 (Phone number) - Backend fix required (not in this repository)
3. ❌ Fix Issue #3 (Vehicle Types & Service Areas) - **CRITICAL** - Frontend fix required

