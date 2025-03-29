
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ContractActivity } from '@/types/contracts';
import { mapFromDb } from '@/lib/utils/mappers';

/**
 * Hook to fetch contract activity data
 */
export function useContractActivities(contractId?: string, limit?: number) {
  const [activities, setActivities] = useState<ContractActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!contractId) return;

    const fetchActivities = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('contract_activities') // Use the correct table name
          .select('*')
          .eq('contract_id', contractId)
          .order('created_at', { ascending: false })
          .limit(limit || 20);

        if (error) throw new Error(error.message);
        
        // Map the raw data to our ContractActivity type
        const mappedActivities: ContractActivity[] = data.map(item => ({
          id: item.id,
          contract_id: item.contract_id,
          activity_type: item.activity_type,
          description: item.description,
          created_at: item.created_at,
          created_by: item.created_by,
          metadata: item.metadata,
          // Map additional fields used in UI
          action: item.activity_type, // Assuming activity_type can be used as action
          timestamp: item.created_at,
          userName: item.metadata?.user_name || 'System',
          details: item.metadata || {}
        }));
        
        setActivities(mappedActivities);
      } catch (err) {
        console.error('Error fetching contract activities:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [contractId, limit]);

  const addActivity = async (activity: Partial<ContractActivity>) => {
    if (!contractId) return null;
    
    try {
      const { data, error } = await supabase
        .from('contract_activities')
        .insert({
          contract_id: contractId,
          activity_type: activity.activity_type,
          description: activity.description,
          metadata: activity.metadata || {}
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      
      // Create a properly mapped activity
      const newActivity: ContractActivity = {
        id: data.id,
        contract_id: data.contract_id,
        activity_type: data.activity_type,
        description: data.description,
        created_at: data.created_at,
        created_by: data.created_by,
        metadata: data.metadata,
        // Additional fields
        action: data.activity_type,
        timestamp: data.created_at,
        userName: data.metadata?.user_name || 'System',
        details: data.metadata || {}
      };
      
      // Update the local state
      setActivities(prev => [newActivity, ...prev]);
      
      return newActivity;
    } catch (err) {
      console.error('Error adding contract activity:', err);
      throw err;
    }
  };

  return { activities, loading, error, addActivity };
}
