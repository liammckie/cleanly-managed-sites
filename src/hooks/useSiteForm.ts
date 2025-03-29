
import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { ChangeEvent } from 'react';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { toast } from '@/components/ui/use-toast';

export interface UseSiteFormReturn {
  formData: SiteFormData;
  setFormData: (data: SiteFormData) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (field: keyof SiteFormData, value: any) => void;
  updateForm: (updates: Partial<SiteFormData>) => void;
  updateContractDetails: (updates: Partial<ContractDetails>) => void;
  updateBillingDetails: (updates: any) => void;
  updatePeriodicals: (updates: any) => void;
  resetForm: () => void;
  isSubmitting: boolean;
  errors: string[];
  handleNestedChange: (field: string, nestedField: string, value: any) => void;
  handleDoubleNestedChange: (field: string, nestedField: string, subField: string, value: any) => void;
}

// Default form data - used for new site creation
const defaultFormData: SiteFormData = {
  name: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Australia',
  status: 'active',
  phone: '',
  email: '',
  representative: '',
  contacts: [],
  billingDetails: {
    useClientInfo: false,
    contacts: [],
    billingLines: []
  }
};

export const useSiteForm = (initialData?: Partial<SiteFormData>, mode: 'create' | 'edit' = 'create'): UseSiteFormReturn => {
  const [formData, setFormData] = useState<SiteFormData>(initialData ? { ...defaultFormData, ...initialData } : defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const { createSite } = useSiteCreate();
  const { updateSite } = useSiteUpdate();

  // Handler for form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    
    try {
      if (mode === 'create') {
        await createSite(formData);
        toast({
          title: "Site created",
          description: "The site has been created successfully.",
          variant: "success"
        });
      } else {
        await updateSite({ id: formData.id as string, data: formData });
        toast({
          title: "Site updated",
          description: "The site has been updated successfully.",
          variant: "success"
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setErrors([errorMessage]);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the whole form or a section
  const updateForm = (updates: Partial<SiteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Handle basic input changes
  const handleChange = (field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle event-based input changes (for use with form controls)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update contract details specifically
  const updateContractDetails = (updates: Partial<ContractDetails>) => {
    setFormData(prev => ({
      ...prev,
      contractDetails: {
        ...prev.contractDetails,
        ...updates
      }
    }));
  };

  // Update billing details specifically
  const updateBillingDetails = (updates: any) => {
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        ...updates
      }
    }));
  };

  // Update periodicals specifically
  const updatePeriodicals = (updates: any) => {
    setFormData(prev => ({
      ...prev,
      periodicals: {
        ...prev.periodicals,
        ...updates
      }
    }));
  };

  // Reset the form to defaults or initial data
  const resetForm = () => {
    setFormData(initialData ? { ...defaultFormData, ...initialData } : defaultFormData);
    setErrors([]);
  };

  // Handle updates to nested objects in form data
  const handleNestedChange = (field: string, nestedField: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof SiteFormData],
        [nestedField]: value
      }
    }));
  };

  // Handle updates to doubly-nested objects
  const handleDoubleNestedChange = (field: string, nestedField: string, subField: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof SiteFormData],
        [nestedField]: {
          ...prev[field as keyof SiteFormData]?.[nestedField as any],
          [subField]: value
        }
      }
    }));
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    handleChange,
    updateForm,
    updateContractDetails,
    updateBillingDetails,
    updatePeriodicals,
    resetForm,
    isSubmitting,
    errors,
    handleNestedChange,
    handleDoubleNestedChange
  };
};
