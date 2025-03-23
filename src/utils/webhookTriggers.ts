
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { ClientFormData } from '@/components/clients/form/types';

// Define a variable to hold the trigger functions
let zapierTriggers: {
  triggerEvent: (eventName: string, data: any) => void;
} | null = null;

// Set the triggers from a component
export const setZapierTriggers = (triggers: { 
  triggerEvent: (eventName: string, data: any) => void; 
}) => {
  zapierTriggers = triggers;
};

// Site webhooks
export const triggerSiteCreated = (site: SiteFormData) => {
  if (!zapierTriggers) return;
  
  zapierTriggers.triggerEvent('site.created', {
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
  if (!zapierTriggers) return;
  
  zapierTriggers.triggerEvent('site.updated', {
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
  if (!zapierTriggers) return;
  
  zapierTriggers.triggerEvent('client.created', {
    client_name: client.name,
    client_email: client.email,
    client_status: client.status,
    event: 'client_created',
    timestamp: new Date().toISOString()
  });
};

export const triggerClientUpdated = (client: ClientFormData) => {
  if (!zapierTriggers) return;
  
  zapierTriggers.triggerEvent('client.updated', {
    client_name: client.name,
    client_email: client.email,
    client_status: client.status,
    event: 'client_updated',
    timestamp: new Date().toISOString()
  });
};
