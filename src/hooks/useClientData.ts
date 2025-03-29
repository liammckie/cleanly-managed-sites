
import { useState, useEffect } from 'react';
import { useClient } from './useClient';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';
import { stringToAddressObject } from '@/utils/typeAdapters';

interface UseClientDataProps {
  clientId?: string;
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>;
}

export function useClientData({ clientId, setFormData }: UseClientDataProps) {
  const [client, setClient] = useState<any>(null);
  const { data, isLoading, error } = useClient(clientId);

  useEffect(() => {
    if (data) {
      setClient(data);
    }
  }, [data]);

  const populateClientData = () => {
    if (!client) return;

    setFormData(prev => {
      // Convert address string to object if needed
      const billingAddress = {
        street: client.address || '',
        city: client.city || '',
        state: client.state || '',
        postcode: client.postcode || '',
        country: 'Australia'
      };

      // Create a new billingDetails object with client data
      const updatedBillingDetails: BillingDetails = {
        ...(prev.billingDetails || {}),
        billingAddress,
        billingEmail: client.email || '',
        contacts: [],
        useClientInfo: true,
        // Add missing required properties
        billingLines: prev.billingDetails?.billingLines || [],
        serviceDeliveryType: prev.billingDetails?.serviceDeliveryType || 'direct'
      };

      // Add primary client contact to billing contacts if available
      if (client.contact_name) {
        updatedBillingDetails.contacts = [
          {
            id: 'primary',
            name: client.contact_name,
            email: client.email || '',
            phone: client.phone || '',
            isPrimary: true,
            role: 'Primary Contact'
          }
        ];
      }

      return {
        ...prev,
        client_id: client.id,
        client_name: client.name,
        billingDetails: updatedBillingDetails
      };
    });
  };

  return {
    client,
    isLoading,
    error,
    populateClientData
  };
}
