import { useState, useCallback } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteStatus } from '@/types/common';

export function useSiteFormHandlers(initialFormData: SiteFormData) {
  const [formData, setFormData] = useState<SiteFormData>(initialFormData);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleClientChange = useCallback((clientId: string, clientName?: string) => {
    setFormData(prev => ({
      ...prev,
      client_id: clientId,
      clientId: clientId, // For compatibility
      client_name: clientName,
      clientName: clientName // For compatibility
    }));
  }, []);

  const handleStatusChange = useCallback((status: SiteStatus) => {
    // Normalize status values to ensure compatibility
    let normalizedStatus: SiteStatus;
    if (status === 'on_hold') {
      normalizedStatus = 'on-hold';
    } else {
      normalizedStatus = status as SiteStatus;
    }
    
    setFormData(prev => ({
      ...prev,
      status: normalizedStatus
    }));
  }, []);

  // Handle nested object changes with type safety
  const handleNestedChange = (section: keyof SiteFormData, field: string, value: any) => {
    setFormData(prev => {
      // Ensure we have an object to spread
      const sectionData = prev[section] as Record<string, any> || {};
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value
        }
      };
    });
  };
  
  // Handle doubly nested object changes with type safety
  const handleDoubleNestedChange = (section: keyof SiteFormData, subsection: string, field: string, value: any) => {
    setFormData(prev => {
      // Ensure we have objects to spread at both levels
      const sectionData = prev[section] as Record<string, any> || {};
      const subsectionData = sectionData[subsection] as Record<string, any> || {};
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [subsection]: {
            ...subsectionData,
            [field]: value
          }
        }
      };
    });
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleClientChange,
    handleStatusChange,
    handleNestedChange,
    handleDoubleNestedChange
  };
}
