
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
    
    // Check if contractor_history table exists
    try {
      const { data: tableInfo } = await supabase
        .rpc('get_table_definition', { table_name: 'contractor_history' });
      
      const tableExists = tableInfo && tableInfo.length > 0;
        
      // If the table exists, create a history entry
      if (tableExists) {
        try {
          // Get the current version number
          const { data: versionData } = await supabase
            .from('contractor_history')
            .select('version_number')
            .eq('contractor_id', id)
            .order('version_number', { ascending: false })
            .limit(1);
          
          const currentVersion = versionData && versionData.length > 0 ? versionData[0].version_number : 0;
          
          // Create history entry
          const historyEntry = {
            contractor_id: id,
            contractor_data: currentContractor,
            created_by: user.id,
            version_number: currentVersion + 1,
            notes: 'Contractor details updated'
          };
          
          await supabase
            .from('contractor_history')
            .insert(historyEntry);
        } catch (historyError) {
          console.error('Error creating contractor history entry:', historyError);
          // We don't throw this error as it should not prevent the update operation
          console.warn('Contractor updated but history creation failed');
        }
      } else {
        console.log('contractor_history table does not exist yet, skipping history recording');
      }
    } catch (tableError) {
      console.error('Error checking for contractor_history table:', tableError);
      console.warn('Continuing with contractor update despite history table check failure');
    }
    
    return updatedContractor as ContractorRecord;
  },
  
  // Delete a contractor
  async deleteContractor(id: string): Promise<void> {
    try {
      // Check if contractor_history table exists
      const { data: tableInfo } = await supabase
        .rpc('get_table_definition', { table_name: 'contractor_history' });
      
      const tableExists = tableInfo && tableInfo.length > 0;
      
      // Delete any history entries first if the table exists
      if (tableExists) {
        try {
          await supabase
            .from('contractor_history')
            .delete()
            .eq('contractor_id', id);
        } catch (historyError) {
          console.error(`Error deleting history entries for contractor with ID ${id}:`, historyError);
          // We continue with the deletion of the contractor even if history deletion fails
        }
      }
    } catch (tableError) {
      console.warn('Error checking for contractor_history table, continuing with contractor deletion:', tableError);
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
