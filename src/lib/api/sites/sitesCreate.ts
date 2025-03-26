
import { supabase } from '@/lib/supabase';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { SiteStatus } from '@/types/common';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

// Export the sitesCreate object with the createSite function
export const sitesCreate = {
  async createSite(formData: SiteFormData) {
    try {
      console.log("Creating site with data:", formData);
      
      // Only include client_id if provided
      const clientId = formData.client_id || null;
      
      // Format the data for database insert
      const insertData: any = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postcode: formData.postalCode, // Field name mapping
        country: formData.country,
        status: formData.status || 'active',
        email: formData.email,
        phone: formData.phone,
        representative: formData.representative,
        custom_id: formData.customId, // Field name mapping
        client_id: clientId
      };
      
      // Process client name if client_id is provided
      if (clientId) {
        // Fetch client name
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('name')
          .eq('id', clientId)
          .single();
        
        if (clientError) {
          console.warn('Error fetching client name:', clientError);
        } else if (clientData) {
          insertData.client_name = clientData.name;
        }
      }
      
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
      
      if (formData.subcontractors && formData.subcontractors.length > 0) {
        insertData.has_subcontractors = true;
        // Convert field names to snake_case for database consistency
        insertData.subcontractors = formData.subcontractors.map(sub => ({
          id: sub.id,
          business_name: sub.name, // Field name mapping
          contact_name: sub.contact_name, // Field name mapping
          email: sub.email,
          phone: sub.phone,
          services: sub.services,
          is_flat_rate: sub.isFlatRate, // Field name mapping
          monthly_cost: sub.monthlyCost, // Field name mapping
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
      
      // Add billing metrics if provided
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
        .insert(insertData)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating site:', error);
        throw error;
      }
      
      const createdSite = data;
      
      // Process contacts if provided
      if (formData.contacts && formData.contacts.length > 0) {
        // Create contacts in the contacts table
        for (const contact of formData.contacts) {
          await supabase
            .from('contacts')
            .insert([{
              entity_id: createdSite.id,
              entity_type: "site",
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              role: contact.role,
              department: contact.department,
              notes: contact.notes,
              is_primary: contact.isPrimary // Fixed property name
            }]);
        }
      }
      
      console.log("Site created successfully:", createdSite);
      return createdSite;
    } catch (error) {
      console.error('Error in createSite:', error);
      throw error;
    }
  }
};
