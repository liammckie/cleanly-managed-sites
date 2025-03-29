
import { supabase } from '@/lib/supabase';
import { validateSiteImport } from './validation/siteValidation';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Define the SiteImportItem interface
export interface SiteImportItem {
  name: string;
  client_id: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  status?: string;
  email?: string;
  phone?: string;
  representative?: string;
  monthly_revenue?: number;
  custom_id?: string;
  notes?: string;
}

export async function importSites(sites: SiteImportItem[]) {
  try {
    if (!sites.length) {
      return { success: false, message: 'No sites to import', count: 0 };
    }

    // Validate the sites
    const validationResult = validateSiteImport(sites);
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

    // Prepare sites for import with generated IDs for linking
    const preparedSites = sites.map(site => ({
      ...site,
      generatedId: uuidv4(),
      user_id: userId
    }));

    // Insert the sites
    const sitesToInsert = preparedSites.map(site => ({
      id: site.generatedId,
      name: site.name,
      client_id: site.client_id,
      address: site.address,
      city: site.city,
      state: site.state,
      postcode: site.postcode,
      status: site.status || 'active',
      email: site.email,
      phone: site.phone,
      representative: site.representative || '',
      monthly_revenue: site.monthly_revenue,
      custom_id: site.custom_id,
      notes: site.notes,
      user_id: userId
    }));

    // Insert in batches of 10 to avoid potential issues
    const batchSize = 10;
    for (let i = 0; i < sitesToInsert.length; i += batchSize) {
      const batch = sitesToInsert.slice(i, i + batchSize);
      const { error } = await supabase
        .from('sites')
        .insert(batch);
      
      if (error) {
        console.error('Error importing sites batch:', error);
        throw error;
      }
    }

    return { 
      success: true, 
      message: `Successfully imported ${sites.length} sites`, 
      count: sites.length,
      siteIds: preparedSites.map(site => site.generatedId)
    };
  } catch (error) {
    console.error('Site import failed:', error);
    return { 
      success: false, 
      message: `Site import failed: ${error instanceof Error ? error.message : String(error)}`, 
      count: 0 
    };
  }
}
