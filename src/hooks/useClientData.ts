
import { useState, useEffect } from 'react';
import { ClientRecord } from '@/lib/types';
import { clientsApi } from '@/lib/api';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';

export const useClientData = (
  clientId: string,
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch client data when the clientId changes
  useEffect(() => {
    if (!clientId) {
      setClient(null);
      return;
    }

    const fetchClient = async () => {
      try {
        setIsLoading(true);
        const clientData = await clientsApi.getClientById(clientId);
        setClient(clientData);
        setError(null);
      } catch (err) {
        console.error("Error fetching client:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch client'));
        setClient(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  // Apply client data to the form
  const applyClientData = () => {
    if (!client) return;

    setFormData(prev => ({
      ...prev,
      // Apply billing address
      billingDetails: {
        ...prev.billingDetails,
        billingAddress: client.address || prev.billingDetails.billingAddress,
        billingCity: client.city || prev.billingDetails.billingCity,
        billingState: client.state || prev.billingDetails.billingState,
        billingPostcode: client.postcode || prev.billingDetails.billingPostcode,
        billingEmail: client.email || prev.billingDetails.billingEmail,
        // If there are client contacts, add the primary contact to billing
        contacts: client.contacts ? 
          [...prev.billingDetails.contacts, ...client.contacts
            .filter(contact => contact.is_primary)
            .map(contact => ({
              name: contact.name,
              position: contact.role,
              email: contact.email || '',
              phone: contact.phone || ''
            }))] : 
          prev.billingDetails.contacts
      },
      // Apply client contacts to site contacts if they exist
      contacts: client.contacts ? 
        [...prev.contacts, ...client.contacts.map(contact => ({
          ...contact,
          entity_id: '', // This will be filled when the site is created
          entity_type: 'site' as const
        }))] : 
        prev.contacts
    }));
  };

  // Toggle useClientInfo and apply/remove client data
  const toggleUseClientInfo = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      useClientInfo: value
    }));

    if (value && client) {
      applyClientData();
    }
  };

  return {
    client,
    isLoading,
    error,
    applyClientData,
    toggleUseClientInfo
  };
};
