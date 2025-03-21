
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subcontractorsApi, SubcontractorRecord } from '@/lib/api/subcontractorsApi';

export function useSubcontractors(siteId: string | undefined) {
  const queryClient = useQueryClient();
  
  // Query for fetching subcontractors for a site
  const subcontractorsQuery = useQuery({
    queryKey: ['subcontractors', siteId],
    queryFn: () => siteId ? subcontractorsApi.getSubcontractors(siteId) : [],
    enabled: !!siteId, // Only run the query if siteId is provided
  });
  
  // Mutation for creating a new subcontractor
  const createSubcontractorMutation = useMutation({
    mutationFn: (subData: Omit<SubcontractorRecord, 'id' | 'created_at' | 'updated_at'>) => 
      subcontractorsApi.createSubcontractor(subData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcontractors', siteId] });
      toast.success('Subcontractor added successfully');
    },
    onError: (error: any) => {
      console.error('Error creating subcontractor:', error);
      toast.error(`Failed to add subcontractor: ${error.message}`);
    },
  });
  
  // Mutation for updating a subcontractor
  const updateSubcontractorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractorRecord> }) => 
      subcontractorsApi.updateSubcontractor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcontractors', siteId] });
      toast.success('Subcontractor updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating subcontractor:', error);
      toast.error(`Failed to update subcontractor: ${error.message}`);
    },
  });
  
  // Mutation for deleting a subcontractor
  const deleteSubcontractorMutation = useMutation({
    mutationFn: (id: string) => subcontractorsApi.deleteSubcontractor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcontractors', siteId] });
      toast.success('Subcontractor removed successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting subcontractor:', error);
      toast.error(`Failed to remove subcontractor: ${error.message}`);
    },
  });
  
  return {
    subcontractors: subcontractorsQuery.data || [],
    isLoading: subcontractorsQuery.isLoading,
    isError: subcontractorsQuery.isError,
    error: subcontractorsQuery.error,
    createSubcontractor: createSubcontractorMutation.mutate,
    updateSubcontractor: updateSubcontractorMutation.mutate,
    deleteSubcontractor: deleteSubcontractorMutation.mutate,
    isCreating: createSubcontractorMutation.isPending,
    isUpdating: updateSubcontractorMutation.isPending,
    isDeleting: deleteSubcontractorMutation.isPending,
  };
}
