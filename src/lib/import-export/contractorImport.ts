
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/utils/auth';
import { ContractorRecord } from './types';
import { validateContractors } from './validation/contractorValidation';

export const importContractors = async (contractorsData: any[]) => {
  try {
    // First validate the data
    const validationResult = await validateContractors(contractorsData);
    
    if (!validationResult.valid || !validationResult.data) {
      const errorMessages = validationResult.errors?.map(err => err.message) || ['Validation failed'];
      return {
        success: false,
        message: 'Validation errors: ' + errorMessages.join(', '),
        count: 0
      };
    }
    
    // Cast to the right type - this is safe because we validated the data
    const validContractors = validationResult.data as unknown as ContractorRecord[];
    
    // Get user ID for proper ownership of records
    const user = await getCurrentUser();
    const userId = user?.id;
    
    if (!userId) {
      return {
        success: false,
        message: 'User not authenticated',
        count: 0
      };
    }
    
    // Prepare contractors for insert
    const contractorsToInsert = validContractors.map(contractor => ({
      ...contractor,
      user_id: userId,
      status: contractor.status || 'active'
    }));
    
    // Insert contractors one by one to avoid issues
    const results = [];
    for (const contractor of contractorsToInsert) {
      const { data, error } = await supabase
        .from('contractors')
        .insert(contractor)
        .select();
      
      if (error) {
        console.error('Error inserting contractor:', error);
        return {
          success: false,
          message: `Error importing contractors: ${error.message}`,
          count: 0
        };
      }
      
      results.push(data);
    }
    
    // Return success result
    return {
      success: true,
      message: `Successfully imported ${contractorsToInsert.length} contractors`,
      count: contractorsToInsert.length,
      data: results
    };
  } catch (error) {
    console.error('Error in importContractors:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      count: 0
    };
  }
};
