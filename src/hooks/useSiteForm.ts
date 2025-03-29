
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteFormData } from '@/components/sites/forms/types';
import { useSiteFormSubmission } from './useSiteFormSubmission';
import { ContractDetails, BillingDetails } from '@/components/sites/forms/types';
import { toast } from 'sonner';

export function useSiteForm(mode: 'create' | 'edit', initialData?: any) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SiteFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Australia',
    status: 'active',
    customId: '',
    contacts: [],
    ...(initialData || {})
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { handleSubmit: submitForm, isSubmitting } = useSiteFormSubmission(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setFormState(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const updateForm = (updates: Partial<SiteFormData>) => {
    setFormState(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateContractDetails = (updates: Partial<ContractDetails>) => {
    setFormState(prev => ({
      ...prev,
      contractDetails: {
        ...(prev.contractDetails || {}),
        ...updates
      }
    }));
  };

  const updateBillingDetails = (updates: Partial<BillingDetails>) => {
    setFormState(prev => ({
      ...prev,
      billingDetails: {
        ...(prev.billingDetails || {}),
        ...updates
      }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateForm({ [name]: value } as any);
  };

  const handleNestedChange = (section: keyof SiteFormData, field: string, value: any) => {
    if (!section) return;
    
    setFormState(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object || {}),
        [field]: value
      }
    }));
  };

  const handleDoubleNestedChange = (
    section: keyof SiteFormData,
    subsection: string,
    field: string,
    value: any
  ) => {
    if (!section) return;
    
    setFormState(prev => {
      const sectionData = prev[section] as any || {};
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [subsection]: {
            ...(sectionData[subsection] || {}),
            [field]: value
          }
        }
      };
    });
  };

  const handleSubmit = async () => {
    try {
      // Clear previous errors
      setErrors({});
      
      // Call the submission handler
      const result = await submitForm(formState);
      
      // Navigate to the site detail page on success
      if (result && result.id) {
        toast.success(mode === 'create' ? 'Site created successfully' : 'Site updated successfully');
        navigate(`/sites/${result.id}`);
      }
    } catch (error: any) {
      setErrors({
        'general': error.message || 'Failed to save site'
      });
    }
  };

  const resetForm = () => {
    setFormState({
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Australia',
      status: 'active',
      customId: '',
      contacts: []
    });
    setErrors({});
  };

  return {
    formState,
    updateForm,
    updateContractDetails,
    updateBillingDetails,
    setFormState,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit,
    resetForm,
    errors,
    isSubmitting
  };
}
