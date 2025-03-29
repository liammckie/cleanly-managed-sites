
import { useState, useCallback } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { toast } from 'sonner';

// Create a proper interface for UseSiteFormReturn
export interface UseSiteFormReturn {
  formData: SiteFormData;
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  errors: Record<string, string>;
  resetForm: () => void;
}

export function useSiteForm(
  mode: 'create' | 'edit',
  initialData?: Partial<SiteFormData>
): UseSiteFormReturn {
  const [formData, setFormData] = useState<SiteFormData>(
    initialData 
      ? { ...getInitialFormData(), ...initialData }
      : getInitialFormData()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { createSite } = useSiteCreate();
  const { updateSite } = useSiteUpdate();
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const handleNestedChange = useCallback((section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  }, []);
  
  const handleDoubleNestedChange = useCallback((section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section]?.[subsection],
          [field]: value
        }
      }
    }));
  }, []);
  
  const updateContractDetails = useCallback((updates: Partial<ContractDetails>) => {
    setFormData(prev => ({
      ...prev,
      contractDetails: {
        ...prev.contractDetails,
        ...updates
      }
    }));
  }, []);
  
  const updateBillingDetails = useCallback((updates: Partial<BillingDetails>) => {
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        ...updates
      }
    }));
  }, []);
  
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setErrors({});
  }, []);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    
    try {
      if (mode === 'create') {
        await createSite(formData);
        toast.success('Site created successfully');
        resetForm();
      } else {
        await updateSite(formData.id, formData);
        toast.success('Site updated successfully');
      }
    } catch (error) {
      console.error('Error submitting site form:', error);
      setErrors({ general: 'Failed to save site. Please try again.' });
      toast.error('Error saving site data');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    formData,
    setFormData,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubmit,
    isSubmitting,
    errors,
    resetForm
  };
}
