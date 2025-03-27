import { useState, useEffect } from 'react';
import { ContractData, ContractSummaryData } from '@/types/contracts';
import { ContractForecast } from '@/components/sites/forms/types/contractTypes';
import { asJsonObject } from '@/lib/utils/json';

export function useContractForecast(contractData: ContractData[]) {
  const [forecastData, setForecastData] = useState<ContractForecast[]>([]);
  const [summaryData, setSummaryData] = useState<ContractSummaryData>({
    totalValue: 0,
    totalCount: 0,
    expiringCount: 0,
    expiredCount: 0,
    activeCount: 0,
    pendingCount: 0,
  });
  
  useEffect(() => {
    if (!contractData || contractData.length === 0) {
      return;
    }
    
    // Generate monthly forecast data for the next 12 months
    const forecast = generateContractForecast(contractData);
    setForecastData(forecast);
    
    // Calculate summary statistics
    const summary = calculateContractSummary(contractData);
    setSummaryData(summary);
  }, [contractData]);
  
  return {
    forecastData,
    summaryData
  };
}

function generateContractForecast(contracts: ContractData[]): ContractForecast[] {
  // Get the current date
  const currentDate = new Date();
  
  // Create forecast for next 12 months
  const forecast: ContractForecast[] = [];
  
  for (let i = 0; i < 12; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setMonth(currentDate.getMonth() + i);
    
    // Format date as month year
    const month = forecastDate.toLocaleString('default', { month: 'short' });
    const year = forecastDate.getFullYear();
    const monthYear = `${month} ${year}`;
    
    // Calculate revenue, cost, and profit for the month
    const { revenue, cost, profit } = calculateMonthlyFinancials(contracts, forecastDate);
    
    forecast.push({
      month: monthYear,
      revenue,
      cost,
      profit
    });
  }
  
  return forecast;
}

function calculateMonthlyFinancials(contracts: ContractData[], date: Date): { revenue: number, cost: number, profit: number } {
  // Start with zero values
  let revenue = 0;
  let cost = 0;
  
  // Process each contract
  contracts.forEach(contract => {
    // Get contract details
    const details = contract.contract_details;
    
    // Check if contract is active in this month
    if (isContractActiveInMonth(details, date)) {
      // Add contract revenue
      revenue += contract.monthly_revenue || 0;
      
      // Estimate cost as 70% of revenue if not specified
      const contractCost = revenue * 0.7;
      cost += contractCost;
    }
  });
  
  // Calculate profit
  const profit = revenue - cost;
  
  return { revenue, cost, profit };
}

function isContractActiveInMonth(contractDetails: any, date: Date): boolean {
  // If no contract details, assume always active
  if (!contractDetails) {
    return true;
  }
  
  // Parse contract details
  const details = asJsonObject(contractDetails);
  
  // Check start date
  if (details.startDate) {
    const startDate = new Date(details.startDate);
    if (date < startDate) {
      return false;
    }
  }
  
  // Check end date
  if (details.endDate) {
    const endDate = new Date(details.endDate);
    if (date > endDate) {
      return false;
    }
  }
  
  return true;
}

function calculateContractSummary(contracts: ContractData[]): ContractSummaryData {
  // Current date for expiration calculations
  const currentDate = new Date();
  const thirtyDaysFromNow = new Date(currentDate);
  thirtyDaysFromNow.setDate(currentDate.getDate() + 30);
  
  // Initialize counters
  let totalValue = 0;
  let expiringCount = 0;
  let expiredCount = 0;
  let activeCount = 0;
  
  // Process each contract
  contracts.forEach(contract => {
    // Get contract details
    const details = contract.contract_details;
    
    // Extract end date
    const endDateStr = details.endDate;
    
    if (endDateStr) {
      const endDate = new Date(endDateStr);
      
      // Check if expired
      if (endDate < currentDate) {
        expiredCount++;
      }
      // Check if expiring within 30 days
      else if (endDate <= thirtyDaysFromNow) {
        expiringCount++;
      }
      // Otherwise active
      else {
        activeCount++;
      }
    } else {
      // Without end date, consider active
      activeCount++;
    }
    
    // Add monthly revenue to total value
    totalValue += contract.monthly_revenue || 0;
  });
  
  // Calculate total annual value
  const annualValue = totalValue * 12;
  
  return {
    totalValue: annualValue,
    totalCount: contracts.length,
    expiringCount,
    expiredCount,
    activeCount,
    pendingCount: 0,  // Not tracked in this model
  };
}
