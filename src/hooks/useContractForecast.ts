
import { useState, useEffect } from 'react';
import { ContractForecast } from '@/components/sites/forms/types/contractTypes';
import { format, parseISO, differenceInMonths, addMonths } from 'date-fns';

// Contract forecast hook for generating revenue forecasts
export function useContractForecast(contracts: any[] = [], period: number = 12) {
  const [forecasts, setForecasts] = useState<ContractForecast[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    try {
      if (!contracts || contracts.length === 0) {
        setForecasts([]);
        setLoaded(true);
        return;
      }
      
      // Generate forecast for each month in the period
      const forecast = generateForecast(contracts, period);
      setForecasts(forecast);
      setLoaded(true);
    } catch (err: any) {
      console.error('Error generating contract forecast:', err);
      setError(err);
      setLoaded(true);
    }
  }, [contracts, period]);
  
  return { forecasts, loaded, error };
}

// Function to generate monthly revenue forecasts
function generateForecast(contracts: any[], period: number): ContractForecast[] {
  if (!contracts || contracts.length === 0) return [];
  
  const today = new Date();
  const forecastData: ContractForecast[] = [];
  
  // Generate a forecast entry for each month
  for (let i = 0; i < period; i++) {
    const forecastDate = addMonths(today, i);
    const activeContracts = getActiveContractsForMonth(contracts, forecastDate);
    
    // Calculate total revenue and cost for the month
    let monthlyRevenue = 0;
    let monthlyCost = 0;
    
    activeContracts.forEach(contract => {
      const value = contract.value || contract.monthly_revenue || 0;
      const cost = contract.monthly_cost || 0;
      
      monthlyRevenue += value;
      monthlyCost += cost;
    });
    
    const monthlyProfit = monthlyRevenue - monthlyCost;
    
    // Add forecast entry for the month
    forecastData.push({
      id: `forecast-${i}`,
      month: format(forecastDate, 'MMM yyyy'),
      revenue: monthlyRevenue,
      cost: monthlyCost,
      profit: monthlyProfit,
      startDate: format(forecastDate, 'yyyy-MM-01'),
      endDate: format(addMonths(forecastDate, 1), 'yyyy-MM-01'),
      value: monthlyRevenue
    });
  }
  
  return forecastData;
}

// Function to determine which contracts are active for a given month
function getActiveContractsForMonth(contracts: any[], date: Date): any[] {
  return contracts.filter(contract => {
    // Get the contract dates
    const startDate = getContractStartDate(contract);
    const endDate = getContractEndDate(contract);
    
    if (!startDate) return false;
    
    // Check if the contract is active during the month
    return (!startDate || startDate <= date) && 
           (!endDate || endDate >= date);
  });
}

// Helper function to get contract start date
function getContractStartDate(contract: any): Date | null {
  const startDateStr = contract.startDate || contract.start_date;
  if (!startDateStr) return null;
  
  try {
    return parseISO(startDateStr);
  } catch (err) {
    console.error('Invalid start date format:', startDateStr);
    return null;
  }
}

// Helper function to get contract end date
function getContractEndDate(contract: any): Date | null {
  const endDateStr = contract.endDate || contract.end_date;
  if (!endDateStr) return null;
  
  try {
    return parseISO(endDateStr);
  } catch (err) {
    console.error('Invalid end date format:', endDateStr);
    return null;
  }
}
