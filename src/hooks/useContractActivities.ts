
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ContractActivity } from '@/types/db';

export function useContractActivities(contractId?: string) {
  const [activities, setActivities] = useState<ContractActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!contractId) return;

    async function fetchContractActivities() {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('contract_activity')
          .select('*')
          .eq('contract_id', contractId)
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw new Error(`Error fetching contract activities: ${fetchError.message}`);
        }

        setActivities(data as ContractActivity[]);
      } catch (err) {
        console.error('Error in useContractActivities:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        toast.error('Failed to load contract activities');
      } finally {
        setIsLoading(false);
      }
    }

    fetchContractActivities();
  }, [contractId]);

  const addActivity = async (activityData: Omit<ContractActivity, 'id' | 'created_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('contract_activity')
        .insert([{
          contract_id: contractId,
          activity_type: activityData.activity_type,
          description: activityData.description,
          created_by: activityData.created_by,
          metadata: activityData.metadata
        }])
        .select()
        .single();

      if (insertError) {
        throw new Error(`Error adding contract activity: ${insertError.message}`);
      }

      setActivities(prev => [data as ContractActivity, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding contract activity:', err);
      toast.error('Failed to record contract activity');
      throw err;
    }
  };

  return {
    activities,
    isLoading,
    error,
    addActivity
  };
}
