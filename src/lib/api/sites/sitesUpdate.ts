
// Let's fix the property names to match the correct interfaces
import { supabase } from '@/integrations/supabase/client';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteRecord } from '@/lib/types';
import { toast } from 'sonner';

// Update an existing site
export const updateSite = async (siteId: string, formData: Partial<SiteFormData>): Promise<SiteRecord> => {
  try {
    console.log("Updating site:", siteId, formData);
    
    // Format the data for database update
    const updateData: any = {
      name: formData.name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postcode: formData.postalCode, // Field name mapping
      country: formData.country,
      status: formData.status,
      email: formData.email,
      phone: formData.phone,
      representative: formData.representative,
      custom_id: formData.customId, // Field name mapping
    };
    
    // Only include client_id if provided and not empty
    if (formData.client_id) {
      updateData.client_id = formData.client_id;
    }
    
    // Process JSON data
    if (formData.contract_details) {
      updateData.contract_details = formData.contract_details;
    }
    
    if (formData.billingDetails) {
      updateData.billing_details = {
        ...formData.billingDetails,
        // If there are billing lines, include them
        billingLines: formData.billingDetails.billingLines || []
      };
    }
    
    if (formData.jobSpecifications) {
      updateData.job_specifications = formData.jobSpecifications;
    }
    
    if (formData.subcontractors && formData.subcontractors.length > 0) {
      updateData.has_subcontractors = true;
      // Convert field names to snake_case for database consistency
      updateData.subcontractors = formData.subcontractors.map(sub => ({
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
      updateData.has_subcontractors = false;
      updateData.subcontractors = [];
    }
    
    if (formData.replenishables) {
      updateData.replenishables = formData.replenishables;
    }
    
    if (formData.periodicals) {
      updateData.periodicals = formData.periodicals;
    }
    
    if (formData.securityDetails) {
      updateData.security_details = formData.securityDetails;
    }
    
    // Update billing metrics if provided
    if (formData.monthlyRevenue !== undefined) {
      updateData.monthly_revenue = formData.monthlyRevenue;
    }
    
    if (formData.weeklyRevenue !== undefined) {
      updateData.weekly_revenue = formData.weeklyRevenue;
    }
    
    if (formData.annualRevenue !== undefined) {
      updateData.annual_revenue = formData.annualRevenue;
    }
    
    // Process contacts
    if (formData.contacts && formData.contacts.length > 0) {
      // Split into primary and non-primary contacts for easier management
      const primaryContact = formData.contacts.find(c => c.isPrimary);
      
      if (primaryContact) {
        updateData.primary_contact = {
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
    
    // Update the site in the database
    const { data, error } = await supabase
      .from('sites')
      .update(updateData)
      .eq('id', siteId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating site:', error);
      throw error;
    }
    
    console.log("Site updated successfully:", data);
    return data as SiteRecord;
  } catch (error) {
    console.error('Error in updateSite:', error);
    toast.error('Failed to update site');
    throw error;
  }
};

// Export a named object for compatibility
export const sitesUpdate = {
  updateSite
};
