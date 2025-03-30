
import { 
  JobCostCalculationInput, 
  PayCondition, 
  CostCalculationResult 
} from './types';
import { cleaningServicesAward } from './awardData';

// Calculate job cost based on input parameters and award rules
export function calculateJobCost(input: JobCostCalculationInput): CostCalculationResult {
  // Get base rate for the specified level
  const level = String(input.level);
  const baseRate = input.baseRate || 
    (cleaningServicesAward.employeeLevelRates?.[level] || 
     cleaningServicesAward.baseLevelRates?.[level] || 0);
  
  // Apply casual loading if applicable
  const casualLoading = cleaningServicesAward.casualLoading || cleaningServicesAward.penalties.casual;
  const appliedBaseRate = input.employmentType === 'casual' 
    ? baseRate * (1 + casualLoading) 
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
        const payCondition = condition as PayCondition;
        const rate = cleaningServicesAward.conditionRates?.[payCondition] || 1;
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
