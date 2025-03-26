
import { Quote, QuoteShift, Subcontractor } from '@/lib/types/award/types';

export function calculateTotalCosts(quote: Quote): {
  laborCost: number;
  subcontractorCost: number;
  overheadCost: number;
  totalCost: number;
  marginAmount: number;
  totalPrice: number;
} {
  // Calculate labor cost
  const laborCost = quote.shifts?.reduce((total, shift) => total + (shift.estimatedCost || 0), 0) || 0;

  // Calculate subcontractor cost
  const subcontractorCost = quote.subcontractors?.reduce((total, sub) => total + (sub.cost || 0), 0) || 0;

  // Calculate supplies and equipment costs
  const suppliesCost = quote.supplies_cost || quote.suppliesCost || 0;
  const equipmentCost = quote.equipment_cost || quote.equipmentCost || 0;

  // Calculate overhead amount
  const directCosts = laborCost + subcontractorCost + suppliesCost + equipmentCost;
  const overheadPercentage = quote.overhead_percentage || quote.overheadPercentage || 15;
  const overheadCost = directCosts * (overheadPercentage / 100);

  // Calculate total cost before margin
  const totalCost = directCosts + overheadCost;

  // Calculate margin amount
  const marginPercentage = quote.margin_percentage || quote.marginPercentage || 20;
  const marginAmount = totalCost * (marginPercentage / 100);

  // Calculate total price
  const totalPrice = totalCost + marginAmount;

  return {
    laborCost,
    subcontractorCost,
    overheadCost,
    totalCost,
    marginAmount,
    totalPrice
  };
}

export function calculateQuoteFrequencyMultiplier(frequency: string): number {
  switch (frequency?.toLowerCase()) {
    case 'daily':
      return 365 / 12;  // monthly equivalent of daily
    case 'weekly':
      return 4.33;  // weeks per month
    case 'fortnightly':
      return 2.17;  // fortnightly per month
    case 'monthly':
      return 1;
    case 'quarterly':
      return 1/3;
    case 'yearly':
    case 'annually':
      return 1/12;
    case 'once':
    case 'one_time':
    case 'per_event':
      return 1;  // one-time is treated as monthly for the purpose of calculations
    default:
      return 1;  // Default to monthly
  }
}
