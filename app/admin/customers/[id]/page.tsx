'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, CheckCircle, XCircle, Calendar, CreditCard, Package, Ban, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { getCustomerDetails, updateCustomerStatus, getCustomerBookings, getCustomerTransactions, type CustomerDetails } from '@/lib/api/admin.api';
import { formatDate, formatCurrency } from '@/lib/utils/date';

interface Booking {
  id: string;
  bookingReference: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDatetime: string;
  customerPrice: number;
  vehicleType: string;
  journeyType: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  transactionType: string;
  amount: number;
  status: string;
  stripeTransactionId: string | null;
  createdAt: string;
}

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customerData, setCustomerData] = useState<CustomerDetails | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsTotalPages, setBookingsTotalPages] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsTotalPages, setTransactionsTotalPages] = useState(1);

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        setIsLoading(true);
        const data = await getCustomerDetails(customerId);
        setCustomerData(data);
      } catch (error) {
        console.error('Failed to fetch customer details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomerData();
  }, [customerId]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await getCustomerBookings(customerId, { page: bookingsPage, limit: 10 });
        setBookings(response.data?.bookings || []);
        setBookingsTotalPages(response.meta?.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    }
    if (customerId) fetchBookings();
  }, [customerId, bookingsPage]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await getCustomerTransactions(customerId, { page: transactionsPage, limit: 10 });
        setTransactions(response.data?.transactions || []);
        setTransactionsTotalPages(response.meta?.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    }
    if (customerId) fetchTransactions();
  }, [customerId, transactionsPage]);

  const handleStatusChange = async (isActive: boolean) => {
    try {
      setIsUpdating(true);
      await updateCustomerStatus(customerId, { isActive });
      setCustomerData((prev) => prev ? { ...prev, customer: { ...prev.customer, isActive } } : null);
      setShowDeactivateDialog(false);
      setShowActivateDialog(false);
    } catch (error) {
      console.error('Failed to update customer status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <LoadingOverlay message="Loading customer details..." />;
  if (!customerData) return <div className="text-center py-12 text-error-600">Customer not found</div>;

  const { customer, statistics } = customerData;

  const bookingColumns: Column<Booking>[] = [
    { key: 'bookingReference', header: 'Reference', className: 'font-mono' },
    {
      key: 'status',
      header: 'Status',
      render: (booking) => <StatusBadge variant={getStatusVariant(booking.status)}>{booking.status}</StatusBadge>,
    },
    {
      key: 'pickupAddress',
      header: 'Route',
      render: (booking) => (
        <div className="max-w-xs">
          <p className="truncate text-sm">{booking.pickupAddress}</p>
          <p className="text-xs text-neutral-500 truncate">→ {booking.dropoffAddress}</p>
        </div>
      ),
    },
    { key: 'pickupDatetime', header: 'Pickup Date', render: (booking) => formatDate(booking.pickupDatetime) },
    { key: 'customerPrice', header: 'Price', render: (booking) => formatCurrency(booking.customerPrice) },
    { key: 'vehicleType', header: 'Vehicle' },
  ];

  const transactionColumns: Column<Transaction>[] = [
    { key: 'transactionType', header: 'Type', render: (txn) => txn.transactionType.replace(/_/g, ' ') },
    { key: 'amount', header: 'Amount', render: (txn) => formatCurrency(txn.amount) },
    {
      key: 'status',
      header: 'Status',
      render: (txn) => <StatusBadge variant={getStatusVariant(txn.status)}>{txn.status}</StatusBadge>,
    },
    { key: 'stripeTransactionId', header: 'Stripe ID', className: 'font-mono text-xs', render: (txn) => txn.stripeTransactionId || '-' },
    { key: 'createdAt', header: 'Date', render: (txn) => formatDate(txn.createdAt) },
  ];

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-neutral-900">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-neutral-600">Registered {formatDate(customer.createdAt)}</p>
        </div>
        <StatusBadge variant={customer.isActive ? 'success' : 'error'} className="text-sm px-3 py-1">
          {customer.isActive ? (
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Active
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Inactive
            </span>
          )}
        </StatusBadge>
      </div>

      {/* Status Action Bar */}
      {customer.isActive ? (
        <div className="bg-success-50 border border-success-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-success-800 font-medium">This customer account is active</p>
          <Button variant="outline" onClick={() => setShowDeactivateDialog(true)}>
            <Ban className="w-4 h-4 mr-2" /> Deactivate Account
          </Button>
        </div>
      ) : (
        <div className="bg-error-50 border border-error-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-error-800 font-medium">This customer account is deactivated</p>
          <Button variant="secondary" onClick={() => setShowActivateDialog(true)}>
            <RefreshCw className="w-4 h-4 mr-2" /> Activate Account
          </Button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-center">
          <p className="text-2xl font-bold text-neutral-900">{statistics.totalBookings}</p>
          <p className="text-sm text-neutral-600">Total Bookings</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-center">
          <p className="text-2xl font-bold text-success-600">{statistics.completedBookings}</p>
          <p className="text-sm text-neutral-600">Completed</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-center">
          <p className="text-2xl font-bold text-primary-600">{statistics.activeBookings}</p>
          <p className="text-sm text-neutral-600">Active</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-center">
          <p className="text-2xl font-bold text-error-600">{statistics.cancelledBookings}</p>
          <p className="text-sm text-neutral-600">Cancelled</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-center">
          <p className="text-2xl font-bold text-neutral-900">{formatCurrency(statistics.totalSpent)}</p>
          <p className="text-sm text-neutral-600">Total Spent</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" /> Contact Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-neutral-500">Email</dt>
              <dd className="font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {customer.email}
                {customer.isEmailVerified ? (
                  <span className="text-success-600 text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-warning-600 text-xs">Not verified</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-neutral-500">Phone</dt>
              <dd className="font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {customer.phoneNumber || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-neutral-500">Customer ID</dt>
              <dd className="font-mono text-sm">{customer.id}</dd>
            </div>
          </dl>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" /> Account Information
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-neutral-500">Registered</dt>
              <dd className="font-medium">{formatDate(customer.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-neutral-500">Last Updated</dt>
              <dd className="font-medium">{formatDate(customer.updatedAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-neutral-500">Account Status</dt>
              <dd className="font-medium">
                {customer.isActive ? (
                  <span className="text-success-600">Active</span>
                ) : (
                  <span className="text-error-600">Inactive</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Booking History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-600" /> Booking History
        </h2>
        <DataTable
          columns={bookingColumns}
          data={bookings}
          keyExtractor={(booking) => booking.id}
          emptyTitle="No bookings found"
          emptyDescription="This customer hasn't made any bookings yet"
          currentPage={bookingsPage}
          totalPages={bookingsTotalPages}
          onPageChange={setBookingsPage}
          onRowClick={(booking) => router.push(`/admin/bookings/${booking.id}`)}
        />
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary-600" /> Transaction History
        </h2>
        <DataTable
          columns={transactionColumns}
          data={transactions}
          keyExtractor={(txn) => txn.id}
          emptyTitle="No transactions found"
          emptyDescription="This customer hasn't made any transactions yet"
          currentPage={transactionsPage}
          totalPages={transactionsTotalPages}
          onPageChange={setTransactionsPage}
        />
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        onConfirm={() => handleStatusChange(false)}
        title="Deactivate Customer Account"
        message={`Are you sure you want to deactivate ${customer.firstName} ${customer.lastName}'s account? They will not be able to log in or make bookings.`}
        confirmText="Deactivate"
        variant="danger"
        isLoading={isUpdating}
      />
      <ConfirmDialog
        isOpen={showActivateDialog}
        onClose={() => setShowActivateDialog(false)}
        onConfirm={() => handleStatusChange(true)}
        title="Activate Customer Account"
        message={`Are you sure you want to activate ${customer.firstName} ${customer.lastName}'s account? They will be able to log in and make bookings.`}
        confirmText="Activate"
        variant="info"
        isLoading={isUpdating}
      />
    </div>
  );
}

