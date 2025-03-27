
import { useState, useEffect } from 'react';
import { useClient } from './useClient';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { adaptAddress } from '@/utils/typeAdapters';

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
      // Create a new billingDetails object with client data
      const billingDetails = {
        ...prev.billingDetails,
        // Convert client address to billing address using the adapter
        billingAddress: adaptAddress({
          street: client.address || '',
          city: client.city || '',
          state: client.state || '',
          postcode: client.postcode || '',
          country: 'Australia'
        }),
        billingCity: client.city || '',
        billingState: client.state || '',
        billingPostcode: client.postcode || '',
        billingEmail: client.email || '',
        contacts: [],
        useClientInfo: true
      };

      // Add primary client contact to billing contacts if available
      if (client.contact_name) {
        billingDetails.contacts = [
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
        billingDetails
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
