
import React from 'react';
import { SiteFormData } from './types/siteFormData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SiteFormProps {
  formData: SiteFormData;
  handleChange: (field: keyof SiteFormData, value: any) => void;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  error?: string | null;
  validationErrors?: Record<string, string>;
}

export function SiteForm(props: SiteFormProps) {
  const {
    formData,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit,
    isSubmitting,
    error,
    validationErrors = {}
  } = props;

  // Helper function to show validation error
  const getFieldError = (field: string) => {
    return validationErrors[field] || '';
  };

  // Helper function to determine if a field has an error
  const hasFieldError = (field: string) => {
    return !!validationErrors[field];
  };

  // Render a simple form for now
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Site Information</h2>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Site Name
          </label>
          <input
            type="text"
            id="name"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              hasFieldError('name') ? 'border-red-500' : ''
            }`}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {hasFieldError('name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              hasFieldError('address') ? 'border-red-500' : ''
            }`}
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
          {hasFieldError('address') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('address')}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                hasFieldError('city') ? 'border-red-500' : ''
              }`}
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
            {hasFieldError('city') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('city')}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                hasFieldError('state') ? 'border-red-500' : ''
              }`}
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
            />
            {hasFieldError('state') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('state')}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                hasFieldError('postalCode') ? 'border-red-500' : ''
              }`}
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
            />
            {hasFieldError('postalCode') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('postalCode')}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
                hasFieldError('country') ? 'border-red-500' : ''
              }`}
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
            {hasFieldError('country') && (
              <p className="mt-1 text-sm text-red-600">{getFieldError('country')}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              hasFieldError('status') ? 'border-red-500' : ''
            }`}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="lost">Lost</option>
            <option value="on-hold">On Hold</option>
          </select>
          {hasFieldError('status') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('status')}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm ${
              hasFieldError('notes') ? 'border-red-500' : ''
            }`}
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
          {hasFieldError('notes') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('notes')}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Site'}
        </button>
      </div>
    </div>
  );
}
