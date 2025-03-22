
import { supabase } from '@/lib/supabase';
import { ContractorRecord } from '@/lib/types';

// Contractor API functions
export const contractorsApi = {
  // Get all contractors for the current user
  async getContractors(): Promise<ContractorRecord[]> {
    const { data: contractors, error } = await supabase
      .from('contractors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contractors:', error);
      throw error;
    }
    
    return contractors as ContractorRecord[] || [];
  },
  
  // Get contractor count by status
  async getContractorCountByStatus(): Promise<Record<string, number>> {
    const { data: contractors, error } = await supabase
      .from('contractors')
      .select('status');
    
    if (error) {
      console.error('Error fetching contractor status counts:', error);
      throw error;
    }
    
    const statusCount: Record<string, number> = {
      active: 0,
      inactive: 0,
      pending: 0
    };
    
    contractors?.forEach(contractor => {
      if (contractor.status in statusCount) {
        statusCount[contractor.status] += 1;
      }
    });
    
    return statusCount;
  },
  
  // Get a single contractor by ID
  async getContractorById(id: string): Promise<ContractorRecord | null> {
    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching contractor with ID ${id}:`, error);
      throw error;
    }
    
    return data as ContractorRecord;
  },
  
  // Create a new contractor
  async createContractor(contractorData: Partial<ContractorRecord>): Promise<ContractorRecord> {
    console.log('Creating contractor with data:', contractorData);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Make sure required fields are present
    if (!contractorData.business_name || !contractorData.contact_name || !contractorData.status || !contractorData.contractor_type) {
      throw new Error('Missing required contractor data: business_name, contact_name, status, and contractor_type are required');
    }
    
    // Prepare the contractor data for insertion
    const contractorRecord = {
      business_name: contractorData.business_name,
      contact_name: contractorData.contact_name,
      email: contractorData.email || null,
      phone: contractorData.phone || null,
      address: contractorData.address || null,
      city: contractorData.city || null,
      state: contractorData.state || null,
      postcode: contractorData.postcode || null,
      status: contractorData.status,
      contractor_type: contractorData.contractor_type,
      hourly_rate: contractorData.hourly_rate || null,
      day_rate: contractorData.day_rate || null,
      abn: contractorData.abn || null,
      tax_id: contractorData.tax_id || null,
      notes: contractorData.notes || null,
      specialty: contractorData.specialty || null,
      rating: contractorData.rating || null,
      user_id: user.id,
    };
    
    const { data, error } = await supabase
      .from('contractors')
      .insert(contractorRecord)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating contractor:', error);
      throw error;
    }
    
    return data as ContractorRecord;
  },
  
  // Update an existing contractor
  async updateContractor({ id, data }: { id: string; data: Partial<ContractorRecord> }): Promise<ContractorRecord> {
    // First, get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the current contractor data for history
    const { data: currentContractor, error: fetchError } = await supabase
      .from('contractors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching current contractor with ID ${id}:`, fetchError);
      throw fetchError;
    }
    
    // Create update object
    const updateData = { ...data };
    
    // Update the contractor
    const { data: updatedContractor, error } = await supabase
      .from('contractors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating contractor with ID ${id}:`, error);
      throw error;
    }
    
    // Create history entry
    const historyEntry = {
      contractor_id: id,
      contractor_data: currentContractor,
      created_by: user.id,
      notes: 'Contractor details updated'
    };
    
    const { error: historyError } = await supabase
      .from('contractor_history')
      .insert(historyEntry);
    
    if (historyError) {
      console.error('Error creating contractor history entry:', historyError);
      // We don't throw this error as it should not prevent the update operation
      console.warn('Contractor updated but history creation failed');
    }
    
    return updatedContractor as ContractorRecord;
  },
  
  // Delete a contractor
  async deleteContractor(id: string): Promise<void> {
    // Delete any history entries first
    const { error: historyError } = await supabase
      .from('contractor_history')
      .delete()
      .eq('contractor_id', id);
    
    if (historyError) {
      console.error(`Error deleting history entries for contractor with ID ${id}:`, historyError);
      throw historyError;
    }
    
    // Now delete the contractor
    const { error } = await supabase
      .from('contractors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting contractor with ID ${id}:`, error);
      throw error;
    }
  }
};
