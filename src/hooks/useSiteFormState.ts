
import { useState, useEffect } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';
import { SiteRecord } from '@/lib/types';

export function useSiteFormState(mode: 'create' | 'edit', initialData?: SiteRecord) {
  // Initialize form data with defaults and any provided initialData
  const [formData, setFormData] = useState<SiteFormData>(() => {
    const defaultData = getInitialFormData();
    
    if (mode === 'edit' && initialData) {
      return {
        ...defaultData,
        name: initialData.name,
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postalCode: initialData.postcode || '',
        country: initialData.country || 'Australia',
        status: initialData.status as any,
        phone: initialData.phone || '',
        email: initialData.email || '',
        representative: initialData.representative || '',
        customId: initialData.custom_id || '',
        client_id: initialData.client_id,
        contract_details: initialData.contract_details || {},
        billingDetails: initialData.billing_details || defaultData.billingDetails,
        notes: initialData.notes || '',
      };
    }
    
    return defaultData;
  });

  // Direct field change handler
  const handleChange = (field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Nested field change handler (e.g., for contract_details)
  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof SiteFormData] || {}),
        [field]: value
      }
    }));
  };
  
  // Double nested field change handler (e.g., for billingDetails.billingAddress)
  const handleDoubleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof SiteFormData] || {}),
        [subsection]: {
          ...((prev[section as keyof SiteFormData] as any)?.[subsection] || {}),
          [field]: value
        }
      }
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange
  };
}
