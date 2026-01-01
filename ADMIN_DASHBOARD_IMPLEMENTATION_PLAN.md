# ADMIN DASHBOARD IMPLEMENTATION PLAN

**Priority**: IMMEDIATE  
**Estimated Time**: 3-4 days  
**Dependencies**: Backend Admin API (✅ Complete)

---

## 📋 PAGES TO IMPLEMENT

### 1. Admin Dashboard Home (`/admin`)
**Route**: `app/admin/page.tsx`

#### Features:
- **KPI Cards** (4 cards in grid)
  - Total Bookings (with trend)
  - Active Operators (approved)
  - Pending Approvals (operators awaiting approval)
  - Total Revenue (this month)

- **Recent Activity Feed**
  - Latest bookings
  - New operator registrations
  - Recent bids

- **Alerts Section**
  - Jobs with no bids (escalated)
  - Operators pending approval
  - Failed payments

- **Quick Actions**
  - Approve pending operators
  - View escalated jobs
  - Generate reports

#### Backend API:
- ✅ `GET /admin/dashboard` - Returns all KPIs and stats

---

### 2. Operators Management (`/admin/operators`)
**Route**: `app/admin/operators/page.tsx`

#### Features:
- **Operators List Table**
  - Columns: Company Name, Email, Status, Registration Date, Actions
  - Filters: Status (PENDING, APPROVED, REJECTED, SUSPENDED)
  - Search: By company name or email
  - Pagination: 20 per page

- **Status Badges**
  - PENDING (yellow)
  - APPROVED (green)
  - REJECTED (red)
  - SUSPENDED (gray)

- **Actions**
  - View Details (modal or separate page)
  - Approve/Reject (for PENDING)
  - Suspend/Activate (for APPROVED)

#### Backend API:
- ✅ `GET /admin/operators?status=PENDING&page=1&limit=20`
- ✅ `PATCH /admin/operators/:id/approval` - Body: `{ status: 'APPROVED' | 'REJECTED', notes?: string }`

---

### 3. Operator Details (`/admin/operators/:id`)
**Route**: `app/admin/operators/[id]/page.tsx`

#### Features:
- **Operator Profile**
  - Company details (name, registration number, VAT)
  - Contact information
  - Service areas
  - Available vehicle types
  - Documents (license, insurance) - view/download

- **Performance Stats**
  - Total jobs won
  - Total earnings
  - Average bid amount
  - Completion rate

- **Recent Jobs**
  - List of jobs assigned to this operator
  - Status of each job

- **Approval Actions**
  - Approve with notes
  - Reject with reason
  - Suspend account

#### Backend API:
- ✅ `GET /operators/profile/:id`
- ✅ `PATCH /admin/operators/:id/approval`

---

### 4. Bookings Management (`/admin/bookings`)
**Route**: `app/admin/bookings/page.tsx`

#### Features:
- **Bookings List Table**
  - Columns: Reference, Customer, Pickup, Dropoff, Date, Status, Price, Actions
  - Filters: Status, Date Range, Vehicle Type
  - Search: By reference or customer email
  - Pagination: 20 per page

- **Status Badges**
  - PENDING_PAYMENT (yellow)
  - PAID (blue)
  - ASSIGNED (purple)
  - IN_PROGRESS (orange)
  - COMPLETED (green)
  - CANCELLED (red)
  - REFUNDED (gray)

- **Actions**
  - View Details
  - Modify Booking
  - Cancel Booking
  - Process Refund

#### Backend API:
- ✅ `GET /admin/bookings?status=PAID&page=1&limit=20&startDate=2025-01-01&endDate=2025-01-31`

---

### 5. Booking Details (`/admin/bookings/:id`)
**Route**: `app/admin/bookings/[id]/page.tsx`

#### Features:
- **Booking Information**
  - Booking reference
  - Customer details
  - Journey details (pickup, dropoff, date/time)
  - Vehicle type, passengers, luggage
  - Special requirements
  - Flight number (if airport transfer)

- **Pricing Breakdown**
  - Base fare
  - Distance charge
  - Surcharges (night, holiday, airport fees)
  - Total price

- **Job & Bidding Info** (if job created)
  - Job status
  - Number of bids received
  - Winning bid amount
  - Assigned operator
  - Platform margin (Customer Price - Winning Bid)

- **Payment Information**
  - Payment status
  - Stripe transaction ID
  - Payment date

- **Actions**
  - Modify booking (date/time)
  - Cancel booking
  - Process full/partial refund
  - Contact customer

#### Backend API:
- ✅ `GET /bookings/:id`
- ✅ `POST /admin/bookings/:id/refund` - Body: `{ amount: number, reason: string }`

---

### 6. Jobs Management (`/admin/jobs`)
**Route**: `app/admin/jobs/page.tsx`

#### Features:
- **Jobs List Table**
  - Columns: Job ID, Booking Ref, Pickup, Date, Status, Bids Count, Actions
  - Filters: Status (OPEN, BIDDING_CLOSED, ASSIGNED, COMPLETED, NO_BIDS)
  - Show escalated jobs (no bids) at top
  - Pagination: 20 per page

- **Escalated Jobs Alert**
  - Highlighted section for jobs with no bids
  - Quick actions: Reopen bidding, Manual assignment

- **Actions**
  - View job details with all bids
  - Close bidding early
  - Manually assign to operator
  - Reopen bidding

