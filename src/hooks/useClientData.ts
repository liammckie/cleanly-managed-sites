
import { useState, useEffect } from 'react';
import { stringToAddressObject } from '@/utils/typeAdapters';
import { ClientRecord } from '@/lib/types';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';

export const useClientData = (clientId?: string, fetchOnMount = true) => {
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (fetchOnMount && clientId) {
      fetchClient(clientId);
    }
  }, [clientId, fetchOnMount]);

  const fetchClient = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Implementation will depend on your API/data layer
      // For now we'll just mock it
      const clientData = { id, name: 'Sample Client' } as ClientRecord;
      setClient(clientData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch client'));
    } finally {
      setLoading(false);
    }
  };

  const populateSiteForm = (setSiteForm: React.Dispatch<React.SetStateAction<SiteFormData>>) => {
    if (!client) return;

    setSiteForm((prev) => {
      // Create a proper billingDetails object that matches the expected type
      const billingDetails: BillingDetails = {
        billingAddress: {
          street: client.address || '',
          city: client.city || '',
          state: client.state || '',
          postcode: client.postcode || '',
          country: 'Australia'
        },
        billingEmail: client.email || '',
        contacts: [],
        useClientInfo: true,
        billingMethod: '',
        paymentTerms: '',
        billingLines: []
      };

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
    loading,
    error,
    fetchClient,
    populateSiteForm
  };
};

export default useClientData;
