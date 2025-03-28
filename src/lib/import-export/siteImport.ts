
import { supabase } from '../supabase';
import { SiteRecord } from '../types';
import { validateSiteData } from './validation/siteValidation';
import { checkExistingItems } from './validation/commonValidation';

// Import sites
export const importSites = async (sites: Partial<SiteRecord>[]): Promise<{
  success: boolean;
  count: number;
  errors?: any[];
}> => {
  try {
    // Validate site data
    const validationResult = validateSiteData(sites);
    
    if (!validationResult.valid) {
      console.error('Invalid site data:', validationResult.errors);
      return {
        success: false,
        count: 0,
        errors: validationResult.errors
      };
    }
    
    const validData = validationResult.data || [];
    
    // Check for existing sites by ID to avoid duplicates
    const sitesWithIds = validData.filter(site => site.id);
    const existingIds = sitesWithIds.length > 0 ? 
      await checkExistingItems('sites', sitesWithIds.map(site => site.id!)) : 
      [];
    
    const sitesToInsert = validData.filter(site => !site.id || !existingIds.includes(site.id!));
    const sitesToUpdate = validData.filter(site => site.id && existingIds.includes(site.id!));
    
    let insertCount = 0;
    let updateCount = 0;
    
    // Insert new sites
    if (sitesToInsert.length > 0) {
      // Add user_id to each site
      const sitesWithUserId = sitesToInsert.map(site => ({
        ...site,
        user_id: supabase.auth.getUser().then(res => res.data.user?.id) || null
      }));
      
      const { data, error: insertError } = await supabase
        .from('sites')
        .insert(sitesWithUserId)
        .select();
      
      if (insertError) {
        console.error('Error inserting sites:', insertError);
        return {
          success: false,
          count: 0,
          errors: [{ message: insertError.message }]
        };
      }
      
      insertCount = data?.length || 0;
    }
    
    // Update existing sites
    for (const site of sitesToUpdate) {
      const { error: updateError } = await supabase
        .from('sites')
        .update(site)
        .eq('id', site.id!);
      
      if (updateError) {
        console.error(`Error updating site ${site.id}:`, updateError);
      } else {
        updateCount++;
      }
    }
    
    return {
      success: true,
      count: insertCount + updateCount
    };
  } catch (error) {
    console.error('Error importing sites:', error);
    return {
      success: false,
      count: 0,
      errors: [{ message: (error as Error).message }]
    };
  }
};
