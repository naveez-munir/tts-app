'use client';

import { useEffect, useState, useCallback } from 'react';
import { Settings, Save, Clock, DollarSign, Calendar, Bell, RefreshCw, AlertCircle, Wallet, FileText, Car } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';
import {
  getSystemSettings,
  bulkUpdateSystemSettings,
  type SystemSettingsGrouped,
  type SystemSetting,
  type BulkUpdateSettingItem,
} from '@/lib/api/admin.api';
import { getContextualErrorMessage } from '@/lib/utils/error-handler';

// Category display configuration
const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ElementType; description: string }> = {
  PRICING: {
    label: 'Pricing Defaults',
    icon: DollarSign,
    description: 'Default pricing values used when no specific pricing rules are configured',
  },
  SERVICE_FEES: {
    label: 'Service Fees',
    icon: Car,
    description: 'Configure fees for additional services (meet & greet, child seats, airport fees)',
  },
  TIME_WINDOWS: {
    label: 'Time Windows',
    icon: Clock,
    description: 'Configure time periods for surcharges (night hours, peak hours)',
  },
  HOLIDAYS: {
    label: 'Holiday Dates',
    icon: Calendar,
    description: 'Holiday periods when surcharges apply (format: MM-DD)',
  },
  BIDDING: {
    label: 'Bidding Settings',
    icon: RefreshCw,
    description: 'Default bidding window durations for jobs',
  },
  PAYOUTS: {
    label: 'Payout Settings',
    icon: Wallet,
    description: 'Configure operator payout thresholds and schedules',
  },
  POLICIES: {
    label: 'Platform Policies',
    icon: FileText,
    description: 'Configure cancellation policies and platform rules',
  },
  NOTIFICATIONS: {
    label: 'Notification Settings',
    icon: Bell,
    description: 'Configure notification thresholds and preferences',
  },
};

