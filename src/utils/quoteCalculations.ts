
// Utility functions for quote calculations

/**
 * Calculate the total weekly, monthly, and annual costs from an amount and frequency
 */
export function calculateBillingAmounts(amount: number, frequency: string) {
  switch (frequency) {
    case 'weekly':
      return {
        weeklyAmount: amount,
        monthlyAmount: amount * 4.33,
        annualAmount: amount * 52
      };
    case 'fortnightly':
      return {
        weeklyAmount: amount / 2,
        monthlyAmount: amount * 2.165,
        annualAmount: amount * 26
      };
    case 'monthly':
      return {
        weeklyAmount: amount / 4.33,
        monthlyAmount: amount,
        annualAmount: amount * 12
      };
    case 'quarterly':
      return {
        weeklyAmount: amount / 13,
        monthlyAmount: amount / 3,
        annualAmount: amount * 4
      };
    case 'annually':
      return {
        weeklyAmount: amount / 52,
        monthlyAmount: amount / 12,
        annualAmount: amount
      };
    default:
      return {
        weeklyAmount: 0,
        monthlyAmount: 0,
        annualAmount: 0
      };
  }
}

/**
 * Calculate the total cost for a group of billing lines
 */
export function calculateTotalBillingCost(billingLines: any[]) {
  if (!billingLines || !Array.isArray(billingLines)) {
    return 0;
  }

  return billingLines.reduce((total, line) => {
    // Skip lines that are on hold
    if (line.onHold || line.on_hold) {
      return total;
    }
    
    return total + (parseFloat(line.amount) || 0);
  }, 0);
}

/**
 * Calculate total quote costs
 */
export function calculateQuoteTotals(laborCost: number, subcontractorCost: number, overheadPercentage: number, marginPercentage: number) {
  const overheadCost = (laborCost * overheadPercentage) / 100;
  const totalCost = laborCost + subcontractorCost + overheadCost;
  const marginAmount = (totalCost * marginPercentage) / 100;
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
