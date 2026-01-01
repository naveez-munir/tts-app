# API Usage Guide

Quick reference for using the API services in the frontend.

---

## 📦 Import API Services

```typescript
import { authApi, quoteApi, bookingApi, operatorApi } from '@/lib/api';
import { VehicleType, ServiceType, UserRole } from '@/lib/types';
```

---

## 🔐 Authentication

### Register a New User

```typescript
import { authApi } from '@/lib/api';
import { UserRole } from '@/lib/types';

const handleRegister = async () => {
  try {
    const user = await authApi.register({
      email: 'customer@example.com',
      password: 'SecurePass123',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CUSTOMER, // or OPERATOR, ADMIN
    });
    console.log('User registered:', user);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### Login

```typescript
import { authApi } from '@/lib/api';

const handleLogin = async () => {
  try {
    const { user, accessToken } = await authApi.login({
      email: 'customer@example.com',
      password: 'SecurePass123',
    });
    console.log('Logged in:', user);
    // Token is automatically stored in localStorage
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Logout

```typescript
import { authApi } from '@/lib/api';

const handleLogout = () => {
  authApi.logout(); // Clears token and redirects to home
};
```

### Get Current User

```typescript
import { authApi } from '@/lib/api';

const user = authApi.getCurrentUser();
if (user) {
  console.log('Current user:', user);
}
```

---

## 🗺️ Google Maps & Quotes

### Address Autocomplete

```typescript
import { quoteApi } from '@/lib/api';

const handleSearch = async (input: string) => {
  try {
    const predictions = await quoteApi.getAutocomplete(input);
    console.log('Suggestions:', predictions);
    // predictions: [{ placeId, description, mainText, secondaryText }, ...]
  } catch (error) {
    console.error('Autocomplete failed:', error);
  }
};
```

### Get Place Details

```typescript
import { quoteApi } from '@/lib/api';

const handlePlaceSelect = async (placeId: string) => {
  try {
    const details = await quoteApi.getPlaceDetails(placeId);
    console.log('Place details:', details);
    // details: { address, postcode, lat, lng, placeId }
  } catch (error) {
    console.error('Failed to get place details:', error);
  }
};
```

### Calculate Single Journey Quote

```typescript
import { quoteApi } from '@/lib/api';
import { VehicleType } from '@/lib/types';

const handleGetQuote = async () => {
  try {
    const quote = await quoteApi.calculateSingleQuote({
      pickupLat: 51.5074,
      pickupLng: -0.1278,
      dropoffLat: 51.4700,
      dropoffLng: -0.4543,
      vehicleType: VehicleType.SALOON,
      pickupDatetime: new Date().toISOString(),
      meetAndGreet: false,
    });
    console.log('Quote:', quote);
    // quote: { baseFare, distanceCharge, totalPrice, breakdown, ... }
  } catch (error) {
    console.error('Quote calculation failed:', error);
  }
};
```

### Calculate Return Journey Quote

```typescript
import { quoteApi } from '@/lib/api';
import { VehicleType } from '@/lib/types';

const handleGetReturnQuote = async () => {
  try {
    const quote = await quoteApi.calculateReturnQuote({
      outbound: {
        pickupLat: 51.5074,
        pickupLng: -0.1278,
        dropoffLat: 51.4700,
        dropoffLng: -0.4543,
        vehicleType: VehicleType.SALOON,
        pickupDatetime: '2025-01-15T10:00:00Z',
        meetAndGreet: true,
      },
      returnJourney: {
        pickupLat: 51.4700,
        pickupLng: -0.4543,
        dropoffLat: 51.5074,
        dropoffLng: -0.1278,
        vehicleType: VehicleType.SALOON,
        pickupDatetime: '2025-01-20T14:00:00Z',
        meetAndGreet: false,
      },
    });
    console.log('Return quote:', quote);
    // quote: { outbound, returnJourney, subtotal, discountAmount, totalPrice }
  } catch (error) {
    console.error('Return quote calculation failed:', error);
  }
};
```

---

## 📅 Bookings

### Create One-Way Booking

```typescript
import { bookingApi } from '@/lib/api';
import { VehicleType, ServiceType } from '@/lib/types';

const handleCreateBooking = async () => {
  try {
    const booking = await bookingApi.createBooking({
      pickupAddress: '123 Main St, London',
      pickupPostcode: 'SW1A 1AA',
      pickupLat: 51.5074,
      pickupLng: -0.1278,
      dropoffAddress: 'Heathrow Airport, Terminal 5',
      dropoffPostcode: 'TW6 2GA',
      dropoffLat: 51.4700,
      dropoffLng: -0.4543,
      pickupDatetime: '2025-01-15T10:00:00Z',
      passengerCount: 2,
      luggageCount: 3,
      vehicleType: VehicleType.SALOON,
      serviceType: ServiceType.AIRPORT_DROPOFF,
      flightNumber: 'BA123',
      specialRequirements: 'Child seat required',
      customerPrice: 45.50,
      isReturnJourney: false,
    });
    console.log('Booking created:', booking);
  } catch (error) {
    console.error('Booking creation failed:', error);
  }
};
```

### Get All Bookings (Organized)

```typescript
import { bookingApi } from '@/lib/api';

const handleGetBookings = async () => {
  try {
    const { data, meta } = await bookingApi.getOrganizedBookings();
    console.log('One-way bookings:', data.oneWayBookings);
    console.log('Return journeys:', data.returnJourneys);
    console.log('Total:', meta.totalBookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
  }
};
```

---

## 🚗 Operator Operations

### Register as Operator

```typescript
import { operatorApi } from '@/lib/api';
import { VehicleType } from '@/lib/types';

const handleRegisterOperator = async () => {
  try {
    const profile = await operatorApi.registerOperator({
      companyName: 'ABC Transport Ltd',
      registrationNumber: '12345678',
      vatNumber: 'GB123456789',
      serviceAreas: ['SW1A', 'W1', 'EC1'],
      vehicleTypes: [VehicleType.SALOON, VehicleType.ESTATE],
    });
    console.log('Operator registered:', profile);
  } catch (error) {
    console.error('Operator registration failed:', error);
  }
};
```

### Get Operator Dashboard

```typescript
import { operatorApi } from '@/lib/api';

const handleGetDashboard = async () => {
  try {
    const dashboard = await operatorApi.getOperatorDashboard();
    console.log('Dashboard:', dashboard);
    // dashboard: { profile, availableJobs, activeBids, totalEarnings, ... }
  } catch (error) {
    console.error('Failed to fetch dashboard:', error);
  }
};
```

---

## 🛡️ Error Handling

All API calls automatically handle errors. The API client will:

- **401 Unauthorized**: Clear token and redirect to `/sign-in`
- **403 Forbidden**: Log error (user doesn't have permission)
- **404 Not Found**: Log error
- **400/422 Validation**: Return validation errors
- **500 Server Error**: Log error
- **Network Error**: Return user-friendly message

```typescript
try {
  const result = await authApi.login({ email, password });
} catch (error: any) {
  if (error.error?.code === 'VALIDATION_ERROR') {
    console.log('Validation errors:', error.error.details);
  } else {
    console.log('Error:', error.error?.message);
  }
}
```

---

## 🔧 Utilities

### Check if Authenticated

```typescript
import { isAuthenticated } from '@/lib/api';

if (isAuthenticated()) {
  console.log('User is logged in');
}
```

### Manual Token Management

```typescript
import { setAuthToken, getAuthToken, clearAuth } from '@/lib/api';

// Set token
setAuthToken('your-jwt-token');

// Get token
const token = getAuthToken();

// Clear auth
clearAuth();
```

---

**Next**: Create Zustand stores for state management!

