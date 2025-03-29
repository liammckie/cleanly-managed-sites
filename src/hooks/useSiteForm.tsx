
import { useState, useCallback } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { Periodicals } from '@/components/sites/forms/types/periodicalTypes';
import { SecurityDetails } from '@/components/sites/forms/types/securityTypes';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';

export interface UseSiteFormReturn {
  formState: SiteFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleChange: (field: keyof SiteFormData, value: any) => void;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  updateForm: (updates: Partial<SiteFormData>) => void;
  updateContractDetails: (updates: Partial<ContractDetails>) => void;
  updatePeriodicals: (updates: Partial<Periodicals>) => void;
  updateSecurityDetails: (updates: Partial<SecurityDetails>) => void;
  handleSubmit: () => void;
  resetForm: () => void;
}

export function useSiteForm(mode: 'create' | 'edit', initialData?: any): UseSiteFormReturn {
  const [formState, setFormState] = useState<SiteFormData>(() => {
    if (initialData) {
      return {
        ...getInitialFormData(),
        ...initialData,
        periodicals: {
          ...(initialData.periodicals || {}),
          items: initialData.periodicals?.items || [],
          notes: initialData.periodicals?.notes || '',
        },
        securityDetails: {
          ...(initialData.securityDetails || {}),
          accessNotes: initialData.securityDetails?.accessNotes || '',
        },
      };
    }
    return getInitialFormData();
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = useCallback((field: keyof SiteFormData, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  const handleNestedChange = useCallback((section: string, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteFormData],
        [field]: value
      }
    }));
  }, []);
  
  const handleDoubleNestedChange = useCallback((section: string, subsection: string, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteFormData],
        [subsection]: {
          ...prev[section as keyof SiteFormData]?.[subsection],
          [field]: value
        }
      }
    }));
  }, []);
  
  const updateForm = useCallback((updates: Partial<SiteFormData>) => {
    setFormState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);
  
  const updateContractDetails = useCallback((updates: Partial<ContractDetails>) => {
    setFormState(prev => ({
      ...prev,
      contractDetails: {
        ...prev.contractDetails,
        ...updates
      },
      contract_details: {
        ...prev.contract_details,
        ...updates
      }
    }));
  }, []);
  
  const updatePeriodicals = useCallback((updates: Partial<Periodicals>) => {
    setFormState(prev => ({
      ...prev,
      periodicals: {
        ...prev.periodicals,
        ...updates
      }
    }));
  }, []);
  
  const updateSecurityDetails = useCallback((updates: Partial<SecurityDetails>) => {
    setFormState(prev => ({
      ...prev,
      securityDetails: {
        ...prev.securityDetails,
        ...updates
      }
    }));
  }, []);
  
  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    // Your submission logic here
    console.log('Submitting form:', formState);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  }, [formState]);
  
  const resetForm = useCallback(() => {
    setFormState(getInitialFormData());
    setErrors({});
  }, []);
  
  return {
    formState,
    errors,
    isSubmitting,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    updateForm,
    updateContractDetails,
    updatePeriodicals,
    updateSecurityDetails,
    handleSubmit,
    resetForm
  };
}
