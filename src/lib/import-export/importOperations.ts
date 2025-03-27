
import { toast } from 'sonner';

export const setupTestData = () => {
  const createTestClients = async () => {
    // Create test clients
    console.log('Creating test clients...');
    return Promise.resolve();
  };

  const createTestSites = async () => {
    // Create test sites
    console.log('Creating test sites...');
    return Promise.resolve();
  };

  const createTestContracts = async () => {
    // Create test contracts
    console.log('Creating test contracts...');
    return Promise.resolve();
  };

  return {
    createTestClients,
    createTestSites,
    createTestContracts
  };
};
