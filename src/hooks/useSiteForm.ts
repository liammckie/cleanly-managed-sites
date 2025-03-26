
import { useState, useCallback } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { useErrorHandling } from './useErrorHandling';
import { validateBasicInfo } from '@/components/sites/forms/types/validationUtils';
import { toast } from 'sonner';
import { sitesApi } from '@/lib/api/sites';

interface UseSiteFormProps {
  initialFormData: SiteFormData;
  onSubmitSuccess?: (siteId: string) => void;
}

export const useSiteForm = ({ initialFormData, onSubmitSuccess }: UseSiteFormProps) => {
  const [formData, setFormData] = useState<SiteFormData>(initialFormData);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandling();
  
  // Reset form data to initial state
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, [initialFormData]);
  
  // Handle single field changes
  const handleChange = useCallback((field: keyof SiteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  }, [errors]);
  
  // Handle changes in nested objects
  const handleNestedChange = useCallback((section: keyof SiteFormData, field: string, value: any) => {
    setFormData(prev => {
      // Safely create updated section object without using spread on undefined/null
      const currentSection = prev[section] || {};
      const updatedSection = { ...currentSection, [field]: value };
      
      return {
        ...prev,
        [section]: updatedSection
      };
    });
    
    // Clear error for this field
    const errorKey = `${String(section)}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[errorKey];
        return updated;
      });
    }
  }, [errors]);
  
  // Handle changes in doubly nested objects
  const handleDoubleNestedChange = useCallback((
    section: keyof SiteFormData, 
    subsection: string, 
    field: string, 
    value: any
  ) => {
    setFormData(prev => {
      // Safely create updated nested structure without using spread on undefined/null
      const currentSection = prev[section] || {};
      const currentSubsection = currentSection[subsection] || {};
      const updatedSubsection = { ...currentSubsection, [field]: value };
      
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [subsection]: updatedSubsection
        }
      };
    });
    
    // Clear error for this field
    const errorKey = `${String(section)}.${subsection}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[errorKey];
        return updated;
      });
    }
  }, [errors]);
  
  // Handle client selection and fetch additional data if needed
  const handleClientChange = useCallback((clientId: string) => {
    handleChange('client_id', clientId);
    
    // Additional logic to fetch client data and populate form
    // For now, this is a placeholder
  }, [handleChange]);
  
  // Load site data for editing
  const loadSiteData = useCallback((siteData: any) => {
    if (!siteData) return;
    
    // Map API data to form format
    const mappedData: SiteFormData = {
      name: siteData.name || '',
      address: siteData.address || '',
      city: siteData.city || '',
      state: siteData.state || '',
      postalCode: siteData.postal_code || siteData.postcode || '',
      country: siteData.country || 'Australia',
      client_id: siteData.client_id || '',
      client_name: siteData.client_name || '',
      status: siteData.status || 'active',
      phone: siteData.phone || '',
      email: siteData.email || '',
      representative: siteData.representative || '',
      customId: siteData.custom_id || '',
      // Map other properties as needed
      
      // Complex objects
      contract_details: siteData.contract_details || {},
      billingDetails: siteData.billing_details || {},
      additionalContracts: siteData.additional_contracts || [],
      subcontractors: siteData.subcontractors || [],
      hasSubcontractors: siteData.has_subcontractors || false,
      monthlyCost: siteData.monthly_cost || 0,
      weeklyRevenue: siteData.weekly_revenue || 0,
      monthlyRevenue: siteData.monthly_revenue || 0,
      annualRevenue: siteData.annual_revenue || 0,
      replenishables: siteData.replenishables || {},
      periodicals: siteData.periodicals || {},
      securityDetails: siteData.security_details || {},
      jobSpecifications: siteData.job_specifications || {},
      notes: siteData.notes || ''
    };
    
    setFormData(mappedData);
  }, []);
  
  // Handle form validation for each step
  const validateStep = useCallback((stepIndex: number): boolean => {
    let stepErrors: Record<string, string> = {};
    
    switch (stepIndex) {
      case 0: // Basic Info
        stepErrors = validateBasicInfo(formData);
        break;
      
      // Add validation for other steps
        
      default:
        // No validation for this step
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [formData]);
  
  // Calculate completion percentage based on required fields
  const getCompletionPercentage = useCallback((): number => {
    // Simple calculation for now
    const requiredFields = [
      'name', 'address', 'city', 'state', 'postalCode',
      'client_id', 'status'
    ];
    
    const filledFields = requiredFields.filter(field => 
      formData[field as keyof SiteFormData]
    );
    
    return Math.floor((filledFields.length / requiredFields.length) * 100);
  }, [formData]);
  
  // Form submission handler
  const handleSubmit = useCallback(async (siteId?: string) => {
    try {
      setIsSubmitting(true);
      
      // Validate final step
      if (!validateStep(step)) {
        toast.error('Please fix the validation errors before submitting');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare data for API
      const apiData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
        client_id: formData.client_id,
        status: formData.status,
        phone: formData.phone,
        email: formData.email,
        representative: formData.representative,
        custom_id: formData.customId,
        contract_details: formData.contract_details,
        billing_details: formData.billingDetails,
        has_subcontractors: formData.hasSubcontractors,
        subcontractors: formData.subcontractors,
        monthly_cost: formData.monthlyCost,
        weekly_revenue: formData.weeklyRevenue,
        monthly_revenue: formData.monthlyRevenue,
        annual_revenue: formData.annualRevenue,
        replenishables: formData.replenishables,
        periodicals: formData.periodicals,
        security_details: formData.securityDetails,
        job_specifications: formData.jobSpecifications,
        notes: formData.notes
      };
      
      let result;
      
      if (siteId) {
        // Update existing site
        result = await sitesApi.updateSite(siteId, apiData);
        toast.success('Site updated successfully');
      } else {
        // Create new site
        result = await sitesApi.createSite(apiData);
        toast.success('Site created successfully');
        resetForm();
      }
      
      // Call success callback if provided
      if (onSubmitSuccess && result?.id) {
        onSubmitSuccess(result.id);
      }
      
    } catch (error) {
      handleError(error, 'Failed to save site');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, step, validateStep, resetForm, onSubmitSuccess, handleError]);
  
  // === Specialized Handlers ===
  
  // Billing Lines
  const addBillingLine = useCallback(() => {
    setFormData(prev => {
      const currentBillingDetails = prev.billingDetails || {};
      const currentLines = currentBillingDetails.billingLines || [];
      
      return {
        ...prev,
        billingDetails: {
          ...currentBillingDetails,
          billingLines: [
            ...currentLines,
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
  
  const updateBillingLine = useCallback((id: string, field: string, value: any) => {
    setFormData(prev => {
      const currentBillingDetails = prev.billingDetails || {};
      const currentLines = currentBillingDetails.billingLines || [];
      
      const updatedLines = currentLines.map(line => 
        line.id === id ? { ...line, [field]: value } : line
      );
      
      return {
        ...prev,
        billingDetails: {
          ...currentBillingDetails,
          billingLines: updatedLines
        }
      };
    });
  }, []);
  
  const removeBillingLine = useCallback((id: string) => {
    setFormData(prev => {
      const currentBillingDetails = prev.billingDetails || {};
      const currentLines = currentBillingDetails.billingLines || [];
      
      return {
        ...prev,
        billingDetails: {
          ...currentBillingDetails,
          billingLines: currentLines.filter(line => line.id !== id)
        }
      };
    });
  }, []);
  
  // Subcontractors
  const addSubcontractor = useCallback(() => {
    setFormData(prev => {
      const currentSubcontractors = prev.subcontractors || [];
      
      return {
        ...prev,
        hasSubcontractors: true,
        subcontractors: [
          ...currentSubcontractors,
          {
            id: crypto.randomUUID(),
            business_name: '',
            contact_name: '',
            email: '',
            phone: '',
            is_flat_rate: true,
            monthly_cost: 0,
            services: []
          }
        ]
      };
    });
  }, []);
  
  const updateSubcontractor = useCallback((index: number, field: string, value: any) => {
    setFormData(prev => {
      const currentSubcontractors = prev.subcontractors || [];
      
      const updatedSubcontractors = [...currentSubcontractors];
      if (updatedSubcontractors[index]) {
        updatedSubcontractors[index] = {
          ...updatedSubcontractors[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        subcontractors: updatedSubcontractors
      };
    });
  }, []);
  
  const removeSubcontractor = useCallback((index: number) => {
    setFormData(prev => {
      const currentSubcontractors = prev.subcontractors || [];
      
      const updatedSubcontractors = [...currentSubcontractors];
      updatedSubcontractors.splice(index, 1);
      
      return {
        ...prev,
        subcontractors: updatedSubcontractors,
        hasSubcontractors: updatedSubcontractors.length > 0
      };
    });
  }, []);
  
  // Replenishables
  const addReplenishable = useCallback((type: 'stock' | 'supplies') => {
    setFormData(prev => {
      const currentReplenishables = prev.replenishables || {};
      const currentItems = currentReplenishables[type] || [];
      
      return {
        ...prev,
        replenishables: {
          ...currentReplenishables,
          [type]: [
            ...currentItems,
            {
              id: crypto.randomUUID(),
              name: '',
              quantity: 1,
              reorderLevel: 0,
              unit: 'ea'
            }
          ]
        }
      };
    });
  }, []);
  
  const updateReplenishable = useCallback((type: 'stock' | 'supplies', index: number, field: string, value: any) => {
    setFormData(prev => {
      const currentReplenishables = prev.replenishables || {};
      const currentItems = currentReplenishables[type] || [];
      
      const updatedItems = [...currentItems];
      if (updatedItems[index]) {
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        replenishables: {
          ...currentReplenishables,
          [type]: updatedItems
        }
      };
    });
  }, []);
  
  const removeReplenishable = useCallback((type: 'stock' | 'supplies', index: number) => {
    setFormData(prev => {
      const currentReplenishables = prev.replenishables || {};
      const currentItems = currentReplenishables[type] || [];
      
      const updatedItems = [...currentItems];
      updatedItems.splice(index, 1);
      
      return {
        ...prev,
        replenishables: {
          ...currentReplenishables,
          [type]: updatedItems
        }
      };
    });
  }, []);
  
  // Contract Terms
  const addContractTerm = useCallback(() => {
    setFormData(prev => {
      const currentContractDetails = prev.contract_details || {};
      const currentTerms = currentContractDetails.terms || [];
      
      return {
        ...prev,
        contract_details: {
          ...currentContractDetails,
          terms: [
            ...currentTerms,
            {
              id: crypto.randomUUID(),
              name: '',
              description: '',
              startDate: '',
              endDate: '',
              renewalTerms: '',
              terminationPeriod: '',
              autoRenew: false
            }
          ]
        }
      };
    });
  }, []);
  
  const updateContractTerm = useCallback((index: number, field: string, value: any) => {
    setFormData(prev => {
      const currentContractDetails = prev.contract_details || {};
      const currentTerms = currentContractDetails.terms || [];
      
      const updatedTerms = [...currentTerms];
      if (updatedTerms[index]) {
        updatedTerms[index] = {
          ...updatedTerms[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        contract_details: {
          ...currentContractDetails,
          terms: updatedTerms
        }
      };
    });
  }, []);
  
  const removeContractTerm = useCallback((index: number) => {
    setFormData(prev => {
      const currentContractDetails = prev.contract_details || {};
      const currentTerms = currentContractDetails.terms || [];
      
      const updatedTerms = [...currentTerms];
      updatedTerms.splice(index, 1);
      
      return {
        ...prev,
        contract_details: {
          ...currentContractDetails,
          terms: updatedTerms
        }
      };
    });
  }, []);
  
  // Additional Contracts
  const addAdditionalContract = useCallback(() => {
    setFormData(prev => {
      const currentAdditionalContracts = prev.additionalContracts || [];
      
      return {
        ...prev,
        additionalContracts: [
          ...currentAdditionalContracts,
          {
            id: crypto.randomUUID(),
            contractNumber: '',
            startDate: '',
            endDate: '',
            contractType: 'cleaning',
            autoRenewal: false,
            renewalPeriod: 0,
            serviceFrequency: 'weekly'
          }
        ]
      };
    });
  }, []);
  
  const updateAdditionalContract = useCallback((index: number, field: string, value: any) => {
    setFormData(prev => {
      const currentAdditionalContracts = prev.additionalContracts || [];
      
      const updatedContracts = [...currentAdditionalContracts];
      if (updatedContracts[index]) {
        updatedContracts[index] = {
          ...updatedContracts[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        additionalContracts: updatedContracts
      };
    });
  }, []);
  
  const removeAdditionalContract = useCallback((index: number) => {
    setFormData(prev => {
      const currentAdditionalContracts = prev.additionalContracts || [];
      
      const updatedContracts = [...currentAdditionalContracts];
      updatedContracts.splice(index, 1);
      
      return {
        ...prev,
        additionalContracts: updatedContracts
      };
    });
  }, []);

  return {
    formData,
    setFormData,
    step,
    setStep,
    errors,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleClientChange,
    loadSiteData,
    validateStep,
    getCompletionPercentage,
    handleSubmit,
    isSubmitting,
    
    // Specialized handlers
    addBillingLine,
    updateBillingLine,
    removeBillingLine,
    
    addSubcontractor,
    updateSubcontractor,
    removeSubcontractor,
    
    addReplenishable,
    updateReplenishable,
    removeReplenishable,
    
    addContractTerm,
    updateContractTerm,
    removeContractTerm,
    
    addAdditionalContract,
    updateAdditionalContract,
    removeAdditionalContract,
  };
};
