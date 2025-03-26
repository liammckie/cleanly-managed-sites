import { supabase } from '@/integrations/supabase/client';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteRecord } from '@/lib/types';
import { toast } from 'sonner';

// Create a new site
export const createSite = async (formData: SiteFormData): Promise<SiteRecord> => {
  try {
    console.log("Creating site:", formData);

    // Format the data for database insertion
    const insertData: any = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postcode: formData.postalCode, // Field name mapping
      country: formData.country,
      client_id: formData.client_id, // Field name mapping
      status: formData.status,
      email: formData.email,
      phone: formData.phone,
      representative: formData.representative,
      custom_id: formData.customId, // Field name mapping
    };

    // Process JSON data
    if (formData.contract_details) {
      insertData.contract_details = formData.contract_details;
    }

    if (formData.billingDetails) {
      insertData.billing_details = {
        ...formData.billingDetails,
        // If there are billing lines, include them
        billingLines: formData.billingDetails.billingLines || []
      };
    }

    if (formData.jobSpecifications) {
      insertData.job_specifications = formData.jobSpecifications;
    }

    if (formData.subcontractors && formData.hasSubcontractors) {
      insertData.has_subcontractors = true;
      // Convert field names to snake_case for database consistency
      insertData.subcontractors = formData.subcontractors.map(sub => ({
        id: sub.id,
        business_name: sub.business_name, // Use correct snake_case field name
        contact_name: sub.contact_name, // Use correct snake_case field name
        email: sub.email,
        phone: sub.phone,
        services: sub.services,
        is_flat_rate: sub.is_flat_rate, // Use correct snake_case field name
        monthly_cost: sub.monthly_cost, // Use correct snake_case field name
        notes: sub.notes
      }));
    } else {
      insertData.has_subcontractors = false;
      insertData.subcontractors = [];
    }

    if (formData.replenishables) {
      insertData.replenishables = formData.replenishables;
    }

    if (formData.periodicals) {
      insertData.periodicals = formData.periodicals;
    }

    if (formData.securityDetails) {
      insertData.security_details = formData.securityDetails;
    }

    // Set billing metrics if provided
    if (formData.monthlyRevenue !== undefined) {
      insertData.monthly_revenue = formData.monthlyRevenue;
    }

    if (formData.weeklyRevenue !== undefined) {
      insertData.weekly_revenue = formData.weeklyRevenue;
    }

    if (formData.annualRevenue !== undefined) {
      insertData.annual_revenue = formData.annualRevenue;
    }

    // Insert the site into the database
    const { data, error } = await supabase
      .from('sites')
      .insert([insertData])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating site:', error);
      throw error;
    }

    const siteId = data.id;

    // Process contacts
    if (formData.contacts && formData.contacts.length > 0) {
      // Split into primary and non-primary contacts for easier management
      const primaryContact = formData.contacts.find(c => c.isPrimary);

      if (primaryContact) {
        insertData.primary_contact = {
          name: primaryContact.name,
          email: primaryContact.email,
          phone: primaryContact.phone,
          role: primaryContact.role
        };
      }

      // Update contacts in the contacts table if needed
      // This would require separate API calls to the contacts endpoint
      // For each contact, check if it exists and update or create accordingly
      for (const contact of formData.contacts) {
        // Here we would call the contacts API to create/update contacts
        console.log("Contact to update:", {
          ...contact,
          entity_id: siteId,
          entity_type: "site",
          is_primary: contact.isPrimary // Fixed property name
        });
      }
    }

    console.log("Site created successfully:", data);
    return data as SiteRecord;
  } catch (error) {
    console.error('Error in createSite:', error);
    toast.error('Failed to create site');
    throw error;
  }
};

const handleSiteContacts = async (siteId: string, contacts: any[]) => {
  if (!contacts || contacts.length === 0) {
    return;
  }

  try {
    // Prepare contacts for insertion
    const contactsToInsert = contacts.map(contact => ({
      ...contact,
      entity_id: siteId,
      entity_type: 'site',
      is_primary: contact.isPrimary || false // Ensure is_primary is always set
    }));

    // Insert contacts into the contacts table
    const { error: contactsError } = await supabase
      .from('contacts')
      .insert(contactsToInsert);

    if (contactsError) {
      console.error('Error creating site contacts:', contactsError);
      throw contactsError;
    } else {
      console.log('Site contacts created successfully.');
    }
  } catch (error) {
    console.error('Error in handleSiteContacts:', error);
    throw error;
  }
};

// Export a named object for compatibility
export const sitesCreate = {
  createSite
};
