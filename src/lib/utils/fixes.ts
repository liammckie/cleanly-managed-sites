import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

// Function to fix the contract history data format
export function fixContractHistoryFormat(history: any[] = []): ContractHistoryEntry[] {
  // If no history, return empty array
  if (!history || !Array.isArray(history) || history.length === 0) {
    return [];
  }
  
  // Convert the DB format to the expected component format
  return history.map(entry => ({
    id: entry.id,
    siteId: entry.site_id,
    contractDetails: entry.contract_details,
    timestamp: entry.created_at,
    notes: entry.notes,
    created_by: entry.created_by,
    created_at: entry.created_at,
    version_number: entry.version_number,
    // Keep these for backward compatibility
    site_id: entry.site_id,
    contract_details: entry.contract_details,
    // Add additional properties needed by components
    date: entry.created_at,
    user: entry.created_by,
    changes: entry.contract_details
  }));
}
