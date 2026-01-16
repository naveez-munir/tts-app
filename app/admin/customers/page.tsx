'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/Input';
import { listCustomers, type Customer } from '@/lib/api/admin.api';
import { formatDate, formatCurrency } from '@/lib/utils/date';

const statusOptions = ['ALL', 'ACTIVE', 'INACTIVE'];

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await listCustomers({
        isActive: statusFilter === 'ALL' ? undefined : (statusFilter === 'ACTIVE' ? 'true' : 'false'),
        page: currentPage,
        limit: 20,
        search: search || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      // API returns { success, data: { customers: [...] }, meta }
      setCustomers(response.data?.customers || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, currentPage, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const columns: Column<Customer>[] = [
    {
      key: 'firstName',
      header: 'Customer',
      render: (customer) => (
        <div>
          <div className="text-sm font-medium text-neutral-900">
            {customer.firstName} {customer.lastName}
          </div>
          <div className="text-sm text-neutral-500">{customer.email}</div>
        </div>
      ),
    },
    {
      key: 'phoneNumber',
      header: 'Contact',
      render: (customer) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-sm text-neutral-600">
            <Mail className="w-4 h-4 mr-2 text-neutral-400" />
            {customer.isEmailVerified ? (
              <span className="text-success-600 flex items-center">
                Verified <CheckCircle className="w-3 h-3 ml-1" />
              </span>
            ) : (
              <span className="text-warning-600">Not verified</span>
            )}
          </div>
          {customer.phoneNumber && (
            <div className="flex items-center text-sm text-neutral-600">
              <Phone className="w-4 h-4 mr-2 text-neutral-400" />
              {customer.phoneNumber}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (customer) => (
        <StatusBadge variant={customer.isActive ? 'success' : 'error'}>
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
      ),
    },
    {
      key: 'totalBookings',
      header: 'Bookings',
      render: (customer) => (
        <span className="text-sm text-neutral-900">{customer.totalBookings}</span>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      render: (customer) => (
        <span className="text-sm font-medium text-neutral-900">
          {formatCurrency(customer.totalSpent)}
        </span>
      ),
    },
    {
      key: 'registeredAt',
      header: 'Registered',
      sortable: true,
      render: (customer) => formatDate(customer.registeredAt),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Customers</h1>
          <p className="text-neutral-600 mt-1">Manage customer accounts and view booking history</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-neutral-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Status' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={customers}
        keyExtractor={(customer) => customer.id}
        isLoading={isLoading}
        emptyTitle="No customers found"
        emptyDescription="Try adjusting your search or filters"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onRowClick={(customer) => router.push(`/admin/customers/${customer.id}`)}
      />
    </div>
  );
}
