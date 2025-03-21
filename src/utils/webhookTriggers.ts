
import { useZapierIntegration } from '@/hooks/useZapierIntegration';
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { ClientFormData } from '@/components/clients/form/types';

// Initialize the Zapier integration hook
let zapierIntegration: ReturnType<typeof useZapierIntegration> | null = null;

// Initialize the integration
export const initWebhookTriggers = () => {
  if (!zapierIntegration) {
    zapierIntegration = useZapierIntegration();
  }
};

// Site webhooks
export const triggerSiteCreated = (site: SiteFormData) => {
  if (!zapierIntegration) return;
  
  zapierIntegration.triggerEvent('site.created', {
    site_id: site.id,
    site_name: site.name,
    site_address: site.address,
    site_city: site.city,
    site_state: site.state,
    site_status: site.status,
    event: 'site_created',
    timestamp: new Date().toISOString()
  });
};

export const triggerSiteUpdated = (site: SiteFormData) => {
  if (!zapierIntegration) return;
  
  zapierIntegration.triggerEvent('site.updated', {
    site_id: site.id,
    site_name: site.name,
    site_address: site.address,
    site_city: site.city,
    site_state: site.state,
    site_status: site.status,
    event: 'site_updated',
    timestamp: new Date().toISOString()
  });
};

// Client webhooks
export const triggerClientCreated = (client: ClientFormData) => {
  if (!zapierIntegration) return;
  
  zapierIntegration.triggerEvent('client.created', {
    client_name: client.name,
    client_email: client.email,
    client_status: client.status,
    event: 'client_created',
    timestamp: new Date().toISOString()
  });
};

export const triggerClientUpdated = (client: ClientFormData) => {
  if (!zapierIntegration) return;
  
  zapierIntegration.triggerEvent('client.updated', {
    client_name: client.name,
    client_email: client.email,
    client_status: client.status,
    event: 'client_updated',
    timestamp: new Date().toISOString()
  });
};
