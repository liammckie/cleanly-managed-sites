
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { v4 as uuidv4 } from 'uuid';
import { SiteRecord } from '@/lib/types';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

export function useSiteForm(mode: 'create' | 'edit', initialData?: SiteRecord) {
  const navigate = useNavigate();
  const { createSiteMutation, isCreating } = useSiteCreate();
  const { updateSiteMutation, isUpdating } = useSiteUpdate();
  
  // Initialize form data with defaults and any provided initialData
  const [formData, setFormData] = useState<SiteFormData>(() => {
    const defaultData: SiteFormData = {
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Australia',
      status: 'active',
      notes: '',
      contacts: [],
      billingDetails: {
        billingLines: [],
        useClientInfo: false,
        billingMethod: '',
        paymentTerms: '',
        billingEmail: '',
        contacts: []
      }
    };
    
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
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Direct field change handler
  const handleChange = (field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Nested field change handler (e.g., for contract_details)
  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteFormData],
        [field]: value
      }
    }));
  };
  
  // Double nested field change handler (e.g., for billingDetails.billingAddress)
  const handleDoubleNestedChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteFormData],
        [subsection]: {
          ...(prev[section as keyof SiteFormData] as any)?.[subsection],
          [field]: value
        }
      }
    }));
  };
  
  // Utility functions for billingLines
  const addBillingLine = () => {
    const newBillingLine: BillingLine = {
      id: uuidv4(),
      description: '',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true,
      onHold: false
    };
    
    setFormData(prev => {
      // Ensure billingDetails exists
      const billingDetails = prev.billingDetails || { billingLines: [] };
      
      // Ensure billingLines exists
      const billingLines = billingDetails.billingLines || [];
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          billingLines: [...billingLines, newBillingLine]
        }
      };
    });
  };
  
  const updateBillingLine = (id: string, field: string, value: any) => {
    setFormData(prev => {
      // Ensure billingDetails exists
      const billingDetails = prev.billingDetails || { billingLines: [] };
      
      // Ensure billingLines exists
      const billingLines = billingDetails.billingLines || [];
      
      const updatedLines = billingLines.map(line => 
        line.id === id ? { ...line, [field]: value } : line
      );
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          billingLines: updatedLines
        }
      };
    });
  };
  
  const removeBillingLine = (id: string) => {
    setFormData(prev => {
      // Ensure billingDetails exists
      const billingDetails = prev.billingDetails || { billingLines: [] };
      
      // Ensure billingLines exists
      const billingLines = billingDetails.billingLines || [];
      
      const filteredLines = billingLines.filter(line => line.id !== id);
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          billingLines: filteredLines
        }
      };
    });
  };
  
  // Form submission handler
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    
    try {
      if (mode === 'create') {
        await createSiteMutation.mutateAsync(formData);
        toast.success('Site created successfully!');
        navigate('/sites');
      } else if (mode === 'edit' && initialData) {
        await updateSiteMutation.mutateAsync({ id: initialData.id, data: formData });
        navigate(`/sites/${initialData.id}`);
      }
    } catch (error: any) {
      console.error('Error submitting site form:', error);
      
      if (error.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An unknown error occurred' });
      }
      
      toast.error('Failed to save site');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    errors,
    isSubmitting: isSubmitting || isCreating || isUpdating,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit,
    addBillingLine,
    updateBillingLine,
    removeBillingLine
  };
}
