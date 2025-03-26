
import { supabase } from '@/integrations/supabase/client';
import { Subcontractor } from '@/components/sites/forms/types/subcontractorTypes';

// Handle creating/updating site subcontractors
export async function handleSiteSubcontractors(
  siteId: string, 
  subcontractors: Subcontractor[], 
  userId: string | undefined
): Promise<void> {
  // First, delete existing subcontractors for this site
  await supabase
    .from('subcontractors')
    .delete()
    .eq('site_id', siteId);
  
  // Then insert the new ones if there are any
  if (subcontractors.length > 0) {
    const subcontractorRecords = subcontractors.map(sub => ({
      site_id: siteId,
      business_name: sub.business_name,
      contact_name: sub.contact_name,
      email: sub.email,
      phone: sub.phone,
      user_id: userId,
      // Add the new fields as JSON since they're not native columns
      services: sub.services || [],
      custom_services: sub.customServices || null,
      monthly_cost: sub.monthly_cost || null,
      is_flat_rate: sub.is_flat_rate !== undefined ? sub.is_flat_rate : true
    }));
    
    const { error: subError } = await supabase
      .from('subcontractors')
      .insert(subcontractorRecords);
    
    if (subError) {
      console.error('Error handling site subcontractors:', subError);
      // We won't throw here to avoid rolling back other operations
    }
  }
}
