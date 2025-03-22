
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export type Contractor = {
  id: string;
  business_name: string;
  contact_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  status: string;
  tax_id: string | null;
  abn: string | null;
  contractor_type: string;
  hourly_rate: number | null;
  day_rate: number | null;
  specialty: string[] | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
  user_id: string; // Add user_id to the type
};

export type ContractorDocument = {
  id: string;
  contractor_id: string;
  document_type: string;
  name: string;
  file_path: string | null;
  status: string;
  issue_date: string | null;
  expiry_date: string | null;
  reminder_days: number;
  notes: string | null;
  created_at: string;
  // Joined data from contractors
  business_name?: string;
};

export type ContractorCounts = {
  totalContractors: number;
  activeContractors: number;
  inactiveContractors: number;
  activeSites: number;
  pendingPayments: number;
  expiringDocuments: number;
};

export function useContractors() {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get the current user
  
  // Fetch all contractors
  const contractorsQuery = useQuery({
    queryKey: ['contractors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .order('business_name');
      
      if (error) throw error;
      return data as Contractor[];
    },
  });
  
  // Get contractor counts
  const countsQuery = useQuery({
    queryKey: ['contractor-counts'],
    queryFn: async () => {
      // Get total active contractors
      const { data: activeContractors, error: activeError } = await supabase
        .from('contractors')
        .select('id')
        .eq('status', 'active');
      
      if (activeError) throw activeError;
      
      // Get total inactive contractors
      const { data: inactiveContractors, error: inactiveError } = await supabase
        .from('contractors')
        .select('id')
        .eq('status', 'inactive');
      
      if (inactiveError) throw inactiveError;
      
      // Get sites with contractor assignments
      const { data: sitesWithContractors, error: sitesError } = await supabase
        .from('contractor_site_assignments')
        .select('site_id')
        .is('end_date', null);
      
      if (sitesError) throw sitesError;
      
      // Get pending payments
      const { data: pendingPayments, error: paymentsError } = await supabase
        .from('contractor_payments')
        .select('id')
        .eq('payment_status', 'pending');
      
      if (paymentsError) throw paymentsError;
      
      // Get count of expiring documents (within 30 days)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const { data: expiringDocs, error: docsError } = await supabase
        .from('contractor_documents')
        .select('id')
        .lte('expiry_date', futureDate.toISOString().split('T')[0])
        .gt('expiry_date', new Date().toISOString().split('T')[0]);
      
      if (docsError) throw docsError;
      
      const counts: ContractorCounts = {
        totalContractors: (activeContractors?.length || 0) + (inactiveContractors?.length || 0),
        activeContractors: activeContractors?.length || 0,
        inactiveContractors: inactiveContractors?.length || 0,
        activeSites: new Set(sitesWithContractors?.map(a => a.site_id)).size,
        pendingPayments: pendingPayments?.length || 0,
        expiringDocuments: expiringDocs?.length || 0
      };
      
      return counts;
    },
    enabled: contractorsQuery.isSuccess,
  });
  
  // Get expiring documents
  const expiringDocsQuery = useQuery({
    queryKey: ['expiring-documents'],
    queryFn: async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const { data, error } = await supabase
        .from('contractor_documents')
        .select(`
          *,
          contractors(business_name)
        `)
        .lte('expiry_date', futureDate.toISOString().split('T')[0])
        .gt('expiry_date', new Date().toISOString().split('T')[0])
        .order('expiry_date');
      
      if (error) throw error;
      
      return data.map(doc => ({
        ...doc,
        business_name: doc.contractors?.business_name
      })) as ContractorDocument[];
    },
    enabled: contractorsQuery.isSuccess,
  });
  
  // Create contractor mutation
  const createContractorMutation = useMutation({
    mutationFn: async (newContractor: Omit<Contractor, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error('User must be authenticated to create a contractor');
      
      const contractorWithUserId = {
        ...newContractor,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('contractors')
        .insert(contractorWithUserId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Contractor> }) => {
      const { data: updatedData, error } = await supabase
        .from('contractors')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedData;
    },
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
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contractors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
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
    error: contractorsQuery.error,
    contractorCounts: countsQuery.data,
    isCountsLoading: countsQuery.isLoading,
    expiringDocuments: expiringDocsQuery.data || [],
    createContractor: createContractorMutation.mutate,
    updateContractor: updateContractorMutation.mutate,
    deleteContractor: deleteContractorMutation.mutate,
  };
}
