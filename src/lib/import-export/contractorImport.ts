
import { supabase } from '@/lib/supabase';
import { validateContractorImport } from './validation/contractorValidation';
import { v4 as uuidv4 } from 'uuid';

// Define the ContractorRecord interface to match table schema
interface ContractorImportRecord {
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  contractor_type: string;
  status?: string;
  abn?: string;
  hourly_rate?: number;
  day_rate?: number;
  notes?: string;
  specialty?: string[];
}

export async function importContractors(contractors: ContractorImportRecord[]) {
  try {
    if (!contractors.length) {
      return { success: false, message: 'No contractors to import', count: 0 };
    }

    // Validate the contractors
    const validationResult = validateContractorImport(contractors);
    if (!validationResult.success) {
      return { 
        success: false, 
        message: 'Validation failed', 
        errors: validationResult.errors,
        count: 0 
      };
    }

    // Get the current user
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    if (!userId) {
      return { success: false, message: 'User not authenticated', count: 0 };
    }

    // Insert each contractor with userId
    for (const contractor of contractors) {
      const { error } = await supabase
        .from('contractors')
        .insert({
          ...contractor,
          id: uuidv4(),
          user_id: userId, 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error importing contractor:', error);
        throw error;
      }
    }

    return { 
      success: true, 
      message: `Successfully imported ${contractors.length} contractors`, 
      count: contractors.length 
    };
  } catch (error) {
    console.error('Contractor import failed:', error);
    return { 
      success: false, 
      message: `Contractor import failed: ${error instanceof Error ? error.message : String(error)}`, 
      count: 0 
    };
  }
}
