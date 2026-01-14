/**
 * API Services Index
 * Central export point for all API services
 */

// Export API client and utilities
export * from './client';

// Export API services (as namespaces for organized access)
export * as authApi from './auth.api';
export * as quoteApi from './quote.api';
export * as bookingApi from './booking.api';
export * as operatorApi from './operator.api';
export * as jobApi from './job.api';
export * as bidApi from './bid.api';
export * as paymentApi from './payment.api';
export * as payoutApi from './payout.api';
export * as vehicleCapacityApi from './vehicle-capacity.api';

// Direct exports for commonly used functions
export { login, register, logout, getCurrentUser, hasRole } from './auth.api';
export {
  getAutocomplete,
  getPlaceDetails,
  calculateDistance,
  calculateSingleQuote,
  calculateReturnQuote,
} from './quote.api';
export {
  createBooking,
  createReturnBooking,
  getOrganizedBookings,
  getAllBookings,
  getBookingById,
  getBookingByReference,
  getBookingGroupById,
  getBookingGroupByReference,
  updateBooking,
  cancelBooking,
} from './booking.api';
export {
  registerOperator,
  getOperatorProfile,
  getOperatorDashboard,
  updateOperatorProfile,
  updateBankDetails,
  getJobOffers,
  acceptJobOffer,
  declineJobOffer,
} from './operator.api';
export {
  getJobById,
  getAvailableJobs,
  getOperatorAvailableJobs,
  getOperatorAssignedJobs,
  submitDriverDetails,
  markJobCompleted,
} from './job.api';
export {
  submitBid,
  getJobBids,
  getBidById,
  getOperatorBids,
  withdrawBid,
} from './bid.api';
export {
  createPaymentIntent,
  createGroupPaymentIntent,
  confirmPayment,
  confirmGroupPayment,
  getTransactionHistory,
  refundPayment,
} from './payment.api';
export {
  getVehicleCapacities,
  getAdminVehicleCapacities,
  updateVehicleCapacity,
} from './vehicle-capacity.api';
export {
  getPayoutSettings,
  getPendingPayouts,
  getProcessingPayouts,
  calculatePayouts,
  initiatePayouts,
  completePayout,
  getMyEarnings,
} from './payout.api';
