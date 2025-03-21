
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
      business_name: sub.businessName,
      contact_name: sub.contactName,
      email: sub.email,
      phone: sub.phone,
      user_id: userId,
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
