
import { supabase } from '@/integrations/supabase/client';
import { ContractSummaryData } from '@/types/contracts';

// Get summary data for all contracts
export async function getContractsSummary(): Promise<ContractSummaryData> {
  // Get current date for comparison
  const today = new Date();
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const threeMonthsLater = new Date(today.getFullYear(), today.getMonth() + 3, 0);
  const sixMonthsLater = new Date(today.getFullYear(), today.getMonth() + 6, 0);
  const yearEnd = new Date(today.getFullYear(), 11, 31);
  
  try {
    // Get all contracts
    const { data: contracts, error } = await supabase
      .from('sites')
      .select('id, contract_details, monthly_revenue, monthly_cost');
    
    if (error) throw error;
    
    const allContracts = contracts || [];
    const activeContracts = allContracts.filter(contract => 
      contract.contract_details?.status === 'active'
    );
    
    // Calculate expirations
    const expiringWithin30Days = allContracts.filter(contract => {
      const endDate = contract.contract_details?.endDate;
      if (!endDate) return false;
      
      const expiryDate = new Date(endDate);
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 && diffDays <= 30;
    }).length;
    
    const expiringThisMonth = allContracts.filter(contract => {
      const endDate = contract.contract_details?.endDate;
      if (!endDate) return false;
      
      const expiryDate = new Date(endDate);
      return expiryDate <= monthEnd && expiryDate >= today;
    }).length;
    
    const expiringNext3Months = allContracts.filter(contract => {
      const endDate = contract.contract_details?.endDate;
      if (!endDate) return false;
      
      const expiryDate = new Date(endDate);
      return expiryDate <= threeMonthsLater && expiryDate >= today;
    }).length;
    
    const expiringNext6Months = allContracts.filter(contract => {
      const endDate = contract.contract_details?.endDate;
      if (!endDate) return false;
      
      const expiryDate = new Date(endDate);
      return expiryDate <= sixMonthsLater && expiryDate >= today;
    }).length;
    
    const expiringThisYear = allContracts.filter(contract => {
      const endDate = contract.contract_details?.endDate;
      if (!endDate) return false;
      
      const expiryDate = new Date(endDate);
      return expiryDate <= yearEnd && expiryDate >= today;
    }).length;
    
    // Calculate totals
    const totalValue = allContracts.reduce((sum, contract) => 
      sum + (Number(contract.monthly_revenue || 0) * 12), 0);
    
    const totalRevenue = activeContracts.reduce((sum, contract) => 
      sum + (Number(contract.monthly_revenue || 0) * 12), 0);
    
    const totalCost = activeContracts.reduce((sum, contract) => 
      sum + (Number(contract.monthly_cost || 0) * 12), 0);
    
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    // Calculate value of expiring contracts
    const valueExpiringThisMonth = allContracts
      .filter(contract => {
        const endDate = contract.contract_details?.endDate;
        if (!endDate) return false;
        
        const expiryDate = new Date(endDate);
        return expiryDate <= monthEnd && expiryDate >= today;
      })
      .reduce((sum, contract) => sum + (Number(contract.monthly_revenue || 0) * 12), 0);
    
    const valueExpiringNext3Months = allContracts
      .filter(contract => {
        const endDate = contract.contract_details?.endDate;
        if (!endDate) return false;
        
        const expiryDate = new Date(endDate);
        return expiryDate <= threeMonthsLater && expiryDate >= today;
      })
      .reduce((sum, contract) => sum + (Number(contract.monthly_revenue || 0) * 12), 0);
    
    const valueExpiringNext6Months = allContracts
      .filter(contract => {
        const endDate = contract.contract_details?.endDate;
        if (!endDate) return false;
        
        const expiryDate = new Date(endDate);
        return expiryDate <= sixMonthsLater && expiryDate >= today;
      })
      .reduce((sum, contract) => sum + (Number(contract.monthly_revenue || 0) * 12), 0);
    
    const valueExpiringThisYear = allContracts
      .filter(contract => {
        const endDate = contract.contract_details?.endDate;
        if (!endDate) return false;
        
        const expiryDate = new Date(endDate);
        return expiryDate <= yearEnd && expiryDate >= today;
      })
      .reduce((sum, contract) => sum + (Number(contract.monthly_revenue || 0) * 12), 0);
    
    return {
      totalContracts: allContracts.length,
      activeCount: activeContracts.length,
      pendingCount: allContracts.filter(c => c.contract_details?.status === 'pending').length,
      totalValue,
      totalCount: allContracts.length, // Added for backward compatibility
      expiringWithin30Days,
      expiringThisMonth,
      expiringNext3Months,
      expiringNext6Months,
      expiringThisYear,
      valueExpiringThisMonth,
      valueExpiringNext3Months,
      valueExpiringNext6Months,
      valueExpiringThisYear,
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin
    };
  } catch (error) {
    console.error("Error getting contracts summary:", error);
    throw error;
  }
}
