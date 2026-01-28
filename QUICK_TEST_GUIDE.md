# Quick Test Guide 🚀

Quick reference for testing the Total Travel Solution platform.

---

## 🔑 Login Credentials (Quick Reference)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@example.com | Admin@123456 |
| **Customer** | customer@example.com | Customer@123456 |
| **Operator** | operator@example.com | Operator@123456 |

---

## 🧪 Quick Test Steps

### 1️⃣ Start Backend & Seed Database
```bash
# Terminal 1: Start backend
cd tts-api
npm run start:dev

# Terminal 2: Seed database (first time only)
cd tts-api
npm run seed
```

### 2️⃣ Start Frontend
```bash
# Terminal 3: Start frontend
cd tts-app
npm run dev
```

### 3️⃣ Test Login Flow
1. Open browser: `http://localhost:3000/sign-in`
2. Try each credential above
3. Verify redirect to correct dashboard

---

## 🎯 Test Each User Role

### Customer Test
```
✅ Login: customer@example.com / Customer@123456
✅ Should redirect to: /dashboard
✅ Should see: 3 bookings (1 one-way, 1 return journey)
✅ Can view booking details
✅ Can manage bookings
```

### Operator Test
```
✅ Login: operator@example.com / Operator@123456
✅ Should redirect to: /operator/dashboard
✅ Should see: Company "Premium Transfers Ltd"
✅ Should see: 2 vehicles (Toyota Prius, Ford Galaxy)
✅ Should see: Available jobs (if any)
✅ Status: APPROVED (can bid on jobs)
```

### Admin Test
```
✅ Login: admin@example.com / Admin@123456
✅ Should redirect to: /admin/dashboard
✅ Should see: All bookings
✅ Should see: All operators
✅ Can approve/reject operators
✅ Can manage pricing rules
```

---

## 🆕 Test New Operator Registration

### Registration Form Test
```
URL: http://localhost:3000/operators/register

Step 1 - Personal Details:
  First Name: Test
  Last Name: Operator
  Email: newoperator@example.com
  Phone: +447700900000 or 07700900000
  Password: NewOp@123456
  Confirm Password: NewOp@123456

Step 2 - Company Details:
  Company Name: New Transport Ltd
  Registration Number: 12345678
  VAT Number: GB123456789 (optional)

✅ Submit → Should auto-login
✅ Redirect to: /operator/dashboard
✅ Status: PENDING (needs admin approval)
```

---

## 🔍 Verify Registration

### Check New Operator in Admin Panel
```
1. Logout from operator account
2. Login as admin: admin@example.com / Admin@123456
3. Go to: /admin/operators
4. Should see: "New Transport Ltd" with status PENDING
5. Approve the operator
6. Logout and login as new operator
7. Should now see: Status APPROVED
8. Can now bid on jobs
```

---

## 📱 Test UK-Specific Validation

### Phone Number Formats (Valid)
```
✅ +447700900000
✅ 07700900000
✅ +441234567890
✅ 01234567890
```

### Phone Number Formats (Invalid)
```
❌ 1234567890 (no prefix)
❌ +1234567890 (wrong country code)
❌ 07700 (too short)
```

### VAT Number Formats (Valid)
```
✅ GB123456789
✅ GB987654321
```

### VAT Number Formats (Invalid)
```
❌ 123456789 (missing GB prefix)
❌ GB12345 (too short)
❌ UK123456789 (wrong prefix)
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"
```
Solution:
1. Check backend is running: http://localhost:4000
2. Check .env.local has: NEXT_PUBLIC_API_URL=http://localhost:4000
3. Restart frontend: npm run dev
```

### Issue: "Login failed - Invalid credentials"
```
Solution:
1. Verify database is seeded: npm run seed
2. Check password exactly: Admin@123456 (case-sensitive)
3. Check email exactly: admin@example.com (lowercase)
```

### Issue: "No bookings showing in dashboard"
```
Solution:
1. Verify seed script ran successfully
2. Check database has data: npx prisma studio
3. Re-run seed: npm run seed
```

### Issue: "Operator registration fails"
```
Solution:
1. Check phone format: +447700900000 or 07700900000
2. Check VAT format: GB123456789 (if provided)
3. Check password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
4. Check backend logs for detailed error
```

---

## 📊 Database Inspection

### View Data in Prisma Studio
```bash
cd tts-api
npx prisma studio
```
Opens: `http://localhost:5555`

