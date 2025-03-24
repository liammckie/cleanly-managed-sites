
import { clientContactsApi } from './contactsApi';
import { clientCoreApi } from './coreApi';
import { clientSitesApi } from './sitesApi';
import { ClientRecord, ContactRecord, SiteRecord } from '../../types';

// Combine all client-related APIs into a single export
export const clientsApi = {
  ...clientCoreApi,
  ...clientContactsApi, 
  ...clientSitesApi
};

// Export types
export type { 
  ClientRecord,
  ContactRecord,
  SiteRecord 
};
