
import { supabase } from '@/integrations/supabase/client';
import { SiteRecord } from '@/lib/types';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { handleSiteAdditionalContracts } from './additionalContractsApi';
import { handleSiteBillingLines } from './billingLinesApi';

// Site update API functions
export const sitesUpdate = {
  // Update an existing site
  async updateSite(id: string, siteData: Partial<SiteFormData>): Promise<SiteRecord> {
    const updateData: any = {
      name: siteData.name,
      address: siteData.address,
      city: siteData.city,
      state: siteData.state,
      postcode: siteData.postcode,
      status: siteData.status,
      representative: siteData.representative,
      phone: siteData.phone,
      email: siteData.email,
      client_id: siteData.clientId,
      monthly_cost: siteData.monthlyCost,
      monthly_revenue: siteData.monthlyRevenue,
    };

    // Update the JSON fields if provided
    if (siteData.securityDetails) {
      updateData.security_details = JSON.stringify(siteData.securityDetails);
    }
    if (siteData.jobSpecifications) {
      updateData.job_specifications = JSON.stringify(siteData.jobSpecifications);
    }
    if (siteData.periodicals) {
      updateData.periodicals = JSON.stringify(siteData.periodicals);
    }
    if (siteData.replenishables) {
      updateData.replenishables = JSON.stringify(siteData.replenishables);
    }
    if (siteData.contractDetails) {
      updateData.contract_details = JSON.stringify(siteData.contractDetails);
    }
    if (siteData.billingDetails) {
      updateData.billing_details = JSON.stringify(siteData.billingDetails);
    }
    if (siteData.subcontractors) {
      updateData.has_subcontractors = siteData.subcontractors.length > 0;
    }
    
    const { data, error } = await supabase
      .from('sites')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating site with ID ${id}:`, error);
      throw error;
    }
    
    // If subcontractors were provided, update them as well
    if (siteData.subcontractors) {
      // First, delete existing subcontractors for this site
      await supabase
        .from('subcontractors')
        .delete()
        .eq('site_id', id);
      
      // Then insert the new ones if there are any
      if (siteData.subcontractors.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        
        const subcontractorRecords = siteData.subcontractors.map(sub => ({
          site_id: id,
          business_name: sub.businessName,
          contact_name: sub.contactName,
          email: sub.email,
          phone: sub.phone,
          user_id: user?.id,
        }));
        
        await supabase
          .from('subcontractors')
          .insert(subcontractorRecords);
      }
    }
    
    // If contacts were provided, update them as well
    if (siteData.contacts) {
      // First, delete existing contacts for this site
      await supabase
        .from('contacts')
        .delete()
        .eq('entity_id', id)
        .eq('entity_type', 'site');
      
      // Then insert the new ones
      const { data: { user } } = await supabase.auth.getUser();
      
      const contactRecords = siteData.contacts.map(contact => ({
        name: contact.name,
        role: contact.role,
        department: contact.department || null,
        email: contact.email || null,
        phone: contact.phone || null,
        is_primary: contact.is_primary || false,
        notes: contact.notes || null,
        entity_id: id,
        entity_type: 'site',
        user_id: user?.id
      }));
      
      const { error: contactError } = await supabase
        .from('contacts')
        .insert(contactRecords);
      
      if (contactError) {
        console.error('Error updating contacts:', contactError);
      }
    }
    
    // Fetch the contacts to include in the result
    const { data: contactsData } = await supabase
      .from('contacts')
      .select('*')
      .eq('entity_id', id)
      .eq('entity_type', 'site');
    
    // Create a result that includes the contacts
    const result = {
      ...data,
      contacts: contactsData || []
    } as SiteRecord;
    
    // Now handle additional contracts if they exist
    if (siteData.additionalContracts && siteData.additionalContracts.length > 0) {
      await handleSiteAdditionalContracts(id, siteData.additionalContracts, data.user_id);
    }
    
    // Handle billing lines if they exist
    if (siteData.billingDetails && siteData.billingDetails.billingLines && 
        siteData.billingDetails.billingLines.length > 0) {
      await handleSiteBillingLines(id, siteData.billingDetails.billingLines);
    }
    
    return result;
  }
};