### Check Tables
- **users**: All user accounts
- **operator_profiles**: Operator company details
- **bookings**: All bookings
- **booking_groups**: Return journey groups
- **vehicles**: Operator fleet
- **service_areas**: Operator coverage areas
- **pricing_rules**: Platform pricing configuration

---

## 🎉 Success Checklist

- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] Database seeded successfully
- [ ] Can login as admin
- [ ] Can login as customer
- [ ] Can login as operator
- [ ] Can register new operator
- [ ] Customer sees bookings
- [ ] Operator sees dashboard
- [ ] Admin sees all data

---

**Need more details?** See `TESTING_CREDENTIALS.md` for comprehensive testing documentation.


driver managment API guide
# Driver & Vehicle Management API - Frontend Integration Guide

## Overview

This document covers driver management, vehicle management with document uploads, and vehicle photos for operators.

All document URL fields return presigned S3 download URLs (valid for 1 hour) when fetching data. When creating/updating, pass the S3 key from the upload flow.

---

## 1. Vehicle Management

### 1.1 Vehicle Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vehicleType | enum | ✅ | SALOON, ESTATE, MPV, MPV_PLUS, EXECUTIVE, VIP, EIGHT_SEATER |
| registrationPlate | string | ✅ | Vehicle registration number |
| make | string | ✅ | Vehicle manufacturer |
| model | string | ✅ | Vehicle model name |
| year | number | ✅ | Year of manufacture (1900 - current year + 1) |
| color | string | ❌ | Vehicle color |
| logbookUrl | string | ❌ | S3 key for V5C logbook document |
| motCertificateUrl | string | ❌ | S3 key for MOT certificate |
| motExpiryDate | ISO datetime | ❌ | MOT expiry date |
| insuranceDocumentUrl | string | ❌ | S3 key for insurance document |
| insuranceExpiryDate | ISO datetime | ❌ | Insurance expiry date |
| hirePermissionLetterUrl | string | ❌ | S3 key for hire permission letter (if applicable) |

### 1.2 List All Vehicles

```
GET /operators/vehicles
Authorization: Bearer <token>
```

### 1.3 Get Single Vehicle

```
GET /operators/vehicles/:vehicleId
Authorization: Bearer <token>
```

Returns vehicle with all document URLs as presigned S3 URLs and photos array.

### 1.4 Create Vehicle

```
POST /operators/vehicles
Authorization: Bearer <token>
```

```json
{
  "vehicleType": "SALOON",
  "registrationPlate": "AB12 CDE",
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "color": "Black",
  "logbookUrl": "operators/xxx/documents/logbook.pdf",
  "motCertificateUrl": "operators/xxx/documents/mot.pdf",
  "motExpiryDate": "2027-03-01T00:00:00.000Z",
  "insuranceDocumentUrl": "operators/xxx/documents/insurance.pdf",
  "insuranceExpiryDate": "2027-06-01T00:00:00.000Z"
}
```

### 1.5 Update Vehicle

```
PATCH /operators/vehicles/:vehicleId
Authorization: Bearer <token>
```

### 1.6 Delete Vehicle

```
DELETE /operators/vehicles/:vehicleId
Authorization: Bearer <token>
```

### 1.7 Fleet Size Auto-Update

The operator's `fleetSize` is automatically updated when vehicles are added or deleted.

---

## 2. Vehicle Photos

Vehicle photos are optional and can be uploaded for 6 different angles.

### 2.1 Photo Types

| Type | Description |
|------|-------------|
| FRONT | Front view of vehicle |
| BACK | Rear view of vehicle |
| DRIVER_SIDE | Driver's side view |
| FRONT_SIDE | Front passenger side view |
| DASHBOARD | Dashboard/interior view |
| REAR_BOOT | Rear boot/trunk view |

### 2.2 Get Vehicle Photos

```
GET /operators/vehicles/:vehicleId/photos
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx...",
      "vehicleId": "clyyy...",
      "photoType": "FRONT",
      "photoUrl": "https://s3.amazonaws.com/...",
      "createdAt": "2026-01-28T09:00:00.000Z",
      "updatedAt": "2026-01-28T09:00:00.000Z"
    }
  ]
}
```

### 2.3 Update Vehicle Photos

```
PUT /operators/vehicles/:vehicleId/photos
Authorization: Bearer <token>
```

