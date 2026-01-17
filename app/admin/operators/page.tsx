'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, getStatusVariant } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { listOperators } from '@/lib/api/admin.api';
import { formatDate } from '@/lib/utils/date';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';

interface Operator {
  id: string;
  companyName: string;
  user: { email: string };
  approvalStatus: string;
  createdAt: string;
}

const statusOptions = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];

export default function OperatorsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [operators, setOperators] = useState<Operator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');

  const fetchOperators = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await listOperators({
        approvalStatus: statusFilter === 'ALL' ? undefined : statusFilter as 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED',
        page: currentPage,
        limit: 20,
        search: search || undefined,
      });
      // API returns { success, data: { operators: [...] }, meta }
      setOperators(response.data?.operators || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err: unknown) {
      console.error('Failed to fetch operators:', err);
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
      setOperators([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, currentPage, search]);

  useEffect(() => {
    fetchOperators();
  }, [fetchOperators]);

  const columns: Column<Operator>[] = [
    { key: 'companyName', header: 'Company Name', sortable: true },
    { key: 'user.email', header: 'Email' },
    {
      key: 'approvalStatus',
      header: 'Status',
      render: (operator) => (
        <StatusBadge variant={getStatusVariant(operator.approvalStatus)}>
          {operator.approvalStatus}
        </StatusBadge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registered',
      sortable: true,
      render: (operator) => formatDate(operator.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Operators</h1>
          <p className="text-neutral-600 mt-1">Manage transport operator accounts</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-error-200 bg-error-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-error-600" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
          <Button onClick={fetchOperators} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <Input
            placeholder="Search by company name or email..."
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
                {status === 'ALL' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={operators}
        keyExtractor={(op) => op.id}
        isLoading={isLoading}
        emptyTitle="No operators found"
        emptyDescription="Try adjusting your search or filters"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onRowClick={(operator) => router.push(`/admin/operators/${operator.id}`)}
      />
    </div>
  );
}

