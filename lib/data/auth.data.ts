/**
 * Authentication Page Data
 * Content for sign-in and sign-up pages
 */

export const AUTH_PAGE_DATA = {
  signIn: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your account to manage bookings and view your journey history',
    benefits: [
      {
        icon: 'calendar',
        title: 'Manage Bookings',
        description: 'View and modify your upcoming transfers',
      },
      {
        icon: 'clock',
        title: 'Quick Rebooking',
        description: 'Rebook previous journeys with one click',
      },
      {
        icon: 'receipt',
        title: 'Booking History',
        description: 'Access all your past and upcoming bookings',
      },
      {
        icon: 'bell',
        title: 'Real-time Updates',
        description: 'Get notifications about your transfers',
      },
    ],
  },
  forgotPassword: {
    title: 'Reset Password',
    subtitle: 'Enter your email address and we\'ll send you a link to reset your password',
  },
} as const;

