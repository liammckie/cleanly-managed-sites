
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contractorsApi } from '@/lib/api/contractors';
import { ContractorRecord } from '@/lib/types';

export function useContractors() {
  const queryClient = useQueryClient();
  
  // Query for fetching all contractors
  const contractorsQuery = useQuery({
    queryKey: ['contractors'],
    queryFn: contractorsApi.getContractors,
  });
  
  // Query for contractor status counts
  const contractorStatusCountsQuery = useQuery({
    queryKey: ['contractorStatusCounts'],
    queryFn: contractorsApi.getContractorCountByStatus,
  });
  
  // Mutation for creating a new contractor
  const createContractorMutation = useMutation({
    mutationFn: (contractorData: Partial<ContractorRecord>) => contractorsApi.createContractor(contractorData),
    onSuccess: () => {
      // Invalidate the contractors query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      queryClient.invalidateQueries({ queryKey: ['contractorStatusCounts'] });
      toast.success('Contractor created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating contractor:', error);
      toast.error(`Failed to create contractor: ${error.message}`);
    },
  });
  
  // Mutation for updating a contractor
  const updateContractorMutation = useMutation({
    mutationFn: (data: { id: string; data: Partial<ContractorRecord> }) => 
      contractorsApi.updateContractor(data),
    onSuccess: (_, variables) => {
      // Invalidate both contractors list and the specific contractor
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      queryClient.invalidateQueries({ queryKey: ['contractor', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['contractorStatusCounts'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-history', variables.id] });
      toast.success('Contractor updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating contractor:', error);
      toast.error(`Failed to update contractor: ${error.message}`);
    },
  });
  
  // Mutation for deleting a contractor
  const deleteContractorMutation = useMutation({
    mutationFn: (id: string) => contractorsApi.deleteContractor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      queryClient.invalidateQueries({ queryKey: ['contractorStatusCounts'] });
      toast.success('Contractor deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting contractor:', error);
      toast.error(`Failed to delete contractor: ${error.message}`);
    },
  });
  
  // Calculate the derived contractorCounts prop that pages are looking for
  const contractorCounts = {
    totalContractors: contractorsQuery.data?.length || 0,
    activeContractors: contractorsQuery.data?.filter(c => c.status === 'active')?.length || 0,
    expiringDocuments: 0 // This is a placeholder as we don't have document expiry logic yet
  };
  
  return {
    contractors: contractorsQuery.data || [],
    statusCounts: contractorStatusCountsQuery.data || { active: 0, inactive: 0, pending: 0 },
    isLoading: contractorsQuery.isLoading || contractorStatusCountsQuery.isLoading,
    isError: contractorsQuery.isError,
    error: contractorsQuery.error,
    createContractor: createContractorMutation.mutateAsync,
    updateContractor: updateContractorMutation.mutateAsync,
    deleteContractor: deleteContractorMutation.mutateAsync,
    isCreating: createContractorMutation.isPending,
    isUpdating: updateContractorMutation.isPending,
    isDeleting: deleteContractorMutation.isPending,
    contractorCounts // Add the derived contractor counts
  };
}

export function useContractorDetails(contractorId: string | undefined) {
  const queryClient = useQueryClient();
  
  // Query for fetching a single contractor by ID
  const contractorQuery = useQuery({
    queryKey: ['contractor', contractorId],
    queryFn: () => contractorId ? contractorsApi.getContractorById(contractorId) : null,
    enabled: !!contractorId, // Only run the query if contractorId is provided
  });
  
  // Mutation for updating a contractor
  const updateContractorMutation = useMutation({
    mutationFn: (data: Partial<ContractorRecord>) => 
      contractorId ? contractorsApi.updateContractor({ id: contractorId, data }) : Promise.reject('No contractor ID provided'),
    onSuccess: () => {
      // Invalidate both the contractors list and the current contractor detail
      queryClient.invalidateQueries({ queryKey: ['contractors'] });
      queryClient.invalidateQueries({ queryKey: ['contractor', contractorId] });
      queryClient.invalidateQueries({ queryKey: ['contractorStatusCounts'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-history', contractorId] });
      toast.success('Contractor updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating contractor:', error);
      toast.error(`Failed to update contractor: ${error.message}`);
    },
  });
  
  return {
    contractor: contractorQuery.data as ContractorRecord | null,
    isLoading: contractorQuery.isLoading,
    isError: contractorQuery.isError,
    error: contractorQuery.error,
    updateContractor: updateContractorMutation.mutate,
    isUpdating: updateContractorMutation.isPending,
  };
}
