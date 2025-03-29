import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { ContractDetails } from '@/types/contracts';
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';

// Default initial state for the site form
const initialState: SiteFormData = {
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
  customId: '',
  contacts: [],
  contract_details: {},
  billingDetails: {
    billingFrequency: 'monthly',
    billingLines: []
  },
  subcontractors: [],
  replenishables: {
    stock: [],
    supplies: [],
    notes: ''
  },
  periodicals: {
    items: []
  },
  securityDetails: {
    alarmCode: '',
    keyLocation: '',
    accessNotes: ''
  },
  jobSpecifications: {
    daysPerWeek: 5,
    hoursPerDay: 8,
    directEmployees: 0,
    cleaningFrequency: 'daily',
    serviceDays: '',
    serviceTime: '',
    scopeNotes: ''
  }
};

export interface UseSiteFormReturn {
  formData: any; // Replace with your actual type
  setFormData: (data: any) => void;
  handleSubmit: (event: React.FormEvent) => void;
  handleChange: (field: string, value: any) => void;
  // Add any other properties that this hook returns
}

export function useSiteForm(initialData?: Partial<SiteFormData>) {
  const [formState, setFormState] = useState<SiteFormData>({
    ...initialState,
    ...(initialData || {})
  });

  const updateForm = (updates: Partial<SiteFormData>) => {
    setFormState(prev => ({
      ...prev,
      ...updates
    }));
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

  const addContact = (contact: SiteFormData['contacts'][0]) => {
    setFormState(prev => ({
      ...prev,
      contacts: [...prev.contacts, contact]
    }));
  };

  const updateContact = (index: number, contact: Partial<SiteFormData['contacts'][0]>) => {
    setFormState(prev => {
      const newContacts = [...prev.contacts];
      newContacts[index] = {
        ...newContacts[index],
        ...contact
      };
      return {
        ...prev,
        contacts: newContacts
      };
    });
  };

  const removeContact = (index: number) => {
    setFormState(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormState(initialState);
  };

  return {
    formState,
    updateForm,
    updateContractDetails,
    updateBillingDetails,
    addContact,
    updateContact,
    removeContact,
    resetForm
  };
}
