
import { toast } from 'sonner';
import { ClientRecord, SiteRecord } from './types';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

// Export operations
export const exportClients = async (clients: ClientRecord[]): Promise<void> => {
  try {
    const jsonString = JSON.stringify(clients, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clients_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${clients.length} clients exported successfully`);
  } catch (error) {
    console.error('Error exporting clients:', error);
    toast.error('Failed to export clients');
  }
};

export const exportSites = async (sites: SiteRecord[]): Promise<void> => {
  try {
    const jsonString = JSON.stringify(sites, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sites_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${sites.length} sites exported successfully`);
  } catch (error) {
    console.error('Error exporting sites:', error);
    toast.error('Failed to export sites');
  }
};

export const exportContracts = async (contracts: ContractHistoryEntry[]): Promise<void> => {
  try {
    const jsonString = JSON.stringify(contracts, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contracts_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${contracts.length} contracts exported successfully`);
  } catch (error) {
    console.error('Error exporting contracts:', error);
    toast.error('Failed to export contracts');
  }
};

// Import operations
export const importClients = async (clients: ClientRecord[]): Promise<void> => {
  try {
    // Here we would normally send the data to the server
    // For now we'll just simulate success
    console.log('Imported clients:', clients);
    toast.success(`${clients.length} clients imported successfully`);
  } catch (error) {
    console.error('Error importing clients:', error);
    toast.error('Failed to import clients');
  }
};

export const importSites = async (sites: SiteRecord[]): Promise<void> => {
  try {
    // Here we would normally send the data to the server
    // For now we'll just simulate success
    console.log('Imported sites:', sites);
    toast.success(`${sites.length} sites imported successfully`);
  } catch (error) {
    console.error('Error importing sites:', error);
    toast.error('Failed to import sites');
  }
};

export const importContracts = async (contracts: ContractHistoryEntry[]): Promise<void> => {
  try {
    // Here we would normally send the data to the server
    // For now we'll just simulate success
    console.log('Imported contracts:', contracts);
    toast.success(`${contracts.length} contracts imported successfully`);
  } catch (error) {
    console.error('Error importing contracts:', error);
    toast.error('Failed to import contracts');
  }
};