#### Backend API:
- ✅ `GET /admin/jobs?status=OPEN&page=1&limit=20`
- ✅ `GET /admin/jobs/escalated` - Jobs with no bids

---

### 7. Job Details (`/admin/jobs/:id`)
**Route**: `app/admin/jobs/[id]/page.tsx`

#### Features:
- **Job Information**
  - Job ID
  - Linked booking reference
  - Journey details
  - Customer price (ceiling)
  - Bidding window (start/end time)
  - Countdown timer (if still open)

- **Bids List**
  - Table: Operator, Bid Amount, Submitted At, Status
  - Highlight winning bid (lowest)
  - Show platform margin for each bid

- **Actions**
  - Close bidding early (auto-assign winner)
  - Manually assign to specific operator (override)
  - Reopen bidding (if no bids)
  - Contact operators

#### Backend API:
- ✅ `GET /admin/jobs/:jobId` - Returns job with all bids
- ✅ `POST /admin/jobs/:jobId/close-bidding`
- ✅ `POST /admin/jobs/:jobId/assign` - Body: `{ operatorId: string, bidAmount: number }`
- ✅ `POST /admin/jobs/:jobId/reopen-bidding?hours=24`

---

### 8. Pricing Rules (`/admin/pricing`)
**Route**: `app/admin/pricing/page.tsx`

#### Features:
- **Pricing Rules List**
  - Base fares by vehicle type
  - Per-mile rates
  - Time-based surcharges (night, peak)
  - Holiday surcharges
  - Airport fees by airport
  - Return journey discount

- **Actions**
  - Edit pricing rule
  - Add new rule
  - Delete rule
  - Enable/disable rule

#### Backend API:
- ✅ `GET /admin/pricing-rules`
- ✅ `POST /admin/pricing-rules` - Create new rule
- ✅ `PATCH /admin/pricing-rules/:id` - Update rule
- ✅ `DELETE /admin/pricing-rules/:id` - Delete rule

---

### 9. Financial Reports (`/admin/reports`)
**Route**: `app/admin/reports/page.tsx`

#### Features:
- **Revenue Report**
  - Date range selector
  - Total revenue (customer payments)
  - Total payouts (to operators)
  - Platform commission (revenue - payouts)
  - Chart: Revenue over time

- **Payout Report**
  - Pending payouts
  - Completed payouts
  - Payout schedule
  - Export to CSV

#### Backend API:
- ✅ `GET /admin/reports/revenue?startDate=2025-01-01&endDate=2025-01-31`
- ✅ `GET /admin/reports/payouts?startDate=2025-01-01&endDate=2025-01-31`

---

## 🎨 COMPONENTS TO CREATE

### Shared Admin Components
1. **AdminLayout** (`components/layout/AdminLayout.tsx`)
   - Sidebar navigation
   - Top bar with user menu
   - Breadcrumbs

2. **KPICard** (`components/features/admin/KPICard.tsx`)
   - Icon, title, value, trend

3. **DataTable** (`components/ui/DataTable.tsx`)
   - Generic table with sorting, filtering, pagination

4. **StatusBadge** (`components/ui/StatusBadge.tsx`)
   - Color-coded status badges

5. **ConfirmDialog** (`components/ui/ConfirmDialog.tsx`)
   - Confirmation modal for destructive actions

---

## 📦 API CLIENT FUNCTIONS TO CREATE

Create `lib/api/admin.api.ts`:

```typescript
export const adminApi = {
  // Dashboard
  getDashboard: () => apiClient.get('/admin/dashboard'),
  
  // Operators
  listOperators: (query) => apiClient.get('/admin/operators', { params: query }),
  updateOperatorApproval: (id, data) => apiClient.patch(`/admin/operators/${id}/approval`, data),
  
  // Bookings
  listBookings: (query) => apiClient.get('/admin/bookings', { params: query }),
  refundBooking: (id, data) => apiClient.post(`/admin/bookings/${id}/refund`, data),
  
  // Jobs
  listJobs: (query) => apiClient.get('/admin/jobs', { params: query }),
  getEscalatedJobs: () => apiClient.get('/admin/jobs/escalated'),
  getJobDetails: (jobId) => apiClient.get(`/admin/jobs/${jobId}`),
  manualJobAssignment: (jobId, data) => apiClient.post(`/admin/jobs/${jobId}/assign`, data),
  closeBiddingEarly: (jobId) => apiClient.post(`/admin/jobs/${jobId}/close-bidding`),
  reopenBidding: (jobId, hours) => apiClient.post(`/admin/jobs/${jobId}/reopen-bidding?hours=${hours}`),
  
  // Pricing
  listPricingRules: () => apiClient.get('/admin/pricing-rules'),
  createPricingRule: (data) => apiClient.post('/admin/pricing-rules', data),
  updatePricingRule: (id, data) => apiClient.patch(`/admin/pricing-rules/${id}`, data),
  deletePricingRule: (id) => apiClient.delete(`/admin/pricing-rules/${id}`),
  
  // Reports
  getRevenueReport: (query) => apiClient.get('/admin/reports/revenue', { params: query }),
  getPayoutsReport: (query) => apiClient.get('/admin/reports/payouts', { params: query }),
};
```

---

**Next Step**: Start with Admin Dashboard Home (`/admin/page.tsx`) and AdminLayout component.