```json
{
  "photos": [
    { "photoType": "FRONT", "photoUrl": "operators/xxx/vehicle_photos/front.jpg" },
    { "photoType": "BACK", "photoUrl": "operators/xxx/vehicle_photos/back.jpg" },
    { "photoType": "DRIVER_SIDE", "photoUrl": "operators/xxx/vehicle_photos/driver_side.jpg" }
  ]
}
```

Photos are upserted - existing photos of the same type are updated, new types are created.

---

## 3. Driver Management

### 3.1 Driver Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| firstName | string | ✅ | Driver's first name |
| lastName | string | ✅ | Driver's last name |
| phoneNumber | string | ✅ | UK phone number |
| email | string | ❌ | Email address |
| profileImageUrl | string | ❌ | S3 key for profile photo |
| dateOfBirth | ISO datetime | ❌ | Date of birth |
| passportUrl | string | ❌ | S3 key for passport document |
| passportExpiry | ISO datetime | ❌ | Passport expiry date |
| drivingLicenseNumber | string | ❌ | DVLA driving license number |
| drivingLicenseFrontUrl | string | ❌ | S3 key for driving license front |
| drivingLicenseBackUrl | string | ❌ | S3 key for driving license back |
| drivingLicenseExpiry | ISO datetime | ❌ | Driving license expiry date |
| nationalInsuranceNo | string | ❌ | National Insurance number |
| nationalInsuranceDocUrl | string | ❌ | S3 key for NI document |
| taxiCertificationUrl | string | ❌ | S3 key for taxi certification |
| taxiCertificationExpiry | ISO datetime | ❌ | Taxi certification expiry date |
| taxiBadgePhotoUrl | string | ❌ | S3 key for taxi badge photo |
| taxiBadgeExpiry | ISO datetime | ❌ | Taxi badge expiry date |
| phvLicenseNumber | string | ❌ | PHV license number |
| phvLicenseExpiry | ISO datetime | ❌ | PHV license expiry date |
| issuingCouncil | string | ❌ | Issuing council name |
| badgeNumber | string | ❌ | Badge/ID number |

### 3.2 List All Drivers

```
GET /operators/drivers
Authorization: Bearer <token>
```

All document URL fields are returned as presigned S3 download URLs.

### 3.3 Get Single Driver

```
GET /operators/drivers/:driverId
Authorization: Bearer <token>
```

### 3.4 Create Driver

```
POST /operators/drivers
Authorization: Bearer <token>
```

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+447123456789",
  "email": "john@example.com",
  "profileImageUrl": "operators/xxx/driver/profile.jpg",
  "passportUrl": "operators/xxx/driver/passport.jpg",
  "passportExpiry": "2030-06-15T00:00:00.000Z",
  "drivingLicenseFrontUrl": "operators/xxx/driver/license_front.jpg",
  "drivingLicenseBackUrl": "operators/xxx/driver/license_back.jpg",
  "drivingLicenseExpiry": "2028-03-01T00:00:00.000Z",
  "nationalInsuranceNo": "AB123456C",
  "nationalInsuranceDocUrl": "operators/xxx/driver/ni_doc.jpg",
  "taxiCertificationUrl": "operators/xxx/driver/taxi_cert.pdf",
  "taxiCertificationExpiry": "2027-12-31T00:00:00.000Z",
  "taxiBadgePhotoUrl": "operators/xxx/driver/badge.jpg",
  "taxiBadgeExpiry": "2027-12-31T00:00:00.000Z"
}
```

### 3.5 Update Driver

```
PATCH /operators/drivers/:driverId
Authorization: Bearer <token>
```

All fields are optional. Only send fields to update.

### 3.6 Delete Driver

```
DELETE /operators/drivers/:driverId
Authorization: Bearer <token>
```

---

## 4. Document Upload Flow

Use the existing S3 upload flow for all documents and images.

### Step 1: Get Presigned URL

```
POST /uploads/presigned-url
Authorization: Bearer <token>
```

```json
{
  "fileName": "passport",
  "fileType": "jpg",
  "documentType": "other"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/...",
    "key": "operators/xxx/other/123-passport.jpg",
    "expiresIn": 3600,
    "maxFileSize": 5242880
  }
}
```

### Step 2: Upload to S3

```javascript
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': 'image/jpeg' }
});
```

### Step 3: Use the Key

Pass the `key` value as the document URL field when creating/updating.

### Supported File Types

- Images: `jpg`, `jpeg`, `png`
- Documents: `pdf`

### Max File Size

5MB

---

## 5. Error Responses

```json
{
  "statusCode": 404,
  "message": "Driver not found",
  "error": "Not Found"
}
```