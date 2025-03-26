
import {
  EmploymentType,
  EmployeeLevel,
  PayCondition,
  JobCostCalculationInput,
  CostCalculationResult,
  RateDefinition
} from './types';
import { awardData } from './awardData';

// Helper function to get the base rate
export function getBaseRate(employmentType: EmploymentType, level: EmployeeLevel): number {
  const levelRates = awardData.employeeLevelRates[level];
  if (!levelRates) {
    console.warn(`No level rates found for level ${level}`);
    return 0;
  }
  const rate = levelRates.base;
  if (!rate) {
    console.warn(`No rate found for employment type ${employmentType} and level ${level}`);
    return 0;
  }
  return rate;
}

// Helper function to calculate rate based on condition
export function calculateConditionRate(baseRate: number, condition: PayCondition): number {
  const rateDefinition: RateDefinition | undefined = awardData.conditionRates[condition];
  if (!rateDefinition) {
    console.warn(`No rate definition found for condition ${condition}`);
    return baseRate;
  }
  return baseRate * (rateDefinition.percentage / 100);
}

// Main function to calculate job cost
export function calculateJobCost(input: JobCostCalculationInput): CostCalculationResult {
  const { employmentType, level, hours, overheadPercentage, marginPercentage } = input;

  // Get the base rate
  const baseRate = getBaseRate(employmentType, level);

  // Calculate labor cost for each condition
  let laborCost = 0;
  let totalHours = 0;
  const costItems = [];

  for (const condition in hours) {
    if (hours.hasOwnProperty(condition)) {
      const hoursForCondition = hours[condition as PayCondition] || 0;
      totalHours += hoursForCondition;
      const conditionRate = calculateConditionRate(baseRate, condition as PayCondition);
      const conditionCost = conditionRate * hoursForCondition;
      laborCost += conditionCost;

      costItems.push({
        condition: condition as PayCondition,
        hours: hoursForCondition,
        rate: conditionRate,
        cost: conditionCost
      });
    }
  }

  // Calculate overhead and margin
  const overheadCost = laborCost * (overheadPercentage / 100);
  const totalCostBeforeMargin = laborCost + overheadCost;
  const margin = totalCostBeforeMargin * (marginPercentage / 100);

  return {
    baseRate,
    totalHours,
    laborCost,
    overheadCost,
    totalCost: totalCostBeforeMargin,
    margin,
    price: totalCostBeforeMargin + margin,
    totalCostBeforeMargin,
    items: costItems
  };
}
