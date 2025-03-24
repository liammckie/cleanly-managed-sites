
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SiteRecord } from '@/lib/types';

// API function to update a site
const updateSite = async ({ id, data }: { id: string; data: Partial<SiteRecord> }) => {
  try {
    // In a real implementation, this would call your actual API
    const response = await fetch(`/api/sites/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update site');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating site:', error);
    throw error;
  }
};

export function useSiteUpdate() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  const updateSiteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SiteRecord> }) => {
      setIsLoading(true);
      return updateSite({ id, data });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
      toast.success('Site updated successfully');
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error in site update mutation:', error);
      toast.error('Failed to update site');
      setIsLoading(false);
    },
  });
  
  return {
    updateSiteMutation,
    isLoading,
  };
}
