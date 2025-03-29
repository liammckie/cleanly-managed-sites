
import { supabase } from '@/lib/supabase';
import { ImportOptions, ImportResult } from './types';
import { validateContractorData } from './validation/contractorValidation';

/**
 * Process contractor import data
 * @param data Array of contractor data objects to import
 * @param options Import options
 * @returns Import result
 */
export async function processContractorImport(data: any[], options: ImportOptions = {}): Promise<ImportResult> {
  console.log('Processing contractor import', { data, options });
  
  try {
    // Validate contractor data
    if (!options.skipValidation) {
      const validationResult = await validateContractorData(data);
      if (!validationResult.valid) {
        return {
          success: false,
          message: 'Validation failed',
          count: 0,
          failures: validationResult.errors
        };
      }
      
      // Use validated data
      data = validationResult.validData || data;
    }
    
    // Insert or update contractors
    let result;
    if (options.updateExisting) {
      // Update existing contractors based on custom field (e.g., business_name or abn)
      // This would require individual updates for each contractor
      // Simplified for now
      result = { count: 0, data: [] };
      for (const contractor of data) {
        if (contractor.abn) {
          const { data: existingContractor } = await supabase
            .from('contractors')
            .select('id')
            .eq('abn', contractor.abn)
            .maybeSingle();
            
          if (existingContractor) {
            const { data: updatedContractor, error } = await supabase
              .from('contractors')
              .update(contractor)
              .eq('id', existingContractor.id)
              .select();
              
            if (!error && updatedContractor) {
              result.count++;
              result.data?.push(updatedContractor[0]);
            }
          } else {
            const { data: newContractor, error } = await supabase
              .from('contractors')
              .insert(contractor)
              .select();
              
            if (!error && newContractor) {
              result.count++;
              result.data?.push(newContractor[0]);
            }
          }
        } else {
          const { data: newContractor, error } = await supabase
            .from('contractors')
            .insert(contractor)
            .select();
            
          if (!error && newContractor) {
            result.count++;
            result.data?.push(newContractor[0]);
          }
        }
      }
    } else {
      // Insert new contractors
      const { data: insertedData, error } = await supabase
        .from('contractors')
        .insert(data)
        .select();
        
      if (error) throw error;
      
      result = {
        count: insertedData?.length || 0,
        data: insertedData
      };
    }
    
    return {
      success: true,
      message: `Successfully imported ${result.count} contractors`,
      count: result.count,
      data: result.data
    };
  } catch (error: any) {
    console.error('Error importing contractors:', error);
    
    return {
      success: false,
      message: `Import failed: ${error.message}`,
      count: 0,
      failures: [error]
    };
  }
}
