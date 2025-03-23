
import { supabase } from '@/integrations/supabase/client';
import { ContactRecord } from '../../types';

// Get contacts for a site
export async function getSiteContacts(siteId: string): Promise<ContactRecord[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('entity_id', siteId)
    .eq('entity_type', 'site')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching contacts for site ${siteId}:`, error);
    throw error;
  }
  
  return data as ContactRecord[] || [];
}

// Handle creating/updating site contacts
export async function handleSiteContacts(
  siteId: string, 
  contacts: Partial<ContactRecord>[], 
  userId: string | undefined
): Promise<void> {
  // First, delete existing contacts for this site
  await supabase
    .from('contacts')
    .delete()
    .eq('entity_id', siteId)
    .eq('entity_type', 'site');
  
  // Then insert the new ones if there are any
  if (contacts.length > 0) {
    const contactRecords = contacts.map(contact => ({
      name: contact.name || '',
      role: contact.role || '',
      department: contact.department || null,
      email: contact.email || null,
      phone: contact.phone || null,
      is_primary: contact.is_primary || false,
      notes: contact.notes || null,
      entity_id: siteId,
      entity_type: 'site',
      user_id: userId
    }));
    
    const { error: contactError } = await supabase
      .from('contacts')
      .insert(contactRecords);
    
    if (contactError) {
      console.error('Error handling site contacts:', contactError);
      // We won't throw here to avoid rolling back other operations
    }
  }
}
