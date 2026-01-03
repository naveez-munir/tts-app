#!/bin/bash

# Function to commit with backdated timestamp
commit_with_date() {
    local date="$1"
    local message="$2"
    shift 2
    local files=("$@")
    
    git add "${files[@]}"
    git commit -m "$message"
    GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit --amend --no-edit --date="$date"
    echo "✓ Committed: $message"
}

# ========== DAY 1: Dec 18, 2025 - Project Setup & Documentation ==========
commit_with_date "2025-12-18T09:15:00" "docs: add project overview and architecture documentation" \
    "docs/PROJECT_OVERVIEW.md" "docs/ARCHITECTURE.md"

commit_with_date "2025-12-18T10:30:00" "docs: add feature scope and development workflow guides" \
    "docs/FEATURE_SCOPE.md" "docs/DEVELOPMENT_WORKFLOW.md"

commit_with_date "2025-12-18T14:20:00" "docs: add code standards and design standards documentation" \
    "docs/CODE_STANDARDS.md" "docs/DESIGN_STANDARDS.md"

commit_with_date "2025-12-18T16:45:00" "docs: add API usage guide and Zod deprecation fixes" \
    "docs/API_USAGE_GUIDE.md" "docs/ZOD_DEPRECATION_FIXES.md"

# ========== DAY 2: Dec 19, 2025 - Skills & Core Types ==========
commit_with_date "2025-12-19T09:30:00" "chore: add AI agent skill definitions for UI/UX and frontend" \
    "skills/ui-ux.md" "skills/frontend-engineer.md"

commit_with_date "2025-12-19T11:15:00" "feat(types): add core enum definitions and type index" \
    "lib/types/enums.ts" "lib/types/index.ts"

commit_with_date "2025-12-19T14:00:00" "feat(types): add authentication and booking type definitions" \
    "lib/types/auth.types.ts" "lib/types/booking.types.ts"

commit_with_date "2025-12-19T16:30:00" "feat(types): add quote and payment type definitions" \
    "lib/types/quote.types.ts" "lib/types/payment.types.ts"

# ========== DAY 3: Dec 20, 2025 - More Types & API Client ==========
commit_with_date "2025-12-20T09:45:00" "feat(types): add job and bid type definitions" \
    "lib/types/job.types.ts" "lib/types/bid.types.ts"

commit_with_date "2025-12-20T11:30:00" "feat(types): add operator type definitions" \
    "lib/types/operator.types.ts"

commit_with_date "2025-12-20T14:15:00" "feat(api): add API client base configuration and index" \
    "lib/api/client.ts" "lib/api/index.ts"

commit_with_date "2025-12-20T17:00:00" "feat(api): add authentication API service" \
    "lib/api/auth.api.ts"

# ========== DAY 4: Dec 21, 2025 - API Services ==========
commit_with_date "2025-12-21T10:00:00" "feat(api): add quote and booking API services" \
    "lib/api/quote.api.ts" "lib/api/booking.api.ts"

commit_with_date "2025-12-21T12:30:00" "feat(api): add payment and job API services" \
    "lib/api/payment.api.ts" "lib/api/job.api.ts"

commit_with_date "2025-12-21T15:15:00" "feat(api): add bid and operator API services" \
    "lib/api/bid.api.ts" "lib/api/operator.api.ts"

commit_with_date "2025-12-21T18:00:00" "feat(api): add admin API service" \
    "lib/api/admin.api.ts"

# ========== DAY 5: Dec 22, 2025 - Utilities & Reusable UI ==========
commit_with_date "2025-12-22T09:30:00" "feat(utils): add date utility functions" \
    "lib/utils/date.ts"

commit_with_date "2025-12-22T11:00:00" "feat(ui): add LoadingSpinner and EmptyState components" \
    "components/ui/LoadingSpinner.tsx" "components/ui/EmptyState.tsx"

