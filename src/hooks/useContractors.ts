
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contractorsApi } from '@/lib/api/contractors';
import { ContractorRecord } from '@/lib/types';

export function useContractors() {
  const queryClient = useQueryClient();
  
  // Get all contractors
  const contractorsQuery = useQuery({
    queryKey: ['contractors'],
    queryFn: contractorsApi.getContractors,
  });
  
  // Get contractor count by status
  const contractorCountsQuery = useQuery({
    queryKey: ['contractor-counts'],
    queryFn: async () => {
      const statusCounts = await contractorsApi.getContractorCountByStatus();
      
      // Calculate total active contractors
      const activeContractors = statusCounts['active'] || 0;
      
      // For now, hard-code expiring documents to 0 until we implement document tracking
      const expiringDocuments = 0;
      
      return {
        totalContractors: Object.values(statusCounts).reduce((sum, count) => sum + count, 0),
        activeContractors,
        expiringDocuments
      };
    },
    enabled: contractorsQuery.isSuccess,
  });

  // Create contractor mutation
  const createContractorMutation = useMutation({
    mutationFn: (data: Partial<ContractorRecord>) => contractorsApi.createContractor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-counts'] });
      toast.success('Contractor created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating contractor:', error);
      toast.error(`Failed to create contractor: ${error.message}`);
    },
  });

  // Update contractor mutation
  const updateContractorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContractorRecord> }) => 
      contractorsApi.updateContractor({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-counts'] });
      toast.success('Contractor updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating contractor:', error);
      toast.error(`Failed to update contractor: ${error.message}`);
    },
  });

  // Delete contractor mutation
  const deleteContractorMutation = useMutation({
    mutationFn: (id: string) => contractorsApi.deleteContractor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-counts'] });
      toast.success('Contractor deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting contractor:', error);
      toast.error(`Failed to delete contractor: ${error.message}`);
    },
  });

  return {
    contractors: contractorsQuery.data || [],
    isLoading: contractorsQuery.isLoading,
    isError: contractorsQuery.isError,
    error: contractorsQuery.error,
    contractorCounts: contractorCountsQuery.data,
    createContractor: createContractorMutation.mutate,
    updateContractor: updateContractorMutation.mutate,
    deleteContractor: deleteContractorMutation.mutate,
    isCreating: createContractorMutation.isPending,
    isUpdating: updateContractorMutation.isPending,
    isDeleting: deleteContractorMutation.isPending,
  };
}

export function useContractorDetails(contractorId: string) {
  const queryClient = useQueryClient();
  
  // Get contractor by ID
  const contractorQuery = useQuery({
    queryKey: ['contractor', contractorId],
    queryFn: () => contractorsApi.getContractorById(contractorId),
    enabled: !!contractorId,
  });

  // Update contractor mutation
  const updateContractorMutation = useMutation({
    mutationFn: (data: Partial<ContractorRecord>) => 
      contractorsApi.updateContractor({ id: contractorId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      queryClient.invalidateQueries({ queryKey: ['contractor', contractorId] });
      toast.success('Contractor updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating contractor:', error);
      toast.error(`Failed to update contractor: ${error.message}`);
    },
  });

  return {
    contractor: contractorQuery.data,
    isLoading: contractorQuery.isLoading,
    isError: contractorQuery.isError,
    error: contractorQuery.error,
    updateContractor: updateContractorMutation.mutate,
    isUpdating: updateContractorMutation.isPending,
  };
}
