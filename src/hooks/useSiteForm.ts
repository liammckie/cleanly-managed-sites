
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { validateSiteForm } from '@/components/sites/forms/types/validationUtils';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { SiteContact } from '@/lib/types';
import { BillingLine } from '@/types/models';

export interface UseSiteFormReturn {
  formData: SiteFormData;
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>;
  handleChange: <K extends keyof SiteFormData>(field: K, value: SiteFormData[K]) => void;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  addContact: (contact: SiteContact) => void;
  removeContact: (contactId: string) => void;
  updateContact: (contactId: string, field: string, value: any) => void;
  addBillingLine: () => void;
  removeBillingLine: (lineId: string) => void;
  updateBillingLine: (lineId: string, field: string, value: any) => void;
  errors: string[];
  isSubmitting: boolean;
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => Promise<void>;
}

export function useSiteForm(initialData: Partial<SiteFormData> = {}, mode: 'create' | 'edit' = 'create'): UseSiteFormReturn {
  const navigate = useNavigate();
  
  // Extract siteId from initialData if it exists
  const siteId = initialData.siteId || '';
  
  // Use getInitialFormData to ensure the form data has all required properties
  const [formData, setFormData] = useState<SiteFormData>({
    ...getInitialFormData(),
    ...initialData
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const { createSite } = useSiteCreate();
  const { updateSite } = useSiteUpdate();

  const handleChange = useCallback(<K extends keyof SiteFormData>(field: K, value: SiteFormData[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  }, []);

  const addContact = useCallback((contact: SiteContact) => {
    setFormData(prev => ({
      ...prev,
      contacts: [...(prev.contacts || []), contact]
    }));
  }, []);

  const removeContact = useCallback((contactId: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: (prev.contacts || []).filter(contact => contact.id !== contactId)
    }));
  }, []);

  const updateContact = useCallback((contactId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      contacts: (prev.contacts || []).map(contact =>
        contact.id === contactId ? { ...contact, [field]: value } : contact
      )
    }));
  }, []);

  const addBillingLine = useCallback(() => {
    const newLine: BillingLine = {
      id: Date.now().toString(), // Temporary ID
      description: '',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true,
      onHold: false
    };
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: [...(prev.billingDetails?.billingLines || []), newLine]
      }
    }));
  }, []);

  const removeBillingLine = useCallback((lineId: string) => {
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: (prev.billingDetails?.billingLines || []).filter(line => line.id !== lineId)
      }
    }));
  }, []);

  const updateBillingLine = useCallback((lineId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: (prev.billingDetails?.billingLines || []).map(line =>
          line.id === lineId ? { ...line, [field]: value } : line
        )
      }
    }));
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      const validationResult = validateSiteForm(formData);
      
      if (!validationResult.isValid) {
        setErrors(validationResult.errors || []);
        setIsSubmitting(false);
        return;
      }

      if (mode === 'create') {
        const result = await createSite(formData);
        if (result?.id) {
          toast.success(`${formData.name} has been successfully created.`);
          navigate(`/sites/${result.id}`);
        }
      } else if (siteId) {
        const result = await updateSite({
          id: siteId,
          data: formData
        });
        toast.success(`${formData.name} has been successfully updated.`);
      }
    } catch (error) {
      console.error('Error saving site:', error);
      setErrors(['An error occurred while saving the site. Please try again.']);
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
    addContact,
    removeContact,
    updateContact,
    addBillingLine,
    removeBillingLine,
    updateBillingLine,
    errors,
    isSubmitting,
    handleSubmit
  };
}
