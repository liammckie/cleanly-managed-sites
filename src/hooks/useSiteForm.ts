import { useState, useCallback } from 'react';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteStatus } from '@/lib/types';
import { SiteFormData, getInitialFormData } from '@/components/sites/forms/types/siteFormData';
import { adaptSiteFormData } from '@/utils/siteFormAdapters';

export function useSiteForm(siteId?: string) {
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { createSite } = useSiteCreate();
  const { updateSite } = useSiteUpdate();

  // Initialize form data if siteId is provided
  // useEffect(() => {
  //   if (siteId) {
  //     // Fetch site data and set form data
  //     // Example:
  //     // const siteData = await fetchSiteData(siteId);
  //     // setFormData(siteData);
  //   }
  // }, [siteId]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
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
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  }, []);

  const handleLocationDetailsChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      locationDetails: {
        ...prev.locationDetails,
        [field]: value
      }
    }));
  }, []);

  const handleContactChange = useCallback((index: number, field: string, value: any) => {
    setFormData(prev => {
      const newContacts = [...prev.contacts];
      newContacts[index] = {
        ...newContacts[index],
        [field]: value
      };
      return { ...prev, contacts: newContacts };
    });
  }, []);

  const addContact = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', email: '', phone: '', role: '' }]
    }));
  }, []);

  const removeContact = useCallback((index: number) => {
    setFormData(prev => {
      const newContacts = [...prev.contacts];
      newContacts.splice(index, 1);
      return { ...prev, contacts: newContacts };
    });
  }, []);

  const handleBillingLineChange = useCallback((index: number, field: string, value: any) => {
    setFormData(prev => {
      if (!prev.billingDetails) return prev;
      const newBillingLines = [...prev.billingDetails.billingLines];
      newBillingLines[index] = {
        ...newBillingLines[index],
        [field]: value
      };
      return {
        ...prev,
        billingDetails: {
          ...prev.billingDetails,
          billingLines: newBillingLines
        }
      };
    });
  }, []);

  const addBillingLine = useCallback(() => {
    setFormData(prev => {
      if (!prev.billingDetails) return prev;
      return {
        ...prev,
        billingDetails: {
          ...prev.billingDetails,
          billingLines: [...prev.billingDetails.billingLines, { description: '', amount: 0 }]
        }
      };
    });
  }, []);

  const removeBillingLine = useCallback((index: number) => {
    setFormData(prev => {
      if (!prev.billingDetails) return prev;
      const newBillingLines = [...prev.billingDetails.billingLines];
      newBillingLines.splice(index, 1);
      return {
        ...prev,
        billingDetails: {
          ...prev.billingDetails,
          billingLines: newBillingLines
        }
      };
    });
  }, []);

  const handleStatusChange = useCallback((status: SiteStatus) => {
    setFormData(prev => ({
      ...prev,
      status: status
    }));
  }, []);

  // When sending data to the API, ensure we adapt the form data correctly
const handleSubmit = async (mode: 'create' | 'update') => {
  try {
    setIsSubmitting(true);
    setError(null);

    if (mode === 'create') {
      const result = await createSite(formData);
      toast.success('Site created successfully');
      navigate(`/sites/${result.id}`);
    } else if (mode === 'update' && siteId) {
      await updateSite(siteId, adaptSiteFormData(formData));
      toast.success('Site updated successfully');
      navigate(`/sites/${siteId}`);
    }
  } catch (error) {
    console.error('Error submitting site:', error);
    setError(error instanceof Error ? error.message : 'Unknown error occurred');
    toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return {
    formData,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleLocationDetailsChange,
    handleContactChange,
    addContact,
    removeContact,
    handleBillingLineChange,
    addBillingLine,
    removeBillingLine,
    handleStatusChange,
    handleSubmit,
    isSubmitting,
    error
  };
}
