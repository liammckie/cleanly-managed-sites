
import { supabase } from '@/lib/supabase';
import { ContractorRecord } from './types';
import { validateContractorData } from './validation/contractorValidation';

export const importContractors = async (contractors: any[]): Promise<{
  success: boolean;
  count: number;
  errors?: any[];
}> => {
  try {
    console.log(`Starting contractor import with ${contractors.length} records`);
    
    // Validate contractor data
    const validationResult = validateContractorData(contractors);
    
    if (!validationResult.valid) {
      console.error('Contractor validation errors:', validationResult.errors);
      return {
        success: false,
        count: 0,
        errors: validationResult.errors,
      };
    }
    
    if (validationResult.warnings && validationResult.warnings.length > 0) {
      console.warn('Contractor validation warnings:', validationResult.warnings);
    }
    
    const validContractors = validationResult.data || [];
    console.log(`Validated ${validContractors.length} contractors`);
    
    if (validContractors.length === 0) {
      return {
        success: true,
        count: 0
      };
    }
    
    // Insert contractors
    const { data, error } = await supabase
      .from('contractors')
      .insert(validContractors)
      .select();
    
    if (error) {
      console.error('Error inserting contractors:', error);
      return {
        success: false,
        count: 0,
        errors: [{ message: error.message }]
      };
    }
    
    console.log('Contractor import completed successfully');
    return {
      success: true,
      count: data?.length || validContractors.length
    };
  } catch (error) {
    console.error('Error during contractor import:', error);
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }]
    };
  }
};
