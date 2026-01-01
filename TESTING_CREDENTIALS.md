# Testing Credentials & Test Data

This document contains all test credentials and sample data for testing the Total Travel Solution platform.

---

## 🔐 Test User Credentials

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `Admin@123456`
- **Role**: ADMIN
- **Access**: Full admin panel access, operator approval, pricing configuration

### Customer Account
- **Email**: `customer@example.com`
- **Password**: `Customer@123456`
- **Role**: CUSTOMER
- **Name**: John Doe
- **Phone**: +441234567890
- **Access**: Customer dashboard, booking management

### Operator Account
- **Email**: `operator@example.com`
- **Password**: `Operator@123456`
- **Role**: OPERATOR
- **Name**: Jane Smith
- **Phone**: +441234567891
- **Company**: Premium Transfers Ltd
- **Registration Number**: REG123456
- **VAT Number**: VAT123456789
- **Status**: APPROVED
- **Access**: Operator dashboard, job viewing, bidding system

---

## 🚗 Test Operator Data

### Company Details
- **Company Name**: Premium Transfers Ltd
- **Registration Number**: REG123456
- **VAT Number**: VAT123456789
- **Approval Status**: APPROVED
- **Reputation Score**: 4.8/5

### Fleet (Vehicles)
1. **Saloon**
   - Make: Toyota
   - Model: Prius
   - Registration: AB21CDE
   - Year: 2023
   - Status: Active

2. **MPV**
   - Make: Ford
   - Model: Galaxy
   - Registration: AB21FGH
   - Year: 2022
   - Status: Active

### Service Areas
- SW1A (Westminster, London)
- SW1B (Westminster, London)

---

## 📋 Test Bookings (All Scenarios)

### Booking 1: One-Way Airport Drop-off (PAID - Pending Assignment)
- **Reference**: TTS-ONEWAY001
- **Customer**: customer@example.com
- **Journey Type**: ONE_WAY
- **Pickup**: 123 Main Street, Westminster, London, SW1A 1AA
  - Lat: 51.5014
  - Lng: -0.1419
- **Dropoff**: Heathrow Airport Terminal 5, TW6 2GA
  - Lat: 51.4700
  - Lng: -0.4543
- **Date**: 7 days from seed date, 08:00 AM
- **Passengers**: 2
- **Luggage**: 2 large bags
- **Vehicle**: SALOON
- **Service**: AIRPORT_DROPOFF
- **Special Requirements**: None
- **Price**: £45.00
- **Status**: PAID
- **Job Status**: OPEN_FOR_BIDDING

---

### Booking 2: Return Journey with Meet & Greet (ASSIGNED)
- **Group Reference**: TTS-GRP-RETURN001
- **Total Price**: £152.00 (£160.00 - 5% return discount)
- **Discount**: £8.00 (Return Journey Discount)

#### Outbound Booking
- **Reference**: TTS-OUT001
- **Pickup**: 456 High Street, Manchester City Centre, M1 1AA
  - Lat: 53.4808
  - Lng: -2.2426
- **Dropoff**: Manchester Airport Terminal 1, M90 1QX
  - Lat: 53.3588
  - Lng: -2.2727
- **Date**: 14 days from seed date, 05:30 AM (early morning)
- **Passengers**: 3
- **Luggage**: 3 large bags
- **Vehicle**: MPV
- **Service**: AIRPORT_DROPOFF
- **Special Requirements**: None
- **Price**: £80.00
- **Status**: ASSIGNED
- **Assigned Operator**: Premium Transfers Ltd
- **Driver**: Mike Johnson, +447700900002, Ford Galaxy (AB21FGH)

#### Return Booking
- **Reference**: TTS-RET001
- **Pickup**: Manchester Airport Terminal 1, M90 1QX
  - Lat: 53.3588
  - Lng: -2.2727
- **Dropoff**: 456 High Street, Manchester City Centre, M1 1AA
  - Lat: 53.4808
  - Lng: -2.2426
