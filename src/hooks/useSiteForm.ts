
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export function useSiteForm() {
  // Initialize form with react-hook-form
  const form = useForm<SiteFormData>();
  
  // Initialize form data state
  const [formData, setFormData] = useState<SiteFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'AU',
    status: 'active',
    hasSubcontractors: false,
    contract_details: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      autoRenewal: false,
      contractNumber: ''
    } as ContractDetails,
    contacts: [],
    billingDetails: {
      billingLines: [],
      contacts: [],
      billingCycle: 'monthly',
      notes: ''
    } as BillingDetails
  });
  
  // Generic handler for updating form fields
  const handleChange = useCallback((field: keyof SiteFormData, value: any) => {
    setFormData(prev => {
      // Create a new object to avoid mutation
      const newData = {...prev};
      newData[field] = value;
      return newData;
    });
  }, []);
  
  // Handler for updating nested fields
  const handleNestedChange = useCallback((section: keyof SiteFormData, field: string, value: any) => {
    setFormData(prev => {
      // Create a new object to avoid mutation
      const newData = {...prev};
      
      // Initialize section if it doesn't exist
      if (!newData[section]) {
        newData[section] = {};
      }
      
      // Create a type-safe copy of the section
      const sectionCopy = {...(newData[section] as Record<string, any>)};
      sectionCopy[field] = value;
      
      // Update the section
      newData[section] = sectionCopy;
      
      return newData;
    });
  }, []);
  
  // Handle double-nested changes (useful for complex objects)
  const handleDoubleNestedChange = useCallback(
    (section: keyof SiteFormData, subSection: string, field: string, value: any) => {
      setFormData(prev => {
        // Create a new object to avoid mutation
        const newData = {...prev};
        
        // Initialize section if it doesn't exist
        if (!newData[section]) {
          newData[section] = {};
        }
        
        // Initialize section as a generic object for type safety
        const sectionCopy = {...(newData[section] as Record<string, any>)};
        
        // Initialize subsection if it doesn't exist
        if (!sectionCopy[subSection]) {
          sectionCopy[subSection] = {};
        }
        
        // Create a copy of the subsection
        const subSectionCopy = {...(sectionCopy[subSection] as Record<string, any>)};
        subSectionCopy[field] = value;
        
        // Update the subsection
        sectionCopy[subSection] = subSectionCopy;
        
        // Update the section
        newData[section] = sectionCopy;
        
        return newData;
      });
    },
    []
  );
  
  return {
    form,
    formData,
    setFormData,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange
  };
}
