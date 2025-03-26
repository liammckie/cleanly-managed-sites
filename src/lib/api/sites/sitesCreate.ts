
import { supabase } from '@/integrations/supabase/client';
import { SiteRecord } from '@/lib/types';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { handleSiteAdditionalContracts } from './additionalContractsApi';
import { handleSiteBillingLines } from './billingLinesApi';
import { handleSiteContacts } from './siteContactsApi';

// Site creation API functions
export const sitesCreate = {
  // Create a new site
  async createSite(siteData: SiteFormData): Promise<SiteRecord> {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Prepare the site data for insertion
    const siteRecord = {
      name: siteData.name,
      address: siteData.address,
      city: siteData.city,
      state: siteData.state,
      postcode: siteData.postcode,
      status: siteData.status,
      representative: siteData.representative,
      phone: siteData.phone,
      email: siteData.email,
      user_id: user.id,
      client_id: siteData.clientId,
      monthly_cost: siteData.monthlyCost,
      monthly_revenue: siteData.monthlyRevenue,
      weekly_revenue: siteData.weeklyRevenue,
      annual_revenue: siteData.annualRevenue,
      // Store the detailed data as JSON
      security_details: JSON.stringify(siteData.securityDetails) as any,
      job_specifications: JSON.stringify(siteData.jobSpecifications) as any,
      periodicals: JSON.stringify(siteData.periodicals) as any,
      replenishables: JSON.stringify(siteData.replenishables) as any,
      contract_details: JSON.stringify(siteData.contractDetails) as any,
      billing_details: JSON.stringify(siteData.billingDetails) as any,
      // If there are subcontractors, store them
      has_subcontractors: siteData.subcontractors.length > 0,
    };
    
    const { data, error } = await supabase
      .from('sites')
      .insert(siteRecord)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating site:', error);
      throw error;
    }
    
    // If there are subcontractors, store them separately
    if (siteData.subcontractors.length > 0) {
      const subcontractorRecords = siteData.subcontractors.map(sub => ({
        site_id: data.id,
        business_name: sub.business_name,
        contact_name: sub.contact_name,
        email: sub.email,
        phone: sub.phone,
        user_id: user.id,
      }));
      
      const { error: subError } = await supabase
        .from('subcontractors')
        .insert(subcontractorRecords);
      
      if (subError) {
        console.error('Error inserting subcontractors:', subError);
      }
    }
    
    // Handle contacts if they exist
    if (siteData.contacts && siteData.contacts.length > 0) {
      try {
        await handleSiteContacts(data.id, siteData.contacts, user.id);
      } catch (contactError) {
        console.error('Error handling site contacts:', contactError);
      }
    }
    
    // Handle additional contracts if they exist
    if (siteData.additionalContracts && siteData.additionalContracts.length > 0) {
      try {
        await handleSiteAdditionalContracts(data.id, siteData.additionalContracts, user.id);
      } catch (contractError) {
        console.error('Error handling additional contracts:', contractError);
      }
    }
    
    // Handle billing lines if they exist
    if (siteData.billingDetails && 
        siteData.billingDetails.billingLines && 
        siteData.billingDetails.billingLines.length > 0) {
      try {
        await handleSiteBillingLines(data.id, siteData.billingDetails.billingLines);
      } catch (billingError) {
        console.error('Error handling billing lines:', billingError);
      }
    }
    
    // Create a result that includes the contacts
    const result = {
      ...data,
      contacts: siteData.contacts || []
    } as SiteRecord;
    
    return result;
  }
};