- **Date**: 21 days from seed date, 18:45 PM
- **Flight Number**: BA1234
- **Passengers**: 3
- **Luggage**: 3 large bags
- **Vehicle**: MPV
- **Service**: AIRPORT_PICKUP
- **Special Requirements**:
  - Meet & Greet: YES (+£10)
- **Price**: £80.00
- **Status**: ASSIGNED
- **Assigned Operator**: Premium Transfers Ltd
- **Driver**: Mike Johnson, +447700900002, Ford Galaxy (AB21FGH)

---

### Booking 3: One-Way with Child Seats (COMPLETED)
- **Reference**: TTS-CHILD001
- **Customer**: customer@example.com
- **Journey Type**: ONE_WAY
- **Pickup**: 78 Victoria Road, Birmingham, B1 1AA
  - Lat: 52.4862
  - Lng: -1.8904
- **Dropoff**: Birmingham Airport, B26 3QJ
  - Lat: 52.4539
  - Lng: -1.7480
- **Date**: 3 days ago from seed date, 14:00 PM
- **Passengers**: 4 (2 adults, 2 children)
- **Luggage**: 2 large bags, 2 hand luggage
- **Vehicle**: MPV
- **Service**: AIRPORT_DROPOFF
- **Special Requirements**:
  - Child Seats: 2
- **Price**: £55.00
- **Status**: COMPLETED
- **Winning Bid**: £42.00
- **Platform Margin**: £13.00
- **Assigned Operator**: Premium Transfers Ltd
- **Driver**: Sarah Williams, +447700900003, Ford Galaxy (AB21FGH)

---

### Booking 4: Executive Airport Pickup (IN_PROGRESS)
- **Reference**: TTS-EXEC001
- **Customer**: customer@example.com
- **Journey Type**: ONE_WAY
- **Pickup**: Gatwick Airport South Terminal, RH6 0NP
  - Lat: 51.1537
  - Lng: -0.1821
- **Dropoff**: The Savoy Hotel, Strand, London, WC2R 0EZ
  - Lat: 51.5103
  - Lng: -0.1200
- **Date**: Today (current), 11:30 AM
- **Flight Number**: EK005
- **Passengers**: 2
- **Luggage**: 4 large bags
- **Vehicle**: EXECUTIVE
- **Service**: AIRPORT_PICKUP
- **Special Requirements**:
  - Meet & Greet: YES (+£10)
  - Notes: "VIP client - please use name board with 'MR SMITH'"
- **Price**: £125.00
- **Status**: IN_PROGRESS
- **Winning Bid**: £95.00
- **Platform Margin**: £30.00
- **Assigned Operator**: Premium Transfers Ltd
- **Driver**: David Brown, +447700900004, Mercedes E-Class (EX21ABC)

---

### Booking 5: Wheelchair Accessible (PAID - No Bids Yet)
- **Reference**: TTS-ACCESS001
- **Customer**: customer@example.com
- **Journey Type**: ONE_WAY
- **Pickup**: 22 Elm Street, Leeds, LS1 1AA
  - Lat: 53.7996
  - Lng: -1.5491
- **Dropoff**: Leeds Bradford Airport, LS19 7TU
  - Lat: 53.8659
  - Lng: -1.6606
- **Date**: 10 days from seed date, 09:00 AM
- **Passengers**: 2
- **Luggage**: 1 large bag, 1 hand luggage
- **Vehicle**: MPV
- **Service**: AIRPORT_DROPOFF
- **Special Requirements**:
  - Wheelchair Access: YES
  - Notes: "Passenger uses folding wheelchair - needs boot space"
- **Price**: £65.00
- **Status**: PAID
- **Job Status**: OPEN_FOR_BIDDING (No bids yet - test escalation)

---

### Booking 6: Point-to-Point Late Night (CANCELLED)
- **Reference**: TTS-CANCEL001
- **Customer**: customer@example.com
- **Journey Type**: ONE_WAY
- **Pickup**: Kings Cross Station, London, N1C 4AH
  - Lat: 51.5303
  - Lng: -0.1229
- **Dropoff**: 99 Oxford Street, London, W1D 2HG
  - Lat: 51.5154
  - Lng: -0.1410
