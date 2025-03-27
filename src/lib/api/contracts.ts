
import { supabase } from '@/lib/supabase';
import { ContractForecast, ContractData, ContractSummaryData } from '@/types/contracts';
import { format, addMonths, startOfMonth } from 'date-fns';

// Sample data generator for development
const generateSampleForecast = (): ContractForecast[] => {
  const forecasts: ContractForecast[] = [];
  const startMonth = startOfMonth(new Date());
  
  for (let i = 0; i < 12; i++) {
    const month = addMonths(startMonth, i);
    const revenue = 10000 + (Math.random() * 5000) - 2500;
    const cost = revenue * 0.7;
    const profit = revenue - cost;
    
    forecasts.push({
      month: format(month, 'MMM yyyy'),
      revenue,
      cost,
      profit,
      contractCount: Math.floor(Math.random() * 20) + 10,
      activeContracts: Math.floor(Math.random() * 15) + 10,
      expiringContracts: Math.floor(Math.random() * 3),
      renewingContracts: Math.floor(Math.random() * 2)
    });
  }
  
  return forecasts;
};

const generateSampleContractSummary = (): ContractSummaryData => {
  return {
    totalCount: 45,
    totalContracts: 45,
    activeCount: 38,
    pendingCount: 7,
    totalValue: 850000,
    totalRevenue: 850000,
    totalCost: 595000,
    totalProfit: 255000,
    profitMargin: 30,
    expiringWithin30Days: 3,
    expiringThisMonth: 2,
    expiringNext3Months: 5,
    expiringNext6Months: 8,
    expiringThisYear: 12,
    valueExpiringThisMonth: 35000,
    valueExpiringNext3Months: 87500,
    valueExpiringNext6Months: 125000,
    valueExpiringThisYear: 230000,
    avgContractValue: 18889,
    renewalRate: 85,
    expiringCount: 12
  };
};

export const contractsApi = {
  async getContractForecast(): Promise<ContractForecast[]> {
    // In a real implementation, this would fetch from the database
    // For now, return sample data
    return generateSampleForecast();
  },
  
  async getContractSummary(): Promise<ContractSummaryData> {
    // In a real implementation, this would fetch from the database
    // For now, return sample data
    return generateSampleContractSummary();
  },
  
  async getActiveContracts(): Promise<ContractData[]> {
    const { data, error } = await supabase
      .from('site_additional_contracts')
      .select(`
        id,
        site_id,
        contract_type,
        contract_number,
        start_date,
        end_date,
        value,
        auto_renew,
        billing_cycle,
        notes,
        sites:site_id (
          id,
          name,
          client_id,
          client:client_id (
            id,
            name
          )
        )
      `)
      .order('end_date');
    
    if (error) {
      console.error('Error fetching active contracts:', error);
      throw error;
    }
    
    // Transform the data to match the ContractData interface
    return (data || []).map(item => ({
      id: item.id,
      client: {
        id: item.sites?.client?.id || '',
        name: item.sites?.client?.name || ''
      },
      site: {
        id: item.sites?.id || '',
        name: item.sites?.name || ''
      },
      site_id: item.site_id,
      site_name: item.sites?.name || '',
      client_id: item.sites?.client?.id || '',
      client_name: item.sites?.client?.name || '',
      value: item.value || 0,
      startDate: item.start_date || '',
      endDate: item.end_date || '',
      status: item.end_date && new Date(item.end_date) < new Date() ? 'expired' : 'active',
      contract_details: {
        contractNumber: item.contract_number,
        contractType: item.contract_type,
        autoRenewal: item.auto_renew,
        startDate: item.start_date,
        endDate: item.end_date,
        value: item.value,
        billingCycle: item.billing_cycle,
        notes: item.notes
      }
    }));
  }
};
