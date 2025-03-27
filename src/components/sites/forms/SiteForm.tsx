
import React from 'react';
import { SiteFormData } from './types/siteFormData';

interface SiteFormProps {
  formData: SiteFormData;
  handleChange: (field: keyof SiteFormData, value: any) => void;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

export function SiteForm(props: SiteFormProps) {
  const {
    formData,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit,
    isSubmitting,
    error
  } = props;

  // Render a simple form for now
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Site Information</h2>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Site Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <input
              type="text"
              id="state"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
            />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={formData.postalCode}
              onChange={(e) => handleChange('postalCode', e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="lost">Lost</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
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
