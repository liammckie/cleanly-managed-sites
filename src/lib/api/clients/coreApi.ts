
import { clientCrudApi } from './clientCrud';
import { clientStatsApi } from './clientStats';

// Combine all client core APIs
export const clientCoreApi = {
  ...clientCrudApi,
  ...clientStatsApi
};