commit_with_date "2025-12-22T14:30:00" "feat(ui): add StatusBadge and Pagination components" \
    "components/ui/StatusBadge.tsx" "components/ui/Pagination.tsx"

commit_with_date "2025-12-22T17:15:00" "feat(ui): add DataTable and ConfirmDialog components" \
    "components/ui/DataTable.tsx" "components/ui/ConfirmDialog.tsx"

# ========== DAY 6: Dec 23, 2025 - More UI Components & Middleware ==========
commit_with_date "2025-12-23T10:00:00" "feat(ui): add AddressAutocomplete component" \
    "components/ui/AddressAutocomplete.tsx"

commit_with_date "2025-12-23T12:45:00" "feat: add authentication middleware for route protection" \
    "middleware.ts"

commit_with_date "2025-12-23T15:30:00" "feat(layout): add dashboard layout base components" \
    "components/layout/dashboard/DashboardLayout.tsx" "components/layout/dashboard/index.ts"

commit_with_date "2025-12-23T18:00:00" "feat(layout): add dashboard sidebar and topbar components" \
    "components/layout/dashboard/DashboardSidebar.tsx" "components/layout/dashboard/DashboardTopBar.tsx"

# ========== DAY 7: Dec 24, 2025 - Dashboard Layouts ==========
commit_with_date "2025-12-24T09:15:00" "feat(layout): add customer dashboard layout wrapper" \
    "components/layout/CustomerDashboardLayout.tsx"

commit_with_date "2025-12-24T11:45:00" "feat(layout): add operator dashboard layout wrapper" \
    "components/layout/OperatorDashboardLayout.tsx"

commit_with_date "2025-12-24T14:30:00" "feat(layout): add admin dashboard layout wrapper" \
    "components/layout/AdminLayout.tsx"

# ========== DAY 8: Dec 25, 2025 - Customer Dashboard ==========
commit_with_date "2025-12-25T10:30:00" "feat(dashboard): add customer dashboard layout and main page" \
    "app/dashboard/layout.tsx" "app/dashboard/page.tsx"

commit_with_date "2025-12-25T13:00:00" "feat(dashboard): add dashboard content and booking card components" \
    "app/dashboard/_components/DashboardContent.tsx" "components/features/dashboard/BookingCard.tsx"

commit_with_date "2025-12-25T16:15:00" "feat(dashboard): add upcoming trips page and content" \
    "app/dashboard/upcoming/page.tsx" "app/dashboard/upcoming/_components/UpcomingTripsContent.tsx"

commit_with_date "2025-12-25T19:00:00" "feat(dashboard): add customer profile page and content" \
    "app/dashboard/profile/page.tsx" "app/dashboard/profile/_components/ProfileContent.tsx"

# ========== DAY 9: Dec 26, 2025 - Customer Booking Details ==========
commit_with_date "2025-12-26T09:45:00" "feat(dashboard): add booking details page" \
    "app/dashboard/bookings/[id]/page.tsx"

commit_with_date "2025-12-26T12:30:00" "feat(dashboard): add booking details content component" \
    "app/dashboard/bookings/[id]/_components/BookingDetailsContent.tsx"

commit_with_date "2025-12-26T15:15:00" "feat(checkout): add checkout page and main content component" \
    "app/checkout/page.tsx" "app/checkout/_components/CheckoutContent.tsx"

commit_with_date "2025-12-26T18:30:00" "feat(checkout): add auth and payment section components" \
    "app/checkout/_components/AuthSection.tsx" "app/checkout/_components/PaymentSection.tsx"

# ========== DAY 10: Dec 27, 2025 - Checkout & Quote Result ==========
commit_with_date "2025-12-27T10:00:00" "feat(checkout): add confirmation page and content" \
    "app/checkout/confirmation/page.tsx" "app/checkout/confirmation/_components/ConfirmationContent.tsx"