- **Date**: 5 days from seed date, 23:30 PM (night rate applies)
- **Passengers**: 1
- **Luggage**: 1 hand luggage
- **Vehicle**: SALOON
- **Service**: POINT_TO_POINT
- **Special Requirements**: None
- **Price**: £28.00 (includes night surcharge)
- **Status**: CANCELLED
- **Cancellation Reason**: Customer requested cancellation
- **Refund**: £28.00 (full refund processed)

---

### Booking 7: Minibus Group Booking (ASSIGNED)
- **Reference**: TTS-GROUP001
- **Customer**: customer@example.com
- **Journey Type**: ONE_WAY
- **Pickup**: London Stansted Airport, CM24 1RW
  - Lat: 51.8850
  - Lng: 0.2350
- **Dropoff**: 150 Cambridge Road, Cambridge, CB1 3AA
  - Lat: 52.2053
  - Lng: 0.1218
- **Date**: 5 days from seed date, 16:00 PM
- **Flight Number**: FR8842
- **Passengers**: 12
- **Luggage**: 12 large bags
- **Vehicle**: MINIBUS
- **Service**: AIRPORT_PICKUP
- **Special Requirements**:
  - Meet & Greet: YES (+£10)
  - Notes: "University group - students returning from exchange"
- **Price**: £185.00
- **Status**: ASSIGNED
- **Winning Bid**: £145.00
- **Platform Margin**: £40.00
- **Assigned Operator**: Premium Transfers Ltd
- **Driver**: Tom Harris, +447700900005, Mercedes Sprinter (MB21XYZ)

---

## 💰 Pricing Rules

| Rule Type | Vehicle Type | Base Value | Description |
|-----------|--------------|------------|-------------|
| BASE_FARE_SALOON | SALOON | £15.00 | Base fare for Saloon vehicles |
| BASE_FARE_ESTATE | ESTATE | £18.00 | Base fare for Estate vehicles |
| BASE_FARE_MPV | MPV | £25.00 | Base fare for MPV vehicles |
| BASE_FARE_EXECUTIVE | EXECUTIVE | £35.00 | Base fare for Executive vehicles |
| BASE_FARE_MINIBUS | MINIBUS | £45.00 | Base fare for Minibus vehicles |
| PER_MILE_RATE | All | £1.50 | Cost per mile |
| NIGHT_SURCHARGE | All | 25% | 10pm-6am surcharge |
| MEET_GREET_FEE | All | £10.00 | Meet & Greet service |
| CHILD_SEAT_FEE | All | £5.00 | Per child seat |

---

## 🚗 Additional Test Operators

### Operator 2: Quick Cabs London
- **Email**: operator2@example.com
- **Password**: Operator@123456
- **Company Name**: Quick Cabs London
- **Registration**: QCL456789
- **VAT**: GB456789123
- **Status**: APPROVED
- **Service Areas**: SW1A, SW1B, WC2, EC1
- **Vehicles**:
  - Saloon: Toyota Prius (QC21ABC)
  - Executive: Mercedes E-Class (QC21XYZ)
- **Reputation**: 4.5/5

### Operator 3: Manchester Express
- **Email**: operator3@example.com
- **Password**: Operator@123456
- **Company Name**: Manchester Express Transfers
- **Registration**: MET789012
- **VAT**: GB789012456
- **Status**: APPROVED
- **Service Areas**: M1, M2, M3, M90 (Manchester Airport)
- **Vehicles**:
  - MPV: Ford Galaxy (ME21MPV)
  - Minibus: Mercedes Sprinter (ME21BUS)
- **Reputation**: 4.7/5

### Operator 4: Pending Operator (For Testing Approval)
- **Email**: pending@example.com
- **Password**: Operator@123456
- **Company Name**: New Transfers Ltd
- **Registration**: NTL999999
- **VAT**: (not provided)
- **Status**: PENDING
- **Service Areas**: LS1 (Leeds)
- **Vehicles**: None yet
- **Reputation**: N/A

---

## 🧪 How to Seed the Database

### Prerequisites
1. Backend API running (`tts-api`)
2. PostgreSQL database connected
3. Environment variables configured

