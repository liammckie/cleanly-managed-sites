
import { ContractData } from '@/types/contracts';
import { asJsonObject } from '@/lib/utils/json';

/**
 * Adapts a raw site record into a contract data object
 */
export function adaptContract(siteRecord: any): ContractData {
  // Ensure contract_details is properly handled as an object
  const contractDetails = asJsonObject(siteRecord.contract_details, {});

  return {
    id: siteRecord.id,
    site_id: siteRecord.site_id || siteRecord.id,
    site_name: siteRecord.site_name || siteRecord.name,
    client_id: siteRecord.client_id,
    client_name: siteRecord.client_name,
    monthly_revenue: Number(siteRecord.monthly_revenue) || 0,
    contract_details: contractDetails,
    status: siteRecord.status,
    is_primary: siteRecord.is_primary === true
  };
}

/**
 * Adapts an array of site records into contract data objects
 */
export function adaptContracts(siteRecords: any[]): ContractData[] {
  return siteRecords.map(adaptContract);
}
