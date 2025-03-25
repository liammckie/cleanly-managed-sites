
import { useQuery } from '@tanstack/react-query';
import { ContractData } from '@/lib/types/contracts';
import { sitesApi } from '@/lib/api/sites';
import { asJsonObject } from '@/lib/utils/json';

// Interface for grouped contracts data
export interface GroupedContracts {
  byStatus: Record<string, ContractData[]>;
  byClient: Record<string, ContractData[]>;
  byMonth: Record<string, ContractData[]>;
}

/**
 * Hook to fetch and manage contract data
 * @returns Contract data and loading state
 */
export function useContracts() {
  const contractsQuery = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      // Fetch sites that have contracts
      const sites = await sitesApi.getSites();
      
      // Convert sites to contract data
      const contractData: ContractData[] = sites
        .filter(site => site.contract_details || site.additional_contracts)
        .flatMap(site => {
          const contracts: ContractData[] = [];
          
          // Add primary contract if it exists
          if (site.contract_details) {
            const contractDetails = asJsonObject(site.contract_details, {
              contractNumber: '',
              startDate: '',
              endDate: '',
              contractType: '',
              renewalType: '',
              status: 'active',
              value: 0,
              noticePeriod: '',
              autoRenewal: false
            });
            
            contracts.push({
              id: `${site.id}-primary`,
              site_id: site.id,
              site_name: site.name,
              client_id: site.client_id || '',
              client_name: site.client_name || '',
              contract_details: site.contract_details,
              monthly_revenue: site.monthly_revenue || contractDetails.value || 0,
              status: contractDetails.status,
              is_primary: true
            });
          }
          
          // Add additional contracts if they exist
          if (site.additional_contracts && Array.isArray(site.additional_contracts)) {
            site.additional_contracts.forEach((contract, index) => {
              const additionalDetails = asJsonObject(contract, {
                contract_number: '',
                start_date: '',
                end_date: '',
                contract_type: '',
                renewal_type: '',
                status: 'active',
                monthly_value: 0,
                notice_period: '',
                auto_renewal: false
              });
              
              contracts.push({
                id: `${site.id}-additional-${index}`,
                site_id: site.id,
                site_name: site.name,
                client_id: site.client_id || '',
                client_name: site.client_name || '',
                contract_details: contract,
                monthly_revenue: additionalDetails.monthly_value || 0,
                status: additionalDetails.status,
                is_primary: false
              });
            });
          }
          
          return contracts;
        });
      
      return contractData;
    }
  });
  
  // Group contracts by different properties
  const groupedContracts: GroupedContracts = {
    byStatus: {},
    byClient: {},
    byMonth: {}
  };
  
  if (contractsQuery.data) {
    // Group by status
    groupedContracts.byStatus = contractsQuery.data.reduce((acc, contract) => {
      const status = contract.status || 'unknown';
      if (!acc[status]) acc[status] = [];
      acc[status].push(contract);
      return acc;
    }, {} as Record<string, ContractData[]>);
    
    // Group by client
    groupedContracts.byClient = contractsQuery.data.reduce((acc, contract) => {
      const clientId = contract.client_id || 'unknown';
      if (!acc[clientId]) acc[clientId] = [];
      acc[clientId].push(contract);
      return acc;
    }, {} as Record<string, ContractData[]>);
    
    // Group by month (based on end date)
    groupedContracts.byMonth = contractsQuery.data.reduce((acc, contract) => {
      const contractDetails = asJsonObject(contract.contract_details, { endDate: '' });
      if (!contractDetails.endDate) return acc;
      
      const endDate = new Date(contractDetails.endDate);
      const monthYear = `${endDate.getMonth() + 1}-${endDate.getFullYear()}`;
      
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(contract);
      return acc;
    }, {} as Record<string, ContractData[]>);
  }
  
  return {
    contractData: contractsQuery.data || [],
    groupedContracts,
    isLoading: contractsQuery.isLoading,
  };
}
