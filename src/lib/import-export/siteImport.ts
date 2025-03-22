
import { supabase } from '../supabase';
import { SiteRecord } from '../types';
import { validateSiteData } from './validation/siteValidation';
import { checkExistingItems } from './validation/commonValidation';

// Import sites
export const importSites = async (sites: Partial<SiteRecord>[]): Promise<void> => {
  // Validate site data
  const { isValid, errors, data: validData } = validateSiteData(sites);
  
  if (!isValid) {
    console.error('Invalid site data:', errors);
    throw new Error(`Invalid site data. Please check your import file. ${errors.map(e => e.message).join(', ')}`);
  }
  
  // Check for existing sites by ID to avoid duplicates
  const sitesWithIds = validData.filter(site => site.id);
  const existingIds = await checkExistingItems('sites', sitesWithIds.map(site => site.id as string));
  
  const sitesToInsert = validData.filter(site => !site.id || !existingIds.includes(site.id as string));
  const sitesToUpdate = validData.filter(site => site.id && existingIds.includes(site.id as string));
  
  // Insert new sites
  if (sitesToInsert.length > 0) {
    const { error: insertError } = await supabase
      .from('sites')
      .insert(sitesToInsert);
    
    if (insertError) {
      console.error('Error inserting sites:', insertError);
      throw new Error(`Failed to import sites: ${insertError.message}`);
    }
  }
  
  // Update existing sites
  for (const site of sitesToUpdate) {
    const { error: updateError } = await supabase
      .from('sites')
      .update(site)
      .eq('id', site.id);
    
    if (updateError) {
      console.error(`Error updating site ${site.id}:`, updateError);
    }
  }
};
