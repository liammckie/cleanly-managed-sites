
import { supabase } from '@/lib/supabase';
import { ContractorRecord } from './types';
import { validateContractorData } from './validation';

export const importContractors = async (contractors: any[]): Promise<void> => {
  try {
    console.log(`Starting contractor import with ${contractors.length} records`);
    
    // Validate contractor data
    const validationResult = validateContractorData(contractors);
    
    if (!validationResult.isValid) {
      console.error('Contractor validation errors:', validationResult.errors);
      throw new Error(`Contractor validation failed with ${validationResult.errors.length} errors`);
    }
    
    if (validationResult.warnings.length > 0) {
      console.warn('Contractor validation warnings:', validationResult.warnings);
    }
    
    const validContractors = validationResult.data as ContractorRecord[];
    console.log(`Validated ${validContractors.length} contractors`);
    
    // Process each contractor
    for (const contractor of validContractors) {
      const { action = 'create', id, ...contractorData } = contractor as any;
      
      if (action === 'delete' && id) {
        // Delete existing contractor
        const { error: deleteError } = await supabase
          .from('contractors')
          .delete()
          .eq('id', id);
        
        if (deleteError) {
          console.error(`Error deleting contractor ${id}:`, deleteError);
          throw deleteError;
        }
        
        console.log(`Deleted contractor ${id}`);
      } else if (action === 'update' && id) {
        // Update existing contractor
        const { error: updateError } = await supabase
          .from('contractors')
          .update(contractorData)
          .eq('id', id);
        
        if (updateError) {
          console.error(`Error updating contractor ${id}:`, updateError);
          throw updateError;
        }
        
        console.log(`Updated contractor ${id}`);
      } else {
        // Create new contractor
        const { error: insertError } = await supabase
          .from('contractors')
          .insert(contractorData);
        
        if (insertError) {
          console.error('Error inserting contractor:', insertError);
          throw insertError;
        }
        
        console.log(`Created new contractor: ${contractorData.business_name}`);
      }
    }
    
    console.log('Contractor import completed successfully');
  } catch (error) {
    console.error('Error during contractor import:', error);
    throw error;
  }
};
