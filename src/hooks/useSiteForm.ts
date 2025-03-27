
import { useState, useCallback, useEffect } from 'react';
import { useSiteCreate } from './useSiteCreate';
import { useSiteUpdate } from './useSiteUpdate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SiteStatus } from '@/lib/types';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';
import { convertToModelSiteFormData } from '@/utils/siteFormAdapters';
import { useSite } from './useSite';

export function useSiteForm(siteId?: string) {
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { createSite } = useSiteCreate();
  const { updateSite } = useSiteUpdate();
  const { site, isLoading: isSiteLoading } = useSite(siteId);

  // Initialize form data if siteId is provided
  useEffect(() => {
    if (siteId && site) {
      // Convert site data to form data format
      const siteFormData: SiteFormData = {
        name: site.name || '',
        address: site.address || '',
        city: site.city || '',
        state: site.state || '',
        postalCode: site.postcode || '',
        country: site.country || 'Australia',
        status: site.status as SiteStatus || 'active',
        client_id: site.client_id,
        email: site.email,
        phone: site.phone,
        representative: site.representative,
        customId: site.custom_id,
        contacts: site.contacts || [],
        contract_details: site.contract_details,
        billingDetails: site.billing_details || { billingLines: [] },
        notes: site.notes,
        locationDetails: site.location_details || {
          floor: '',
          building: '',
          suite: '',
          propertyType: '',
          accessHours: '',
          keyLocation: '',
          parkingDetails: '',
          siteSize: '',
          siteSizeUnit: 'sqm',
        }
      };
      
      setFormData(siteFormData);
    }
  }, [siteId, site]);

  const handleChange = useCallback((field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNestedChange = useCallback((section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SiteFormData],
        [field]: value
      }
    }));
  }, []);

  const handleDoubleNestedChange = useCallback((section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => {
      const sectionData = prev[section as keyof SiteFormData] as any;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [subsection]: {
            ...(sectionData?.[subsection] || {}),
            [field]: value
          }
        }
      };
    });
  }, []);

  const handleLocationDetailsChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      locationDetails: {
        ...(prev.locationDetails || {}),
        [field]: value
      }
    }));
  }, []);

  const handleContactChange = useCallback((index: number, field: string, value: any) => {
    setFormData(prev => {
      const newContacts = [...(prev.contacts || [])];
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
      contacts: [...(prev.contacts || []), { name: '', email: '', phone: '', role: '' }]
    }));
  }, []);

  const removeContact = useCallback((index: number) => {
    setFormData(prev => {
      const newContacts = [...(prev.contacts || [])];
      newContacts.splice(index, 1);
      return { ...prev, contacts: newContacts };
    });
  }, []);

  const handleBillingLineChange = useCallback((index: number, field: string, value: any) => {
    setFormData(prev => {
      if (!prev.billingDetails) return prev;
      
      const newBillingLines = [...(prev.billingDetails.billingLines || [])];
      
      // Ensure each billing line has required properties
      if (!newBillingLines[index]?.id) {
        newBillingLines[index] = {
          ...newBillingLines[index],
          id: crypto.randomUUID(),
          frequency: newBillingLines[index]?.frequency || 'monthly',
          isRecurring: newBillingLines[index]?.isRecurring !== undefined 
            ? newBillingLines[index].isRecurring 
            : true,
          onHold: newBillingLines[index]?.onHold !== undefined 
            ? newBillingLines[index].onHold 
            : false
        };
      }
      
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
      const billingDetails = prev.billingDetails || { billingLines: [] };
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          billingLines: [
            ...(billingDetails.billingLines || []), 
            { 
              id: crypto.randomUUID(),
              description: '', 
              amount: 0,
              frequency: 'monthly',
              isRecurring: true,
              onHold: false
            }
          ]
        }
      };
    });
  }, []);

  const removeBillingLine = useCallback((index: number) => {
    setFormData(prev => {
      if (!prev.billingDetails) return prev;
      
      const newBillingLines = [...(prev.billingDetails.billingLines || [])];
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
        await updateSite(siteId, formData);
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
    isLoading: isSiteLoading,
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