### Run Seed Script
```bash
cd tts-api
npm run seed
# or
npx prisma db seed
```

### Expected Output
```
🌱 Starting database seeding...
✅ Admin user created: admin@example.com
✅ Customer user created: customer@example.com
✅ Operator 1 created: operator@example.com (Premium Transfers Ltd - APPROVED)
✅ Operator 2 created: operator2@example.com (Quick Cabs London - APPROVED)
✅ Operator 3 created: operator3@example.com (Manchester Express - APPROVED)
✅ Operator 4 created: pending@example.com (New Transfers Ltd - PENDING)
✅ Vehicles created: 8 vehicles total
✅ Service areas created
✅ Pricing rules created
✅ Bookings created: 7 bookings across different statuses
✨ Database seeding completed successfully!
```

---

## 🔍 Testing Scenarios

### 1. Customer Login & Dashboard
1. Go to `/sign-in`
2. Login with `customer@example.com` / `Customer@123456`
3. Should redirect to `/dashboard`
4. Should see 7 bookings in various statuses:
   - 2 PAID (awaiting assignment)
   - 3 ASSIGNED (driver details visible)
   - 1 COMPLETED (past booking)
   - 1 CANCELLED (with refund)

### 2. Operator Login & Dashboard
1. Go to `/sign-in`
2. Login with `operator@example.com` / `Operator@123456`
3. Should redirect to `/operator/dashboard`
4. Should see:
   - Available jobs in service area (TTS-ONEWAY001, TTS-ACCESS001)
   - Assigned jobs (TTS-OUT001, TTS-RET001, TTS-GROUP001, TTS-EXEC001)
   - Completed jobs (TTS-CHILD001)
   - Earnings summary

### 3. Admin Login & Panel
1. Go to `/sign-in`
2. Login with `admin@example.com` / `Admin@123456`
3. Should redirect to `/admin/dashboard`
4. Should see:
   - KPIs: 7 bookings, revenue totals, 4 operators
   - 1 pending operator approval (pending@example.com)
   - All bookings across all statuses
   - Bidding activity

### 4. New Operator Registration
1. Go to `/operators/register`
2. Fill in the form:
   - **Personal Details**:
     - First Name: Test
     - Last Name: Operator
     - Email: testoperator@example.com
     - Phone: +447700900000
     - Password: TestOp@123456
     - Confirm Password: TestOp@123456
   - **Company Details**:
     - Company Name: Test Transport Ltd
     - Registration Number: 87654321
     - VAT Number: GB987654321 (optional)
3. Submit form
4. Should auto-login and redirect to `/operator/dashboard`
5. Status will be PENDING (needs admin approval)

### 5. Bidding Flow Test
1. Login as `operator@example.com` / `Operator@123456`
2. View available job TTS-ONEWAY001 (Airport dropoff, £45)
3. Submit bid: £35
4. Login as `operator2@example.com` / `Operator@123456`
5. View same job and submit bid: £32
6. Wait for bidding window to close (or admin closes early)
7. Lowest bid (£32) wins, operator2 is assigned
8. Customer sees driver details when assigned

### 6. Admin Operator Approval
1. Login as `admin@example.com` / `Admin@123456`
2. Go to `/admin/operators`
3. Find pending@example.com (New Transfers Ltd - PENDING)
4. Click to view details
5. Approve or Reject operator
6. Test: Login as pending@example.com should now have access

### 7. Booking Modification (Admin)
1. Login as admin
2. Go to `/admin/bookings`
3. Select TTS-ONEWAY001
4. Modify pickup date/time
5. Verify customer would receive notification

### 8. Refund Processing (Admin)
1. Login as admin
2. Go to `/admin/bookings`
3. View TTS-CANCEL001 (already cancelled)
4. Verify refund was processed
5. Test partial refund on another booking

---

## 🎯 Quick Booking Data for Manual Testing

