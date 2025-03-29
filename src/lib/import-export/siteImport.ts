
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/utils/auth';
import { validateSites } from './validation/siteValidation';
import { checkExistingClients } from './validation/clientValidation';
import { toast } from 'sonner';

// Site import interface
interface SiteImportItem {
  name: string;
  client_id?: string;
  client_name?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  status?: string;
  email?: string;
  phone?: string;
  representative?: string;
  monthly_revenue?: number;
  custom_id?: string;
  notes?: string;
}

export const importSites = async (siteData: any[]) => {
  try {
    // First validate the data
    const validationResult = await validateSites(siteData);
    
    if (!validationResult.valid || !validationResult.data) {
      const errorMessages = validationResult.errors?.map(err => err.message) || ['Validation failed'];
      return {
        success: false,
        message: 'Validation errors: ' + errorMessages.join(', '),
        count: 0
      };
    }
    
    const validSites = validationResult.data as SiteImportItem[];
    
    // Check if clients exist for each site
    const clientIds = validSites
      .filter(site => site.client_id)
      .map(site => site.client_id as string);
      
    const clientNames = validSites
      .filter(site => !site.client_id && site.client_name)
      .map(site => site.client_name as string);
    
    const existingClientsById = await checkExistingClients(clientIds, []);
    
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
    
    // Prepare sites for insert
    const sitesToInsert = validSites.map(site => ({
      user_id: userId,
      name: site.name,
      client_id: site.client_id,
      address: site.address,
      city: site.city,
      state: site.state,
      postcode: site.postcode,
      status: site.status || 'active',
      email: site.email,
      phone: site.phone,
      representative: site.representative,
      monthly_revenue: site.monthly_revenue,
      custom_id: site.custom_id,
      notes: site.notes
    }));
    
    // Insert sites
    const { data, error } = await supabase
      .from('sites')
      .insert(sitesToInsert);
    
    if (error) {
      console.error('Error inserting sites:', error);
      return {
        success: false,
        message: `Error importing sites: ${error.message}`,
        count: 0
      };
    }
    
    // Return success result
    return {
      success: true,
      message: `Successfully imported ${sitesToInsert.length} sites`,
      count: sitesToInsert.length,
      data: data
    };
  } catch (error) {
    console.error('Error in importSites:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      count: 0
    };
  }
};
