# Operator Registration Data Loss - Root Cause Analysis

**Date**: January 13, 2026  
**Status**: ✅ Investigation Complete

---

## 🔍 Summary

The operator registration form **IS CORRECTLY IMPLEMENTED** on the frontend. The data loss issue is caused by **backend API not returning the data** that was successfully submitted during registration.

---

## ✅ What's Working (Frontend)

### Registration Form Implementation
**File**: `components/features/operators/OperatorRegistrationForm.tsx`

✅ **3-Step Registration Process**:
1. **Step 1**: Personal Details (firstName, lastName, email, phone, password)
2. **Step 2**: Company Details (companyName, registrationNumber, vatNumber)
3. **Step 3**: Service Details (serviceAreas, vehicleTypes)

✅ **Data Collection**:
- Service Areas: Input field with Add/Remove functionality (Lines 356-404)
- Vehicle Types: Checkboxes for SALOON, ESTATE, MPV, EXECUTIVE, MINIBUS (Lines 406-440)

✅ **API Calls** (Lines 143-163):
```typescript
// 1. Register user account
await authApi.register({
  email, password, firstName, lastName, phoneNumber,
  role: 'OPERATOR',
});

// 2. Login to get token
await authApi.login({ email, password });

// 3. Create operator profile with serviceAreas & vehicleTypes
await operatorApi.registerOperator({
  companyName,
  registrationNumber,
  vatNumber,
  serviceAreas: ['SW1A', 'W1', 'EC1'],  // ✅ SENT
  vehicleTypes: ['SALOON', 'MPV'],      // ✅ SENT
});
```

---

## ❌ Issues Found

### Issue #1: Document API Endpoint Mismatch ✅ FIXED
- **File**: `lib/api/operator.api.ts` (Line 258)
- **Problem**: `getOperatorDocuments()` was calling `/uploads/documents` instead of `/operators/documents`
- **Status**: ✅ Fixed - Changed to `/operators/documents`

### Issue #2: Phone Number Not Persisted ⏳ BACKEND FIX REQUIRED
- **Location**: Backend (not in this repository)
- **Problem**: Frontend sends `phoneNumber` during registration, but backend doesn't save it
- **Impact**: Phone number is NULL in database
- **Fix Required**: Backend needs to accept and save `phoneNumber` in `POST /auth/register`

### Issue #3: Vehicle Types Not Returned ⏳ BACKEND FIX REQUIRED
- **Location**: Backend (not in this repository)
- **Problem**: Backend doesn't return `vehicleTypes` in `GET /operators/dashboard` response
- **Impact**: Operators see "No vehicle types configured" even after selecting them during registration

**Current Backend Response**:
```json
{
  "profile": {
    "id": "...",
    "companyName": "...",
    "serviceAreas": [
      { "id": "...", "postcode": "SW1A" }
    ],
    "vehicles": []  // ← Empty if no vehicles added
    // ❌ NO vehicleTypes field!
  }
}
```

**Frontend Workaround** (OperatorProfileContent.tsx Line 66-68):
```typescript
// Tries to extract vehicle types from vehicles array
const vehicleTypes = (profileData.vehicleTypes || profileData.vehicles || []).map((v: any) =>
  typeof v === 'string' ? v : v.vehicleType || v.type
);
// ❌ Returns empty array if no vehicles added yet!
```

---

## 🎯 Root Cause

The `vehicleTypes` selected during registration are **sent to the backend** but:
1. Backend may not be storing them in the `operator_profiles` table
2. OR backend is storing them but not returning them in API responses
3. Frontend expects `vehicleTypes` field in response but only gets `vehicles` array

**Database Schema** (DATABASE_SCHEMA.md Lines 277-301):
```prisma
model OperatorProfile {
  id                  String   @id @default(uuid())
  company_name        String
  registration_number String   @unique
  // ... other fields ...
  
  // Relations
  vehicles      Vehicle[]      // ← Array of actual vehicles
  service_areas ServiceArea[]  // ← Array of service areas
  // ❌ NO vehicle_types field!
}
```

---

## 📋 Recommended Fixes (Backend)

### Option A: Add vehicle_types Column (Recommended)
Add a JSON column to store the vehicle types selected during registration:

```sql
ALTER TABLE operator_profiles 
ADD COLUMN vehicle_types TEXT[] DEFAULT '{}';
```

```prisma
model OperatorProfile {
  // ... existing fields ...
  vehicle_types String[]  // e.g., ['SALOON', 'MPV']
}
```

### Option B: Return Distinct Vehicle Types from Vehicles Table
Modify `GET /operators/dashboard` to return distinct vehicle types from the `vehicles` table.

**Pros**: No schema change needed  
**Cons**: Returns empty if operator hasn't added vehicles yet

---

## ✅ Next Steps

1. ✅ **Issue #1 (Document API)** - FIXED in frontend
2. ⏳ **Issue #2 (Phone Number)** - Requires backend fix
3. ⏳ **Issue #3 (Vehicle Types)** - Requires backend fix

**Backend Changes Needed**:
- Accept and save `phoneNumber` in `POST /auth/register`
- Add `vehicle_types` column to `operator_profiles` table
- Return `vehicleTypes` in `GET /operators/dashboard` response

