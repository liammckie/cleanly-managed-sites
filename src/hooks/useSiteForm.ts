
import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { ContractDetails, BillingDetails } from '@/components/sites/forms/types/siteFormData';

export const useSiteForm = (initialData?: Partial<SiteFormData>) => {
  const [formState, setFormState] = useState<SiteFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    client_id: '',
    representative: '',
    status: 'active',
    phone: '',
    email: '',
    custom_id: '',
    contractDetails: {
      contractNumber: '',
      startDate: '',
      endDate: '',
      autoRenewal: false,
      terminationPeriod: '',
      renewalTerms: '',
      status: 'active',
    },
    billingDetails: {
      billingLines: [],
    },
    ...initialData
  });

  const updateForm = (updates: Partial<SiteFormData>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const updateContractDetails = (updates: Partial<ContractDetails>) => {
    setFormState(prev => ({
      ...prev,
      contractDetails: {
        ...prev.contractDetails,
        ...updates
      }
    }));
  };

  const updateBillingDetails = (updates: Partial<BillingDetails>) => {
    setFormState(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        ...updates
      }
    }));
  };

  // For backward compatibility
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateForm({ [name]: value } as any);
  };

  const handleNestedChange = (parentKey: keyof SiteFormData, field: string, value: any) => {
    const updatedParent = {
      ...formState[parentKey],
      [field]: value
    };
    updateForm({ [parentKey]: updatedParent } as any);
  };

  const handleDoubleNestedChange = (
    parentKey: keyof SiteFormData,
    childKey: string,
    field: string,
    value: any
  ) => {
    const parent = formState[parentKey] as any;
    const updatedParent = {
      ...parent,
      [childKey]: {
        ...parent[childKey],
        [field]: value
      }
    };
    updateForm({ [parentKey]: updatedParent } as any);
  };

  return {
    formState,
    updateForm,
    updateContractDetails,
    updateBillingDetails,
    setFormState,
    // For backward compatibility
    formData: formState,
    setFormData: setFormState,
    handleChange,
    handleNestedChange,
    handleDoubleNestedChange,
    resetForm: () => setFormState({
      name: '',
      address: '',
      city: '',
      state: '',
      postcode: '',
      client_id: '',
      representative: '',
      status: 'active',
      phone: '',
      email: '',
      custom_id: '',
      contractDetails: {
        contractNumber: '',
        startDate: '',
        endDate: '',
        autoRenewal: false,
        terminationPeriod: '',
        renewalTerms: '',
        status: 'active',
      },
      billingDetails: {
        billingLines: [],
      },
    })
  };
};
