
import { useState, useCallback } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

// Create initial state that conforms to SiteFormData
const initialSiteFormState: SiteFormData = {
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
  contract_details: {} as ContractDetails,
  contractDetails: {} as ContractDetails,
  billingDetails: {
    billingLines: [],
    useClientInfo: false,
    billingMethod: '',
    paymentTerms: '',
    billingEmail: '',
    contacts: []
  }
};

export const useSiteFormState = (
  initialState?: Partial<SiteFormData>
) => {
  const [formState, setFormState] = useState<SiteFormData>({
    ...initialSiteFormState,
    ...initialState
  });

  const updateForm = useCallback((updates: Partial<SiteFormData>) => {
    setFormState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const updateContractDetails = useCallback((updates: Partial<ContractDetails>) => {
    setFormState(prev => ({
      ...prev,
      contractDetails: {
        ...prev.contractDetails,
        ...updates
      } as ContractDetails,
      // Also update contract_details for backward compatibility
      contract_details: {
        ...prev.contract_details,
        ...updates
      } as ContractDetails
    }));
  }, []);

  const updateBillingDetails = useCallback((updates: Partial<typeof formState.billingDetails>) => {
    setFormState(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        ...updates
      }
    }));
  }, []);

  return {
    formState,
    updateForm,
    updateContractDetails,
    updateBillingDetails,
    setFormState
  };
};

export default useSiteFormState;
