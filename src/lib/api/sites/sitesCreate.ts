
import { supabase } from '@/lib/supabase';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

// Create a new site
export const createSite = async (formData: SiteFormData) => {
  try {
    // Create the site record first
    const { data: siteData, error: siteError } = await supabase
      .from('sites')
      .insert([
        {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.postalCode || formData.postcode, // Support both field names
          client_id: formData.client_id || formData.clientId, // Support both field names
          status: formData.status,
          representative: formData.representative || '',
          email: formData.email,
          phone: formData.phone,
          contract_details: formData.contract_details || formData.contractDetails || {}, // Support both field names
          job_specifications: formData.jobSpecifications || {},
          billing_details: formData.billingDetails || {},
          security_details: formData.securityDetails || {},
          replenishables: formData.replenishables || {},
          periodicals: formData.periodicals || {},
          custom_id: formData.customId || '',
          monthly_revenue: formData.monthlyRevenue || 0,
          monthly_cost: formData.monthlyCost || 0,
          weekly_revenue: formData.weeklyRevenue || 0,
          annual_revenue: formData.annualRevenue || 0,
          has_subcontractors: formData.hasSubcontractors || false,
          subcontractors: formData.subcontractors || [],
        },
      ])
      .select()
      .single();

    if (siteError) {
      throw siteError;
    }

    // Get the site ID
    const site_id = siteData.id;

    // Create contacts if any
    if (formData.contacts && formData.contacts.length > 0) {
      // Map contacts to include the site ID
      const contactsToCreate = formData.contacts.map((contact) => ({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        role: contact.role,
        is_primary: contact.isPrimary || false,
        department: contact.department || '',
        notes: contact.notes || '',
        entity_id: site_id,
        entity_type: 'site',
      }));

      // Insert the contacts
      const { error: contactsError } = await supabase
        .from('contacts')
        .insert(contactsToCreate);

      if (contactsError) {
        throw contactsError;
      }
    }

    // Create subcontractors if any
    if (formData.subcontractors && formData.subcontractors.length > 0) {
      const subcontractorsToCreate = formData.subcontractors.map((subcontractor) => ({
        ...subcontractor,
        site_id,
      }));

      const { error: subcontractorsError } = await supabase
        .from('subcontractors')
        .insert(subcontractorsToCreate);

      if (subcontractorsError) {
        throw subcontractorsError;
      }
    }

    // If we've got here, all operations succeeded
    return siteData;
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};
