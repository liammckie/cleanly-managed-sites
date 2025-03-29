
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ContractActivity } from '@/types/contractActivities';

/**
 * Hook to fetch contract activity data
 */
export function useContractActivities(contractId?: string | { limit?: number }) {
  // Convert the parameter to the appropriate type
  const contractIdString = typeof contractId === 'string' ? contractId : undefined;
  const limit = typeof contractId === 'object' && contractId?.limit ? contractId.limit : 20;

  const [activities, setActivities] = useState<ContractActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!contractIdString && typeof contractId !== 'object') return;

    const fetchActivities = async () => {
      setLoading(true);
      try {
        // Using a direct query since we likely don't have an RPC for this
        const query = supabase
          .from('contract_activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit || 20);
        
        // Only filter by contract_id if it's provided
        if (contractIdString) {
          query.eq('contract_id', contractIdString);
        }

        const { data, error: queryError } = await query;
        
        if (queryError) throw new Error(queryError.message);
        
        // Map the raw data to our ContractActivity type
        const mappedActivities: ContractActivity[] = (data || []).map(item => ({
          id: item.id,
          contractId: item.contract_id,
          contract_id: item.contract_id,
          action: item.activity_type, 
          activity_type: item.activity_type,
          timestamp: item.created_at,
          created_at: item.created_at,
          userName: item.user_name || 'System',
          created_by: item.created_by,
          details: item.details || {},
          metadata: item.metadata || {},
          description: item.description || ''
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
  }, [contractIdString, limit]);

  const addActivity = async (activity: Partial<ContractActivity>) => {
    if (!contractIdString && typeof contractId !== 'object') return null;
    
    try {
      // Insert directly to the contract_activities table
      const { data, error: apiError } = await supabase
        .from('contract_activities')
        .insert({
          contract_id: contractIdString,
          activity_type: activity.action || activity.activity_type,
          description: activity.description || '',
          details: activity.details || {},
          metadata: activity.metadata || {},
          user_name: activity.userName || 'System'
        })
        .select()
        .single();

      if (apiError) throw new Error(apiError.message);
      
      // Create a properly mapped activity
      const newActivity: ContractActivity = {
        id: data.id,
        contractId: data.contract_id,
        contract_id: data.contract_id,
        action: data.activity_type,
        activity_type: data.activity_type,
        timestamp: data.created_at,
        created_at: data.created_at,
        userName: data.user_name || 'System',
        created_by: data.created_by || null,
        details: data.details || {},
        metadata: data.metadata || {},
        description: data.description || ''
      };
      
      // Update the local state
      setActivities(prev => [newActivity, ...prev]);
      
      return newActivity;
    } catch (err) {
      console.error('Error adding contract activity:', err);
      throw err;
    }
  };

  return { activities, loading, isLoading: loading, error, addActivity };
}
