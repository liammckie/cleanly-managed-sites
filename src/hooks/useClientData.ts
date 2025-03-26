
import { useState, useEffect } from 'react';
import { ClientRecord } from '@/lib/types';
import { clientsApi } from '@/lib/api';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteContact } from '@/components/sites/forms/types/contactTypes';

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
    // Don't attempt to fetch if clientId is empty
    if (!clientId || clientId.trim() === '') {
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

    setFormData(prev => {
      // Convert client contacts to site contacts with proper type
      const newContacts: SiteContact[] = client.contacts 
        ? client.contacts.map(contact => ({
            id: contact.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            role: contact.role,
            department: contact.department,
            notes: contact.notes,
            is_primary: contact.is_primary
          }))
        : [];

      return {
        ...prev,
        // Apply billing address
        billingDetails: {
          ...prev.billingDetails,
          billingAddress: client.address || prev.billingDetails.billingAddress,
          billingCity: client.city || prev.billingDetails.billingCity,
          billingState: client.state || prev.billingDetails.billingState,
          billingPostcode: client.postcode || prev.billingDetails.billingPostcode,
          billingEmail: client.email || prev.billingDetails.billingEmail,
          // Add client contacts to the billing contacts with proper type
          contacts: [...prev.billingDetails.contacts]
        },
        // Add client contacts to site contacts with correct typing
        contacts: [...prev.contacts, ...newContacts]
      };
    });
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
