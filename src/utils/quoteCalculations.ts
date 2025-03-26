import { Day, EmployeeLevel, EmploymentType } from '@/lib/award/types';
import { Subcontractor } from '@/lib/types/quotes';

interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}

export interface QuoteCalculationInput {
  laborCost: number;
  suppliesCost: number;
  equipmentCost: number;
  subcontractorCost: number;
  overheadPercentage: number;
  marginPercentage: number;
}

export interface QuoteCalculationResult {
  laborCost: number;
  suppliesCost: number;
  equipmentCost: number;
  subcontractorCost: number;
  overheadCost: number;
  totalCostBeforeMargin: number;
  marginAmount: number;
  totalCost: number;
  price: number;
}

export function calculateTotalCosts(input: QuoteCalculationInput): QuoteCalculationResult {
  const { 
    laborCost, 
    suppliesCost, 
    equipmentCost, 
    subcontractorCost,
    overheadPercentage,
    marginPercentage
  } = input;

  // Calculate the subtotal before overhead
  const subtotalBeforeOverhead = laborCost + suppliesCost + equipmentCost + subcontractorCost;
  
  // Calculate overhead cost
  const overheadCost = (subtotalBeforeOverhead * overheadPercentage) / 100;
  
  // Calculate total cost before margin
  const totalCostBeforeMargin = subtotalBeforeOverhead + overheadCost;
  
  // Calculate margin amount
  const marginAmount = (totalCostBeforeMargin * marginPercentage) / 100;
  
  // Calculate total cost and price
  const totalCost = totalCostBeforeMargin + marginAmount;
  const price = totalCost;

  return {
    laborCost,
    suppliesCost,
    equipmentCost,
    subcontractorCost,
    overheadCost,
    totalCostBeforeMargin,
    marginAmount,
    totalCost,
    price
  };
}

export function calculateLabourCost(
  shifts: QuoteShift[],
  baseRates: Record<EmployeeLevel, number>,
  casualLoading: number
): number {
  return shifts.reduce((total, shift) => {
    // Calculate hours (excluding break)
    const startTime = new Date(`1970-01-01T${shift.startTime}:00`);
    const endTime = new Date(`1970-01-01T${shift.endTime}:00`);
    
    // If end time is before start time, add a day to end time
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    const durationMs = endTime.getTime() - startTime.getTime();
    let hours = durationMs / (1000 * 60 * 60);
    
    // Subtract break duration
    hours -= shift.breakDuration / 60;
    
    // Get base rate for this employee level
    const baseRate = baseRates[shift.level] || 0;
    
    // Apply casual loading if applicable
    const rate = shift.employmentType === 'casual' 
      ? baseRate * (1 + casualLoading / 100) 
      : baseRate;
    
    // Calculate cost for this shift
    const cost = rate * hours * shift.numberOfCleaners;
    
    return total + cost;
  }, 0);
}

export function calculateSubcontractorTotalCost(subcontractors: Subcontractor[]): number {
  return subcontractors.reduce((total, sub) => {
    // For monthly costs, we need to convert to per-job cost based on frequency
    let jobCost = sub.cost;
    
    switch (sub.frequency) {
      case 'weekly':
        // No change needed for weekly
        break;
      case 'fortnightly':
        jobCost = sub.cost / 2;
        break;
      case 'monthly':
        jobCost = sub.cost / 4.33;
        break;
      case 'quarterly':
        jobCost = sub.cost / 13;
        break;
      case 'annually':
      case 'yearly':
        jobCost = sub.cost / 52;
        break;
      case 'one-time':
      case 'one_time':
      case 'per_event':
        // For one-time costs, keep as is
        break;
      default:
        // Default to as-is
        break;
    }
    
    return total + jobCost;
  }, 0);
}
