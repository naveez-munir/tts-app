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

