# CODE CONSISTENCY STANDARDS

---

## TypeScript Standards

### Type Definitions
- Enable `strict: true` in tsconfig.json
- Use `interface` for extendable objects, `type` for unions/intersections
- Avoid `any` - use `unknown` with type guards
- Use `enum` for fixed value sets
- Define Zod schemas alongside TypeScript types
- Use `z.infer<typeof schema>` to derive types

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Types/Interfaces | PascalCase | `UserProfile`, `BookingRequest` |
| Enums | PascalCase + SCREAMING_SNAKE values | `enum UserRole { CUSTOMER = 'CUSTOMER' }` |
| Variables/Functions | camelCase | `calculateQuote`, `bookingData` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_PASSENGERS`, `DEFAULT_BIDDING_WINDOW` |
| React Components | PascalCase | `BookingForm`, `VehicleCard` |

### File Naming

- ✅ **React Components**: PascalCase (`BookingForm.tsx`, `Header.tsx`)
- ✅ **Route Folders**: kebab-case (`app/operators/`, `app/about/`)
- ✅ **Utilities**: camelCase (`utils.ts`, `constants.ts`)
- ❌ **Avoid**: `booking-form.tsx`, `bookingForm.tsx`, `booking_form.tsx`

---

## Database Field Naming

- Use snake_case for PostgreSQL columns (`first_name`, `created_at`)
- Prisma auto-maps to camelCase (`firstName`, `createdAt`)
- Boolean fields: prefix `is_` or `has_` (`is_active`, `has_wheelchair_access`)
- Timestamps: suffix `_at` (`created_at`, `updated_at`)
- Foreign keys: suffix `_id` (`user_id`, `operator_id`)

---

## API Conventions

### Endpoint Structure (RESTful)
- kebab-case for multi-word: `/api/transport-companies`
- Resource-based: `/api/bookings`, `/api/jobs`, `/api/bids`
- Nested resources: `/api/jobs/:jobId/bids`
- Actions: POST `/api/jobs/:jobId/assign`

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { },
  "meta": { }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid booking details",
    "details": []
  }
}
```

### HTTP Status Codes
- 200: Success (GET, PATCH, PUT)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Code Quality

- ESLint with TypeScript rules
- Prettier for formatting
- JSDoc comments for complex functions
- Separate business logic from presentation
- Keep components small (single responsibility)
- Prefer composition over prop drilling