### Use in Frontend Quote Form
| Scenario | Pickup | Dropoff | Date/Time | Passengers | Vehicle |
|----------|--------|---------|-----------|------------|---------|
| London Airport | 10 Downing Street, SW1A 2AA | Heathrow T5, TW6 2GA | Tomorrow 8AM | 2 | Saloon |
| Manchester | 1 Piccadilly, M1 1RG | Manchester Airport, M90 1QX | +7 days 6AM | 4 | MPV |
| Executive | Gatwick Airport, RH6 0NP | The Ritz, W1J 9BR | +3 days 2PM | 2 | Executive |
| Group | Stansted Airport, CM24 1RW | Cambridge CB1 1PT | +5 days 4PM | 10 | Minibus |
| Night | Kings Cross, N1C 4AH | Canary Wharf, E14 5AB | +2 days 11PM | 1 | Saloon |

---

## 📝 Notes

- All passwords follow the pattern: `Role@123456` (e.g., Admin@123456, Customer@123456)
- Phone numbers use UK format: `+44` prefix or `0` prefix
- VAT numbers use UK format: `GB` + 9 digits
- All test data is created with the seed script
- Booking dates are relative to seed date
- 3 operators pre-approved (APPROVED) for testing bidding system
- 1 operator pending (PENDING) for testing approval flow

---

## 🎨 Theme & Header Variants

The application uses a consistent theme with two header variants:

### Header Variants

| Variant | Background | Text Color | Use Case |
|---------|------------|------------|----------|
| `transparent` (default) | Transparent → White on scroll | White → Dark on scroll | Pages with dark hero backgrounds (Landing, About, Contact, Quote Form, Sign-In) |
| `solid` | Always white with shadow | Always dark | Pages with light backgrounds (Quote Result, Checkout, Confirmation) |

### Usage

```tsx
// Default - for pages with dark hero sections
<Header />

// Solid - for pages with light backgrounds
<Header variant="solid" />
```

### Color Scheme (defined in globals.css @theme inline)

| Color | Purpose | Example Usage |
|-------|---------|---------------|
| Primary (Slate Blue) | Trust, professionalism | Headers, navigation, CTAs |
| Secondary (Teal) | Reliability, journey | Accents, gradients |
| Accent (Coral/Rose) | Action, attention | Buttons, success states, highlights |
| Neutral (Gray) | Text, backgrounds | Body text, cards, borders |

---

## 🛒 Customer Booking Flow (End-to-End)

This section documents the complete customer journey from getting a quote to booking confirmation.

### Flow Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Home Page     │───▶│   Quote Form    │───▶│  Quote Result   │───▶│    Checkout     │───▶│  Confirmation   │
│   /             │    │   /quote        │    │  /quote/result  │    │   /checkout     │    │  /checkout/     │
│                 │    │                 │    │                 │    │                 │    │  confirmation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Step 1: Quote Form (`/quote`)

**User Actions:**
1. Select journey type (One-Way or Return)
2. Enter pickup location (with Google Maps autocomplete)
3. Enter drop-off location (with Google Maps autocomplete)
4. Select service type (Airport Pickup, Airport Drop-off, Point-to-Point)
5. Choose date/time (and return date/time if return journey)
6. Enter optional flight number
7. Select passengers and luggage count
8. Choose vehicle type (Saloon, Estate, MPV, Executive, Minibus)
9. Add special requirements (child seats, wheelchair access, pets)
10. Enter contact details (name, email, phone)
11. Click "Get Quote"

**Technical Flow:**
- Form validates all fields using Zod schemas
- Calls `POST /api/maps/quote/single` or `POST /api/maps/quote/return`
- Stores quote data in `sessionStorage` under key `quoteData`
- Redirects to `/quote/result`

### Step 2: Quote Result (`/quote/result`)

**User Sees:**
- Journey summary (pickup, drop-off, date/time)
- Contact details summary
- Price breakdown (base fare, distance, surcharges)
- Total price with "Proceed to Book" button

**User Actions:**
- Review quote details
- Click "Proceed to Book" to continue
- Or click "Edit Quote Details" to go back

**Technical Flow:**
- Reads quote data from `sessionStorage`
- Displays formatted quote breakdown
- On "Proceed to Book", redirects to `/checkout`

### Step 3: Checkout (`/checkout`)

