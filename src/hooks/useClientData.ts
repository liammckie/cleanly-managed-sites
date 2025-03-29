
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BillingAddress } from '@/components/sites/forms/types/billingTypes';

export function useClientData(clientId?: string) {
  const [clientData, setClientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clientId) return;

    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();

        if (fetchError) throw new Error(fetchError.message);

        // Format billing address correctly
        const billingAddress: BillingAddress = {
          line1: data.address || '',
          city: data.city || '',
          state: data.state || '',
          postcode: data.postcode || '',
          country: data.country || 'Australia'
        };

        setClientData({
          ...data,
          billingAddress
        });
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch client data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  return { clientData, isLoading, error };
}