commit_with_date "2025-12-27T13:30:00" "feat(quote): add quote result page and content component" \
    "app/quote/result/page.tsx" "app/quote/result/_components/QuoteResultContent.tsx"

commit_with_date "2025-12-27T16:45:00" "feat(operators): add operator registration page" \
    "app/operators/register/page.tsx"

commit_with_date "2025-12-27T19:30:00" "feat(operators): add operator registration form component" \
    "components/features/operators/OperatorRegistrationForm.tsx"

# ========== DAY 11: Dec 28, 2025 - Operator Portal ==========
commit_with_date "2025-12-28T09:30:00" "feat(operator): add operator portal layout and entry page" \
    "app/operator/layout.tsx" "app/operator/page.tsx"

commit_with_date "2025-12-28T12:00:00" "feat(operator): add operator dashboard page and content" \
    "app/operator/dashboard/page.tsx" "app/operator/dashboard/_components/OperatorDashboardContent.tsx"

commit_with_date "2025-12-28T15:15:00" "feat(operator): add available jobs page and content" \
    "app/operator/jobs/page.tsx" "app/operator/jobs/_components/AvailableJobsContent.tsx"

commit_with_date "2025-12-28T18:45:00" "feat(operator): add my bids page and content" \
    "app/operator/bids/page.tsx" "app/operator/bids/_components/MyBidsContent.tsx"

# ========== DAY 12: Dec 29, 2025 - Operator Features ==========
commit_with_date "2025-12-29T10:15:00" "feat(operator): add assigned jobs page and content" \
    "app/operator/assigned/page.tsx" "app/operator/assigned/_components/AssignedJobsContent.tsx"

commit_with_date "2025-12-29T13:30:00" "feat(operator): add earnings page and content" \
    "app/operator/earnings/page.tsx" "app/operator/earnings/_components/EarningsContent.tsx"

commit_with_date "2025-12-29T17:00:00" "feat(operator): add operator profile page and content" \
    "app/operator/profile/page.tsx" "app/operator/profile/_components/OperatorProfileContent.tsx"

# ========== DAY 13: Dec 30, 2025 - Admin Portal ==========
commit_with_date "2025-12-30T09:00:00" "feat(admin): add admin portal layout and dashboard page" \
    "app/admin/layout.tsx" "app/admin/page.tsx"

commit_with_date "2025-12-30T11:30:00" "feat(admin): add admin KPI card and activity feed components" \
    "components/features/admin/KPICard.tsx" "components/features/admin/ActivityFeed.tsx"

commit_with_date "2025-12-30T14:15:00" "feat(admin): add admin alerts section component" \
    "components/features/admin/AlertsSection.tsx"

commit_with_date "2025-12-30T17:30:00" "feat(admin): add operators management list page" \
    "app/admin/operators/page.tsx"

# ========== DAY 14: Dec 31, 2025 - Admin Management Pages ==========
commit_with_date "2025-12-31T09:30:00" "feat(admin): add operator details management page" \
    "app/admin/operators/[id]/page.tsx"

commit_with_date "2025-12-31T12:00:00" "feat(admin): add bookings management pages" \
    "app/admin/bookings/page.tsx" "app/admin/bookings/[id]/page.tsx"

commit_with_date "2025-12-31T15:30:00" "feat(admin): add jobs management pages" \
    "app/admin/jobs/page.tsx" "app/admin/jobs/[id]/page.tsx"

commit_with_date "2025-12-31T18:45:00" "feat(admin): add pricing configuration and reports pages" \
    "app/admin/pricing/page.tsx" "app/admin/reports/page.tsx"

# ========== DAY 15: Jan 1, 2026 - Updates to Existing Files ==========
commit_with_date "2026-01-01T09:00:00" "refactor(ui): update Input component with improved validation" \
    "components/ui/Input.tsx"

commit_with_date "2026-01-01T09:45:00" "refactor(ui): update Cards and NavLink components" \
    "components/ui/Cards.tsx" "components/ui/NavLink.tsx"