**For New Users (Default View):**
1. Shows pre-filled contact details from quote form
2. User only needs to create a password (2 fields)
3. Click "Continue to Payment"
4. Account is auto-created and user is logged in
5. Booking is created with status `PENDING_PAYMENT`
6. Payment section appears

**For Existing Users:**
1. Click "Already have an account? Sign in here"
2. Enter email and password
3. Proceed to payment

**Payment Section:**
1. Shows amount to pay
2. Enter card details (test card: 4242 4242 4242 4242)
3. Click "Pay £XX.XX"
4. Payment is processed via Stripe
5. Booking status changes to `PAID`
6. Redirects to confirmation

**Technical Flow:**
- Reads quote data from `sessionStorage`
- AuthSection: Creates user account with password
- After auth: Creates booking via `POST /api/bookings` or `POST /api/bookings/return`
- PaymentSection: Creates payment intent via `POST /api/payments/intent`
- Confirms payment via `POST /api/payments/confirm`
- Stores confirmation data in `sessionStorage` under key `bookingConfirmation`
- Clears quote data and redirects to `/checkout/confirmation`

### Step 4: Confirmation (`/checkout/confirmation`)

**User Sees:**
- Success message with check icon
- Booking reference (e.g., TTS-ABC12345)
- "What happens next" information:
  - Confirmation email sent
  - Driver assignment notification (24h before pickup)
  - SMS reminder on day of travel
- Links to view bookings or return home

**Technical Flow:**
- Reads confirmation data from `sessionStorage`
- Displays booking reference
- User can copy reference to clipboard

---

## 🔑 Key Implementation Details

### Session Storage Keys

| Key | Purpose | Set By | Read By |
|-----|---------|--------|---------|
| `quoteData` | Stores complete quote form data + API response | `/quote` form | `/quote/result`, `/checkout` |
| `bookingConfirmation` | Stores booking reference after payment | `/checkout` | `/checkout/confirmation` |

### Authentication Flow at Checkout

1. **Middleware**: `/checkout` is a public route (no auth required)
2. **CheckoutContent**: Checks if user is logged in via `getCurrentUser()`
3. **If not logged in**: Shows AuthSection (password creation form)
4. **If logged in**: Skips directly to payment step
5. **AuthSection**:
   - Default mode: `create-password` (for new users)
   - Shows pre-filled details from quote form
   - Only asks for password + confirm password
   - Auto-registers user and logs them in
   - If email exists: Shows error and switches to login mode

### Booking Creation Timing

1. **After user authenticates** (not after payment)
2. Booking created with status `PENDING_PAYMENT`
3. Booking ID used to create payment intent
4. After successful payment: Booking status → `PAID`
5. Job is broadcast to operators for bidding

### Stripe Integration (Mock Mode)

For development/testing:
- Uses mock payment flow (no real Stripe API calls)
- Test card: `4242 4242 4242 4242`
- Any expiry (future date) and CVC works
- Backend confirms payment in mock mode

---

## 🧪 Testing the Booking Flow

### Test Scenario: New Customer Booking

1. **Go to** `/quote`
2. **Fill form with test data:**
   - Journey Type: One-Way
   - Pickup: "London Heathrow Airport" (select from autocomplete)
   - Drop-off: "10 Downing Street, London" (select from autocomplete)
   - Service: Airport Pickup
   - Date: Tomorrow, 10:00 AM
   - Passengers: 2
   - Luggage: 2
   - Vehicle: Saloon
   - Name: Test User
   - Email: testuser@example.com
   - Phone: +447700900123
3. **Click** "Get Quote"
4. **On Quote Result page:**
   - Verify price breakdown is correct
   - Click "Proceed to Book"
5. **On Checkout page:**
   - Verify your details are pre-filled
   - Enter password: `TestUser@123`
   - Confirm password: `TestUser@123`
   - Click "Continue to Payment"
6. **In Payment section:**
   - Card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123
   - Click "Pay £XX.XX"
7. **On Confirmation page:**
   - Note down booking reference (e.g., TTS-ABC12345)
   - Click "View My Bookings"
8. **On Dashboard:**
   - Should see new booking with status "Awaiting Driver"

---

**Last Updated**: December 31, 2024

