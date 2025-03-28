
import { useState, useEffect } from 'react';
import { ContractActivity } from '@/types/db';

interface UseContractActivitiesProps {
  contractId?: string;
  limit?: number;
}

/**
 * Hook to fetch contract activities for the activity feed
 */
export function useContractActivities({ 
  contractId, 
  limit = 10 
}: UseContractActivitiesProps = {}) {
  const [activities, setActivities] = useState<ContractActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // This would be a real API call in production
        // For now, use mock data
        const mockActivities: ContractActivity[] = [
          {
            id: '1',
            contractId: contractId || '1',
            action: 'created',
            timestamp: new Date().toISOString(),
            userId: 'user1',
            userName: 'John Doe',
            details: {
              notes: 'Contract was created'
            }
          },
          {
            id: '2',
            contractId: contractId || '1',
            action: 'updated',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            userId: 'user1',
            userName: 'John Doe',
            details: {
              field: 'value',
              oldValue: '$1000',
              newValue: '$1200'
            }
          },
          {
            id: '3',
            contractId: contractId || '1',
            action: 'renewed',
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            userId: 'user2',
            userName: 'Jane Smith',
            details: {
              notes: 'Contract renewed for another year'
            }
          }
        ];
        
        // Filter by contractId if provided
        const filteredActivities = contractId 
          ? mockActivities.filter(a => a.contractId === contractId)
          : mockActivities;
          
        // Limit the number of activities if specified
        const limitedActivities = limit > 0
          ? filteredActivities.slice(0, limit)
          : filteredActivities;
          
        setActivities(limitedActivities);
      } catch (err) {
        console.error('Error fetching contract activities:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, [contractId, limit]);
  
  return {
    activities,
    isLoading,
    error,
  };
}

export default useContractActivities;
