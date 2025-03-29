
import { supabase } from '@/lib/supabase';
import { SiteRecord } from '@/lib/types/sites';
import { ImportOptions, ImportResult } from './types';
import { validateSiteData } from './validation/siteValidation';
import { recordExistsByField } from './validation/commonValidation';

/**
 * Process site import data
 * @param data Array of site data objects to import
 * @param options Import options
 * @returns Import result
 */
export async function processSiteImport(data: any[], options: ImportOptions = {}): Promise<ImportResult> {
  console.log('Processing site import', { data, options });
  
  try {
    // Validate site data
    if (!options.skipValidation) {
      const validationResult = await validateSiteData(data);
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
    
    // Check for existing sites by custom_id if not skipping
    if (!options.skipExistingCheck) {
      for (const site of data) {
        if (site.custom_id) {
          const exists = await recordExistsByField('sites', 'custom_id', site.custom_id);
          if (exists && !options.updateExisting) {
            return {
              success: false,
              message: `Site with custom ID ${site.custom_id} already exists`,
              count: 0,
              failures: [{
                field: 'custom_id',
                message: `Site with custom ID ${site.custom_id} already exists`,
                value: site.custom_id
              }]
            };
          }
        }
      }
    }
    
    // Insert or update sites
    let result;
    if (options.updateExisting) {
      // Update existing sites based on custom_id
      // This would require individual updates for each site
      // Simplified for now
      result = { count: 0, data: [] };
      for (const site of data) {
        if (site.custom_id) {
          const { data: existingSite } = await supabase
            .from('sites')
            .select('id')
            .eq('custom_id', site.custom_id)
            .maybeSingle();
            
          if (existingSite) {
            const { data: updatedSite, error } = await supabase
              .from('sites')
              .update(site)
              .eq('id', existingSite.id)
              .select();
              
            if (!error && updatedSite) {
              result.count++;
              result.data?.push(updatedSite[0]);
            }
          } else {
            const { data: newSite, error } = await supabase
              .from('sites')
              .insert(site)
              .select();
              
            if (!error && newSite) {
              result.count++;
              result.data?.push(newSite[0]);
            }
          }
        } else {
          const { data: newSite, error } = await supabase
            .from('sites')
            .insert(site)
            .select();
            
          if (!error && newSite) {
            result.count++;
            result.data?.push(newSite[0]);
          }
        }
      }
    } else {
      // Insert new sites
      const { data: insertedData, error } = await supabase
        .from('sites')
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
      message: `Successfully imported ${result.count} sites`,
      count: result.count,
      data: result.data
    };
  } catch (error: any) {
    console.error('Error importing sites:', error);
    
    return {
      success: false,
      message: `Import failed: ${error.message}`,
      count: 0,
      failures: [error]
    };
  }
}
