
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useClient(clientId?: string) {
  const fetchClient = async () => {
    if (!clientId) return null;
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  };

  return useQuery({
    queryKey: ['client', clientId],
    queryFn: fetchClient,
    enabled: !!clientId,
  });
}
