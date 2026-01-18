'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, DollarSign, AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { listPricingRules, createPricingRule, updatePricingRule, deletePricingRule } from '@/lib/api/admin.api';
import { formatCurrency } from '@/lib/utils/date';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';

interface PricingRule {
  id: string;
  ruleType: string;
  vehicleType: string | null;
  value: number;
  description: string | null;
  isActive: boolean;
}

const ruleTypes = ['BASE_FARE', 'PER_MILE', 'TIME_SURCHARGE', 'HOLIDAY_SURCHARGE', 'AIRPORT_FEE'];
const vehicleTypes = [
  'SALOON',
  'ESTATE',
  'GREEN_CAR',
  'MPV',
  'EXECUTIVE',
  'EXECUTIVE_LUXURY',
  'EXECUTIVE_PEOPLE_CARRIER',
  'MINIBUS',
];

export default function PricingRulesPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [deleteRule, setDeleteRule] = useState<PricingRule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ ruleType: 'BASE_FARE', vehicleType: '', value: '', description: '', isActive: true });

  const fetchRules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await listPricingRules();
      // API returns { success, data: { pricingRules: [...] } }
      const rulesData = response.data?.pricingRules || response.data?.pricing_rules || response.data || [];
      // Transform backend response to frontend format (baseValue -> value)
      const transformedRules: PricingRule[] = Array.isArray(rulesData) ? rulesData.map((rule: Record<string, unknown>) => ({
        id: rule.id as string,
        ruleType: rule.ruleType as string,
        vehicleType: (rule.vehicleType as string) || null,
        value: (rule.baseValue ?? rule.value) as number,
        description: (rule.description as string) || null,
        isActive: rule.isActive as boolean,
      })) : [];
      setRules(transformedRules);
    } catch (err: unknown) {
      console.error('Failed to fetch rules:', err);
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
      setRules([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setActionError(null);
      const data = {
        ruleType: formData.ruleType,
        vehicleType: formData.vehicleType || undefined,
        value: parseFloat(formData.value),
        description: formData.description || undefined,
        isActive: formData.isActive,
      };

      if (editingRule) {
        await updatePricingRule(editingRule.id, data);
      } else {
        await createPricingRule(data);
      }
      await fetchRules();
      resetForm();
    } catch (err: unknown) {
      console.error('Failed to save rule:', err);
      const errorMessage = getContextualErrorMessage(err, editingRule ? 'update' : 'submit');
      setActionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteRule) return;
    try {
      setIsSubmitting(true);
      setActionError(null);
      await deletePricingRule(deleteRule.id);
      await fetchRules();
      setDeleteRule(null);
    } catch (err: unknown) {
      console.error('Failed to delete rule:', err);
      const errorMessage = getContextualErrorMessage(err, 'delete');
      setActionError(errorMessage);
      setDeleteRule(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ ruleType: 'BASE_FARE', vehicleType: '', value: '', description: '', isActive: true });
    setEditingRule(null);
    setShowForm(false);
  };

  const startEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setFormData({ ruleType: rule.ruleType, vehicleType: rule.vehicleType || '', value: String(rule.value), description: rule.description || '', isActive: rule.isActive });
    setShowForm(true);
  };

  if (isLoading) return <LoadingOverlay message="Loading pricing rules..." />;

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-error-100 p-4">
          <AlertCircle className="h-8 w-8 text-error-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Unable to Load Pricing Rules</h2>
          <p className="mt-1 text-neutral-600">{error}</p>
        </div>
        <Button onClick={fetchRules} variant="primary">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Pricing Rules</h1>
          <p className="text-neutral-600 mt-1">Configure base fares, per-mile rates, and surcharges</p>
        </div>
        <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4 mr-2" /> Add Rule</Button>
      </div>

      {/* Action Error Display */}
      {actionError && (
        <div className="flex items-center justify-between rounded-lg border border-error-200 bg-error-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-error-600" />
            <p className="text-sm text-error-700">{actionError}</p>
          </div>
          <Button onClick={() => setActionError(null)} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-lg font-semibold mb-4">{editingRule ? 'Edit Rule' : 'Add New Rule'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Rule Type</label>
              <select value={formData.ruleType} onChange={(e) => setFormData({ ...formData, ruleType: e.target.value })} className="w-full px-3 py-2 border border-neutral-300 rounded-lg">
                {ruleTypes.map((type) => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Vehicle Type (optional)</label>
              <select value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })} className="w-full px-3 py-2 border border-neutral-300 rounded-lg">
                <option value="">All Vehicles</option>
                {vehicleTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <Input label="Value (£ or %)" type="number" step="0.01" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} required />
            <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
                <span className="text-sm">Active</span>
              </label>
              <div className="flex-1" />
              <Button variant="outline" type="button" onClick={resetForm}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : editingRule ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </div>
      )}

      {/* Rules Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b"><tr><th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Rule Type</th><th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Vehicle</th><th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Value</th><th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Description</th><th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Status</th><th className="text-right px-4 py-3 text-xs font-semibold text-neutral-600 uppercase">Actions</th></tr></thead>
            <tbody className="divide-y">
              {(Array.isArray(rules) ? rules : []).map((rule) => (
                <tr key={rule.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium">{rule.ruleType.replace('_', ' ')}</td>
                  <td className="px-4 py-3">{rule.vehicleType || 'All'}</td>
                  <td className="px-4 py-3">{rule.ruleType.includes('SURCHARGE') ? `${rule.value}%` : formatCurrency(rule.value)}</td>
                  <td className="px-4 py-3 text-neutral-600 max-w-xs truncate">{rule.description || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge variant={rule.isActive ? 'success' : 'default'}>{rule.isActive ? 'Active' : 'Inactive'}</StatusBadge></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => startEdit(rule)} className="p-2 hover:bg-neutral-100 rounded-lg"><Edit2 className="w-4 h-4" /></button><button onClick={() => setDeleteRule(rule)} className="p-2 hover:bg-neutral-100 rounded-lg text-error-600"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog isOpen={!!deleteRule} onClose={() => setDeleteRule(null)} onConfirm={handleDelete} title="Delete Pricing Rule" message={`Are you sure you want to delete this ${deleteRule?.ruleType.replace('_', ' ')} rule?`} confirmText="Delete" variant="danger" isLoading={isSubmitting} />
    </div>
  );
}

