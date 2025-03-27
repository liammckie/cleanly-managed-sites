
import { 
  JobCostCalculationInput, 
  PayCondition, 
  CostCalculationResult 
} from './types';
import { cleaningServicesAward } from './awardData';

// Calculate job cost based on input parameters and award rules
export function calculateJobCost(input: JobCostCalculationInput): CostCalculationResult {
  // Get base rate for the specified level
  const baseRate = input.baseRate || 
    (cleaningServicesAward.employeeLevelRates[input.level] || 
     cleaningServicesAward.baseLevelRates[input.level]);
  
  // Apply casual loading if applicable
  const appliedBaseRate = input.employmentType === 'casual' 
    ? baseRate * (1 + cleaningServicesAward.casualLoading) 
    : baseRate;
  
  // Calculate labor cost based on hours and conditions
  let laborCost = appliedBaseRate * input.hours;
  let totalHours = input.hours;
  
  // Apply any penalty rates from the conditions
  if (input.conditions && Object.keys(input.conditions).length > 0) {
    laborCost = 0;
    totalHours = 0;
    
    Object.entries(input.conditions).forEach(([condition, hours]) => {
      if (hours && hours > 0) {
        const rate = cleaningServicesAward.conditionRates[condition as PayCondition] || 1;
        laborCost += (appliedBaseRate * rate * hours);
        totalHours += hours;
      }
    });
  }
  
  // Calculate overhead cost
  const overheadPercentage = input.overheadPercentage !== undefined 
    ? input.overheadPercentage 
    : cleaningServicesAward.defaultSettings.overheadPercentageDefault || 15;
  
  const overheadCost = (laborCost * overheadPercentage) / 100;
  
  // Calculate total cost before margin
  const totalCostBeforeMargin = laborCost + overheadCost;
  
  // Calculate margin
  const marginPercentage = input.marginPercentage !== undefined 
    ? input.marginPercentage 
    : cleaningServicesAward.defaultSettings.marginPercentageDefault || 20;
  
  const margin = (totalCostBeforeMargin * marginPercentage) / 100;
  
  // Calculate final price
  const price = totalCostBeforeMargin + margin;
  
  // Create cost calculation result
  return {
    baseRate: appliedBaseRate,
    totalHours,
    laborHours: totalHours,
    laborCost,
    overheadCost,
    totalCost: totalCostBeforeMargin,
    profitMargin: marginPercentage,
    margin,
    price,
    finalPrice: price,
    totalCostBeforeMargin,
    items: [],
    breakdownByDay: {},
    byTimeOfDay: {}
  };
}