// Order for displaying categories
const CATEGORY_ORDER = ['BIDDING', 'PRICING', 'SERVICE_FEES', 'TIME_WINDOWS', 'HOLIDAYS', 'PAYOUTS', 'POLICIES', 'NOTIFICATIONS'];

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettingsGrouped>({});
  const [editedValues, setEditedValues] = useState<Record<string, string | number | boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSystemSettings();
      setSettings(data);
      // Initialize edited values with current values
      const initialValues: Record<string, string | number | boolean> = {};
      Object.values(data).flat().forEach((setting: SystemSetting) => {
        initialValues[setting.key] = setting.value;
      });
      setEditedValues(initialValues);
    } catch (err: unknown) {
      console.error('Failed to fetch settings:', err);
      const errorMessage = getContextualErrorMessage(err, 'fetch');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleValueChange = (key: string, value: string | number | boolean, dataType: string) => {
    let parsedValue: string | number | boolean = value;
    
    if (dataType === 'NUMBER') {
      parsedValue = value === '' ? 0 : Number(value);
    } else if (dataType === 'BOOLEAN') {
      parsedValue = value === 'true' || value === true;
    }
    
    setEditedValues((prev) => ({ ...prev, [key]: parsedValue }));
    setSuccessMessage(null);
  };

  const hasChanges = useCallback(() => {
    const allSettings = Object.values(settings).flat();
    return allSettings.some((setting: SystemSetting) => {
      const originalValue = setting.value;
      const editedValue = editedValues[setting.key];
      return String(originalValue) !== String(editedValue);
    });
  }, [settings, editedValues]);

  const getChangedSettings = useCallback((): BulkUpdateSettingItem[] => {
    const allSettings = Object.values(settings).flat();
    const changes: BulkUpdateSettingItem[] = [];
    
    allSettings.forEach((setting: SystemSetting) => {
      const originalValue = setting.value;
      const editedValue = editedValues[setting.key];
      if (String(originalValue) !== String(editedValue)) {
        changes.push({ key: setting.key, value: editedValue });
      }
    });
    
    return changes;
  }, [settings, editedValues]);

  const handleSave = async () => {
    const changes = getChangedSettings();
    if (changes.length === 0) return;

    try {
      setIsSaving(true);
      setError(null);
      await bulkUpdateSystemSettings(changes);
      setSuccessMessage(`Successfully updated ${changes.length} setting${changes.length > 1 ? 's' : ''}`);
      // Refresh settings to get updated values
      await fetchSettings();
    } catch (err: unknown) {
      console.error('Failed to save settings:', err);
      const errorMessage = getContextualErrorMessage(err, 'update');
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    const value = editedValues[setting.key] ?? setting.value;
    const isModified = String(setting.value) !== String(value);

    if (setting.dataType === 'BOOLEAN') {
      return (
        <div className="flex items-center gap-3">
          <select
            value={String(value)}
            onChange={(e) => handleValueChange(setting.key, e.target.value === 'true', setting.dataType)}
            className={`px-3 py-2 border rounded-lg text-sm ${
              isModified ? 'border-secondary-500 bg-secondary-50' : 'border-neutral-300'
            }`}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          {isModified && <span className="text-xs text-secondary-600 font-medium">Modified</span>}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <Input
          type={setting.dataType === 'NUMBER' ? 'number' : 'text'}
          value={String(value)}
          onChange={(e) => handleValueChange(setting.key, e.target.value, setting.dataType)}
          className={`max-w-[200px] ${isModified ? 'border-secondary-500 bg-secondary-50' : ''}`}
          step={setting.dataType === 'NUMBER' ? '0.01' : undefined}
        />
        {isModified && <span className="text-xs text-secondary-600 font-medium">Modified</span>}
      </div>
    );
  };

  const formatSettingLabel = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getSettingUnit = (key: string): string => {
    if (key.includes('PERCENT')) return '%';
    if (key.includes('HOURS')) return 'hours';
    if (key.includes('FEE') || key.includes('FARE') || key.includes('PER_MILE')) return '£';
    return '';
  };

  if (isLoading) {
    return <LoadingOverlay message="Loading system settings..." />;
  }

  const sortedCategories = CATEGORY_ORDER.filter((cat) => settings[cat]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary-600" />
            System Settings
          </h1>
          <p className="text-neutral-600 mt-1">
            Configure platform-wide settings for pricing, bidding, and notifications
          </p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges() || isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center justify-between rounded-lg border border-error-200 bg-error-50 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-error-600" />
            <p className="text-sm text-error-700">{error}</p>
          </div>
          <Button onClick={fetchSettings} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      )}
      {successMessage && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Settings by Category */}
      {sortedCategories.map((category) => {
        const config = CATEGORY_CONFIG[category] || {
          label: category,
          icon: Settings,
          description: '',
        };
        const Icon = config.icon;
        const categorySettings = settings[category] || [];

        return (
          <div
            key={category}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
          >
            {/* Category Header */}
            <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">{config.label}</h2>
                  <p className="text-sm text-neutral-500">{config.description}</p>
                </div>
              </div>
            </div>

            {/* Settings List */}
            <div className="divide-y divide-neutral-100">
              {categorySettings.map((setting: SystemSetting) => (
                <div
                  key={setting.key}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">
                        {formatSettingLabel(setting.key)}
                      </span>
                      {getSettingUnit(setting.key) && (
                        <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                          {getSettingUnit(setting.key)}
                        </span>
                      )}
                    </div>
                    {setting.description && (
                      <p className="text-sm text-neutral-500 mt-0.5">{setting.description}</p>
                    )}
                  </div>
                  <div className="sm:ml-4">{renderSettingInput(setting)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {sortedCategories.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
          <Settings className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No Settings Found</h3>
          <p className="text-neutral-500">
            System settings have not been configured yet. Please run the database seed.
          </p>
        </div>
      )}
    </div>
  );
}

