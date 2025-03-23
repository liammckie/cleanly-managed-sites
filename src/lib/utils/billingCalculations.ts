
// Convert weekly amount to other frequencies
export const convertWeeklyToFrequency = (weeklyAmount: number, frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return weeklyAmount;
    case 'fortnightly':
      return weeklyAmount * 2;
    case 'monthly':
      return weeklyAmount * 4.33; // Average weeks in a month
    case 'quarterly':
      return weeklyAmount * 13; // 13 weeks in a quarter
    case 'annually':
      return weeklyAmount * 52; // 52 weeks in a year
    default:
      return weeklyAmount;
  }
};

// Calculate weekly amount based on a value and frequency
export const calculateWeeklyAmount = (value: number, frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return value;
    case 'fortnightly':
      return value / 2;
    case 'monthly':
      return value / 4.33; // Average weeks in a month
    case 'quarterly':
      return value / 13; // 13 weeks in a quarter
    case 'annually':
      return value / 52; // 52 weeks in a year
    default:
      return value;
  }
};

// Calculate monthly amount based on a value and frequency
export const calculateMonthlyAmount = (value: number, frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return value * 4.33; // Average weeks in a month
    case 'fortnightly':
      return value * 2.165; // Half of weekly × 4.33
    case 'monthly':
      return value;
    case 'quarterly':
      return value / 3; // 3 months in a quarter
    case 'annually':
      return value / 12; // 12 months in a year
    default:
      return value;
  }
};

// Calculate annual amount based on a value and frequency
export const calculateAnnualAmount = (value: number, frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return value * 52; // 52 weeks in a year
    case 'fortnightly':
      return value * 26; // 26 fortnights in a year
    case 'monthly':
      return value * 12; // 12 months in a year
    case 'quarterly':
      return value * 4; // 4 quarters in a year
    case 'annually':
      return value;
    default:
      return value;
  }
};

// Calculate all billing amounts based on a single value and frequency
export const calculateBillingAmounts = (value: number, frequency: string) => {
  return {
    weeklyAmount: calculateWeeklyAmount(value, frequency),
    monthlyAmount: calculateMonthlyAmount(value, frequency),
    annualAmount: calculateAnnualAmount(value, frequency)
  };
};

// Calculate total amounts across all billing lines
export const calculateTotalBillingAmounts = (billingLines: any[]) => {
  const totals = {
    totalWeeklyAmount: 0,
    totalMonthlyAmount: 0,
    totalAnnualAmount: 0
  };
  
  billingLines.forEach(line => {
    // Skip lines that are on hold
    if (line.onHold) {
      return;
    }
    
    // Use the calculated amounts if available, otherwise calculate them
    const weeklyAmount = line.weeklyAmount || calculateWeeklyAmount(line.amount, line.frequency);
    const monthlyAmount = line.monthlyAmount || calculateMonthlyAmount(line.amount, line.frequency);
    const annualAmount = line.annualAmount || calculateAnnualAmount(line.amount, line.frequency);
    
    totals.totalWeeklyAmount += weeklyAmount;
    totals.totalMonthlyAmount += monthlyAmount;
    totals.totalAnnualAmount += annualAmount;
  });
  
  return totals;
};

// Check if a site's billing is on hold based on hold dates
export const isSiteBillingOnHold = (
  onHold?: boolean,
  holdStartDate?: string,
  holdEndDate?: string
): boolean => {
  if (!onHold) {
    return false;
  }
  
  const now = new Date();
  const startDate = holdStartDate ? new Date(holdStartDate) : null;
  const endDate = holdEndDate ? new Date(holdEndDate) : null;
  
  // If on hold with no start date or start date is in the past
  if (!startDate || startDate <= now) {
    // If no end date or end date is in the future
    if (!endDate || endDate > now) {
      return true;
    }
  }
  
  return false;
};
