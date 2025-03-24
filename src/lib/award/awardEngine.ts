
import { PayCondition, EmploymentType, EmployeeLevel, JobCostingParams, JobCostBreakdown, EmployeeLevelRates, JobCostBreakdownItem } from './types';
import { cleaningServicesAward, defaultAwardSettings } from './awardData';
import { toast } from 'sonner';

// Function to get the award rates for a specific employment type and level
export function getAwardRates(employmentType: EmploymentType, level: EmployeeLevel): EmployeeLevelRates | undefined {
  return cleaningServicesAward.levels.find(l => 
    l.employmentType === employmentType && l.level === level
  );
}

// Function to calculate job cost based on award rates
export function calculateJobCost(params: JobCostingParams, settingsMultiplier: number = 1.0): JobCostBreakdown {
  const { employmentType, level, hours, overheadPercentage, marginPercentage } = params;
  
  // Get the award rates for the specified employment type and level
  const rateInfo = getAwardRates(employmentType, level);
  
  if (!rateInfo) {
    toast.error(`Could not find award rates for ${employmentType} level ${level}`);
    throw new Error(`Could not find award rates for ${employmentType} level ${level}`);
  }
  
  let totalLaborCost = 0;
  const hourlyBreakdown: JobCostBreakdownItem[] = [];
  
  // Calculate cost for each pay condition
  Object.keys(hours).forEach(conditionKey => {
    const condition = conditionKey as PayCondition;
    const hoursForCondition = hours[condition] || 0;
    
    if (hoursForCondition > 0 && rateInfo.rates[condition]) {
      // Apply the settings multiplier to adjust base rates
      const adjustedRate = rateInfo.rates[condition].rate * settingsMultiplier;
      const cost = adjustedRate * hoursForCondition;
      
      totalLaborCost += cost;
      
      hourlyBreakdown.push({
        condition,
        hours: hoursForCondition,
        rate: adjustedRate,
        cost
      });
    }
  });
  
  // Calculate overhead cost
  const overheadCost = totalLaborCost * (overheadPercentage / 100);
  
  // Calculate total cost before margin
  const totalCostBeforeMargin = totalLaborCost + overheadCost;
  
  // Calculate margin
  const margin = totalCostBeforeMargin * (marginPercentage / 100);
  
  // Calculate total price
  const totalPrice = totalCostBeforeMargin + margin;
  
  return {
    baseRate: rateInfo.baseRate,
    hourlyRate: rateInfo.hourlyRate,
    totalCost: totalLaborCost,
    laborCost: totalLaborCost,
    overheadCost,
    totalCostBeforeMargin,
    margin,
    totalPrice,
    hourlyBreakdown
  };
}

// Function to recalculate rates based on a multiplier
export function recalculateRatesWithMultiplier(multiplier: number) {
  if (multiplier <= 0) {
    toast.error("Multiplier must be greater than 0");
    return;
  }
  
  // Clone the award data
  const updatedAward = { ...cleaningServicesAward };
  
  // Update each rate in the cloned data
  updatedAward.levels.forEach(level => {
    Object.keys(level.rates).forEach(conditionKey => {
      const condition = conditionKey as PayCondition;
      const originalRate = level.rates[condition].rate / level.rates[condition].multiplier;
      level.rates[condition].rate = originalRate * level.rates[condition].multiplier * multiplier;
    });
    level.baseRate = level.baseRate * multiplier;
    level.hourlyRate = level.hourlyRate * multiplier;
  });
  
  return updatedAward;
}
