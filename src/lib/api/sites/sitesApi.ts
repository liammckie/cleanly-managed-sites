import { supabase } from '@/integrations/supabase/client';
import { SiteRecord, ContactRecord } from '../../types';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { getSiteContacts, handleSiteContacts } from './siteContactsApi';
import { handleSiteSubcontractors } from './siteSubcontractorsApi';
import { contractHistoryApi } from './contractHistoryApi';
import { convertSiteContactToContactRecord } from '@/components/sites/forms/types/contactTypes';

export const sitesApi = {
  async getSites(): Promise<SiteRecord[]> {
    const { data: sites, error } = await supabase
      .from('sites')
      .select('*, clients(name, contact_name)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sites:', error);
      throw error;
    }
    
    const transformedSites = sites.map(site => {
      const clientData = site.clients as { name: string } | null;
      return {
        ...site,
        client_name: clientData?.name || null,
        clients: undefined,
        contacts: []
      };
    });
    
    return transformedSites as SiteRecord[];
  },
  
  async getSiteById(id: string): Promise<SiteRecord | null> {
    const { data, error } = await supabase
      .from('sites')
      .select('*, clients(name, contact_name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching site with ID ${id}:`, error);
      throw error;
    }
    
    if (data) {
      const clientData = data.clients as { name: string } | null;
      const transformedData = {
        ...data,
        client_name: clientData?.name || null,
        clients: undefined,
        contacts: []
      };
      
      try {
        const siteContacts = await getSiteContacts(id);
        transformedData.contacts = siteContacts;
      } catch (contactError) {
        console.error(`Error fetching contacts for site ${id}:`, contactError);
      }
      
      return transformedData as SiteRecord;
    }
    
    return null;
  },
  
  async createSite(siteData: SiteFormData): Promise<SiteRecord> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
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
      custom_id: siteData.customId && siteData.customId.trim() !== '' ? siteData.customId : null,
      security_details: JSON.stringify(siteData.securityDetails) as any,
      job_specifications: JSON.stringify(siteData.jobSpecifications) as any,
      periodicals: JSON.stringify(siteData.periodicals) as any,
      replenishables: JSON.stringify(siteData.replenishables) as any,
      contract_details: JSON.stringify(siteData.contractDetails) as any,
      billing_details: JSON.stringify(siteData.billingDetails) as any,
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
    
    if (siteData.subcontractors.length > 0) {
      await handleSiteSubcontractors(data.id, siteData.subcontractors, user.id);
    }
    
    if (siteData.contacts && siteData.contacts.length > 0) {
      const contactRecords = siteData.contacts.map(contact => 
        convertSiteContactToContactRecord(contact, data.id));
      await handleSiteContacts(data.id, contactRecords, user.id);
    }
    
    if (siteData.additionalContracts && siteData.additionalContracts.length > 0) {
      await handleSiteAdditionalContracts(data.id, siteData.additionalContracts, user.id);
    }
    
    if (siteData.billingDetails && siteData.billingDetails.billingLines && 
        siteData.billingDetails.billingLines.length > 0) {
      await handleSiteBillingLines(data.id, siteData.billingDetails.billingLines);
    }
    
    const result = {
      ...data,
      contacts: siteData.contacts || []
    } as unknown as SiteRecord;
    
    return result;
  },
  
  async updateSite(id: string, siteData: Partial<SiteFormData>): Promise<SiteRecord> {
    if (siteData.contractDetails) {
      try {
        await contractHistoryApi.saveContractVersion(
          id, 
          siteData.contractDetails,
          'Updated via site form'
        );
      } catch (error) {
        console.error('Error saving contract history:', error);
      }
    }
    
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
      weekly_revenue: siteData.weeklyRevenue,
      annual_revenue: siteData.annualRevenue,
      custom_id: siteData.customId && siteData.customId.trim() !== '' ? siteData.customId : null,
    };

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
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (siteData.subcontractors) {
      await handleSiteSubcontractors(id, siteData.subcontractors, user?.id);
    }
    
    if (siteData.contacts) {
      const contactRecords = siteData.contacts.map(contact => 
        convertSiteContactToContactRecord(contact, id));
      await handleSiteContacts(id, contactRecords, user?.id);
    }
    
    if (siteData.additionalContracts) {
      await handleSiteAdditionalContracts(id, siteData.additionalContracts, user?.id);
    }
    
    if (siteData.billingDetails && siteData.billingDetails.billingLines) {
      await handleSiteBillingLines(id, siteData.billingDetails.billingLines);
    }
    
    let contacts = [];
    try {
      contacts = await getSiteContacts(id);
    } catch (contactError) {
      console.error(`Error fetching contacts for site ${id}:`, contactError);
    }
    
    const result = {
      ...data,
      contacts: contacts || []
    } as unknown as SiteRecord;
    
    return result;
  },
  
  async deleteSite(id: string): Promise<void> {
    await supabase
      .from('contacts')
      .delete()
      .eq('entity_id', id)
      .eq('entity_type', 'site');
    
    await supabase
      .from('subcontractors')
      .delete()
      .eq('site_id', id);
    
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting site with ID ${id}:`, error);
      throw error;
    }
  }
};
