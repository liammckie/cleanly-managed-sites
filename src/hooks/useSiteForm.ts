
import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { getInitialFormData } from '@/components/sites/forms/types/initialFormData';
import { useForm } from 'react-hook-form';

export function useSiteForm() {
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<SiteFormData>({
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Australia',
      status: 'active',
      contract_details: {
        startDate: '',
        endDate: '',
        autoRenewal: false,
        contractNumber: '',
      },
      billingDetails: {
        billingFrequency: 'monthly',
        paymentTerms: 'net30',
        invoiceMethod: 'email',
        // Properly use only fields defined in BillingDetails interface
        billingNotes: '',
        useSiteAddress: true,
      },
    },
  });

  const handleChange = (field: keyof SiteFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section: keyof SiteFormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleDoubleNestedChange = (
    section: keyof SiteFormData,
    subsection: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section]?.[subsection],
          [field]: value,
        },
      },
    }));
  };

  const validateStep = (stepIndex: number) => {
    // Simple validation example
    if (stepIndex === 0 && !formData.name) {
      setErrors({ name: 'Site name is required' });
      return false;
    }

    // Clear errors if validation passes
    setErrors({});
    return true;
  };

  const getCompletionPercentage = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Count basic fields
    ['name', 'address', 'city', 'state', 'postalCode', 'country', 'status'].forEach((field) => {
      totalFields++;
      if (formData[field as keyof SiteFormData]) completedFields++;
    });

    // Count contract fields
    if (formData.contractDetails) {
      ['startDate', 'endDate', 'contractNumber'].forEach((field) => {
        totalFields++;
        if (formData.contractDetails?.[field as keyof typeof formData.contractDetails])
          completedFields++;
      });
    }

    // Count billing fields
    if (formData.billingDetails) {
      ['billingFrequency', 'paymentTerms', 'invoiceMethod'].forEach((field) => {
        totalFields++;
        if (formData.billingDetails?.[field as keyof typeof formData.billingDetails])
          completedFields++;
      });
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  const handleSubmit = async (siteId?: string) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      
      // Reset form after successful submission
      if (!siteId) {
        setFormData(getInitialFormData());
        setStep(0);
      }
      
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    step,
    setStep,
    errors,
    setErrors,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    validateStep,
    getCompletionPercentage,
    handleSubmit,
    isSubmitting,
    form,
  };
}