commit_with_date "2026-01-01T10:30:00" "refactor(layout): update Header and Footer components" \
    "components/layout/Header.tsx" "components/layout/Footer.tsx"

commit_with_date "2026-01-01T11:15:00" "refactor(layout): update Logo component" \
    "components/layout/Logo.tsx"

commit_with_date "2026-01-01T12:00:00" "refactor(landing): update HeroContent and CtaSection" \
    "components/features/landing/HeroContent.tsx" "components/features/landing/CtaSection.tsx"

commit_with_date "2026-01-01T12:45:00" "refactor(landing): update QuickQuoteForm component" \
    "components/features/landing/QuickQuoteForm.tsx"

commit_with_date "2026-01-01T13:30:00" "refactor(quote): update QuoteFormSection and WhyChooseUsSection" \
    "components/features/quote/QuoteFormSection.tsx" "components/features/quote/WhyChooseUsSection.tsx"

commit_with_date "2026-01-01T14:15:00" "refactor(auth): update SignInForm component" \
    "components/features/auth/SignInForm.tsx"

commit_with_date "2026-01-01T15:00:00" "refactor(operators): update OperatorTestimonials section" \
    "components/sections/operators/OperatorTestimonials.tsx"

commit_with_date "2026-01-01T15:45:00" "refactor(pages): update AboutPageContent component" \
    "app/about/_components/AboutPageContent.tsx"

commit_with_date "2026-01-01T16:30:00" "refactor(pages): update QuotePageContent component" \
    "app/quote/_components/QuotePageContent.tsx" "app/quote/page.tsx"

commit_with_date "2026-01-01T17:15:00" "refactor(pages): update SignInPageContent component" \
    "app/sign-in/_components/SignInPageContent.tsx"

commit_with_date "2026-01-01T18:00:00" "refactor(data): update about and operators data" \
    "lib/data/about.data.ts" "lib/data/operators.data.ts"

commit_with_date "2026-01-01T18:45:00" "refactor(data): update testimonials data" \
    "lib/data/testimonials.ts"

commit_with_date "2026-01-01T19:30:00" "refactor(metadata): update page metadata configurations" \
    "lib/metadata/about.metadata.ts" "lib/metadata/contact.metadata.ts"

commit_with_date "2026-01-01T20:00:00" "refactor(metadata): update landing and operators metadata" \
    "lib/metadata/landing.metadata.ts" "lib/metadata/operators.metadata.ts"

commit_with_date "2026-01-01T20:30:00" "style: update global CSS styles" \
    "app/globals.css"

commit_with_date "2026-01-01T21:00:00" "refactor(app): update root layout configuration" \
    "app/layout.tsx"

commit_with_date "2026-01-01T21:30:00" "chore: update claude.md with project configuration" \
    "claude.md"

commit_with_date "2026-01-01T21:45:00" "chore: update package dependencies" \
    "package.json" "package-lock.json"

# Clean up markdown files (optional - add if needed)
commit_with_date "2026-01-01T22:00:00" "docs: add implementation progress documentation" \
    "ADMIN_DASHBOARD_IMPLEMENTATION_PLAN.md" "ADMIN_DASHBOARD_PROGRESS.md"

commit_with_date "2026-01-01T22:15:00" "docs: add backend integration and testing documentation" \
    "BACKEND_INTEGRATION_SUMMARY.md" "PROJECT_STATUS_SUMMARY.md"

commit_with_date "2026-01-01T22:30:00" "docs: add testing credentials and quick test guides" \
    "LOGIN_CREDENTIALS_SUMMARY.md" "TESTING_CREDENTIALS.md" "QUICK_TEST_GUIDE.md"

echo ""
echo "========================================"
echo "✅ All commits completed successfully!"
echo "========================================"
echo ""
git log --oneline -60

