
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { prepareSiteForDb } from '@/lib/types/adapters/siteAdapter';
import type { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export function useSiteCreate() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSite = async (siteData: SiteFormData) => {
    try {
      setIsSubmitting(true);
      
      // Use the adapter to prepare the site data for the database
      const dbReadySiteData = prepareSiteForDb(siteData);
      
      // Make sure we have a valid client_id
      if (!dbReadySiteData.client_id) {
        throw new Error('Client ID is required');
      }
      
      const { data, error } = await supabase
        .from('sites')
        .insert(dbReadySiteData)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // If there are contacts, insert them associated with the new site
      if (siteData.contacts && siteData.contacts.length > 0) {
        const contactsToInsert = siteData.contacts.map(contact => ({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          role: contact.role,
          is_primary: contact.isPrimary || false,
          department: contact.department,
          notes: contact.notes,
          entity_id: data.id,
          entity_type: 'site'
        }));
        
        const { error: contactsError } = await supabase
          .from('contacts')
          .insert(contactsToInsert);
          
        if (contactsError) {
          console.error('Error inserting contacts:', contactsError);
          // Don't throw here, just log the error as we already created the site
        }
      }
      
      toast.success('Site created successfully');
      return data;
    } catch (error: any) {
      toast.error(`Failed to create site: ${error.message}`);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createSite, isSubmitting };
}
