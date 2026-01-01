# 🔐 Login Credentials Summary

## Quick Access Credentials

---

### 👨‍💼 ADMIN ACCOUNT
```
Email:    admin@example.com
Password: Admin@123456
Role:     ADMIN
Access:   Full admin panel, operator approval, pricing config
```

**What you can do:**
- ✅ View all bookings
- ✅ Approve/reject operators
- ✅ Manage pricing rules
- ✅ View system statistics
- ✅ Access all admin features

**Login URL:** `http://localhost:3000/sign-in`
**Redirects to:** `/admin`

---

### 👤 CUSTOMER ACCOUNT
```
Email:    customer@example.com
Password: Customer@123456
Role:     CUSTOMER
Name:     John Doe
Phone:    +441234567890
```

**What you can do:**
- ✅ View your bookings (3 test bookings available)
- ✅ Manage upcoming transfers
- ✅ View booking history
- ✅ Create new bookings

**Login URL:** `http://localhost:3000/sign-in`
**Redirects to:** `/dashboard`

**Test Bookings Available:**
1. One-way: London → Heathrow (TTS-ONEWAY001)
2. Return Journey: Manchester ↔ Airport (TTS-GRP-RETURN001)
   - Outbound: TTS-OUT001
   - Return: TTS-RET001

---

### 🚗 OPERATOR ACCOUNT
```
Email:    operator@example.com
Password: Operator@123456
Role:     OPERATOR
Name:     Jane Smith
Phone:    +441234567891
Company:  Premium Transfers Ltd
Status:   APPROVED ✅
```

**Company Details:**
- Registration Number: REG123456
- VAT Number: VAT123456789
- Reputation Score: 4.8/5
- Service Areas: SW1A, SW1B (Westminster, London)

**Fleet:**
1. Toyota Prius (AB21CDE) - SALOON - 2023
2. Ford Galaxy (AB21FGH) - MPV - 2022

**What you can do:**
- ✅ View available jobs
- ✅ Submit bids on jobs
- ✅ Manage won jobs
- ✅ View earnings
- ✅ Update profile

**Login URL:** `http://localhost:3000/sign-in`
**Redirects to:** `/operator/dashboard`

---

## 🆕 Register New Operator

**Registration URL:** `http://localhost:3000/operators/register`

### Sample Test Data for New Registration:

**Step 1: Personal Details**
```
First Name:       Test
Last Name:        Operator
Email:            testoperator@example.com
Phone:            +447700900000
Password:         TestOp@123456
Confirm Password: TestOp@123456
```

**Step 2: Company Details**
```
Company Name:         Test Transport Ltd
Registration Number:  87654321
VAT Number:          GB987654321 (optional)
```

**After Registration:**
- ✅ Auto-login
- ✅ Redirect to `/operator/dashboard`
- ⚠️ Status: PENDING (needs admin approval)
- 📧 Admin receives notification to approve

---

## 🔄 Complete Test Flow

### 1. Test Customer Journey
```bash
1. Login as customer (customer@example.com / Customer@123456)
2. View dashboard → See 3 bookings
3. Click on booking → View details
4. Logout
```

### 2. Test Operator Journey
```bash
1. Login as operator (operator@example.com / Operator@123456)
2. View dashboard → See company info, vehicles, stats
3. Go to Jobs → View available jobs (if any)
4. Submit a bid (if jobs available)
5. Logout
```

### 3. Test Admin Journey
```bash
1. Login as admin (admin@example.com / Admin@123456)
2. View dashboard → See all stats
3. Go to Operators → See all operators
4. Go to Bookings → See all bookings
5. Approve/reject operators
6. Logout
```

### 4. Test New Operator Registration
```bash
1. Go to /operators/register
2. Fill form with test data above
3. Submit → Auto-login
4. See PENDING status
5. Logout
6. Login as admin
7. Approve new operator
8. Logout
9. Login as new operator
10. See APPROVED status → Can now bid
```

---

## 🎯 Password Pattern

All test passwords follow this pattern:
```
[Role]@123456

Examples:
- Admin@123456
- Customer@123456
- Operator@123456
- TestOp@123456
```

**Password Requirements:**
- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter
- ✅ At least 1 lowercase letter
- ✅ At least 1 number

---

## 🇬🇧 UK Format Examples

### Phone Numbers (Valid)
```
+447700900000  ✅
07700900000    ✅
+441234567890  ✅
01234567890    ✅
```

### VAT Numbers (Valid)
```
GB123456789  ✅
GB987654321  ✅
```

### Company Registration Numbers
```
12345678     ✅
87654321     ✅
REG123456    ✅
```

---

## 📝 Quick Commands

### Seed Database
```bash
cd tts-api
npm run seed
```

### Start Backend
```bash
cd tts-api
npm run start:dev
```

### Start Frontend
```bash
cd tts-app
npm run dev
```

### View Database
```bash
cd tts-api
npx prisma studio
```

---

## 🆘 Need Help?

- **Detailed Testing Guide:** See `TESTING_CREDENTIALS.md`
- **Quick Test Steps:** See `QUICK_TEST_GUIDE.md`
- **API Documentation:** See `API_SPECIFICATION.md`
- **Database Schema:** See `DATABASE_SCHEMA.md`

---

**Last Updated:** December 30, 2024
**Status:** ✅ Ready for Testing

