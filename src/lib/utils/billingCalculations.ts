
// Check if site billing is on hold
export const isSiteBillingOnHold = (
  billingOnHold?: boolean,
  startDate?: string,
  endDate?: string
): boolean => {
  if (!billingOnHold) return false;
  
  const now = new Date();
  let isInHoldPeriod = true;
  
  // Check if we're after the start date (if specified)
  if (startDate) {
    const holdStartDate = new Date(startDate);
    if (now < holdStartDate) {
      isInHoldPeriod = false;
    }
  }
  
  // Check if we're before the end date (if specified)
  if (endDate) {
    const holdEndDate = new Date(endDate);
    if (now > holdEndDate) {
      isInHoldPeriod = false;
    }
  }
  
  return isInHoldPeriod;
};

// Calculate weekly amount from a value based on frequency
export const calculateWeeklyAmount = (value: number, frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return value;
    case 'monthly':
      return value / 4.33; // Average weeks in a month
    case 'quarterly':
      return value / 13; // 13 weeks in a quarter
    case 'annually':
      return value / 52; // 52 weeks in a year
    default:
      return 0;
  }
};

// Calculate monthly amount from a value based on frequency
export const calculateMonthlyAmount = (value: number, frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return value * 4.33; // Average weeks in a month
    case 'monthly':
      return value;
    case 'quarterly':
      return value / 3; // 3 months in a quarter
    case 'annually':
      return value / 12; // 12 months in a year
    default:
      return 0;
  }
};

// Calculate annual amount from a value based on frequency
export const calculateAnnualAmount = (value: number, frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return value * 52; // 52 weeks in a year
    case 'monthly':
      return value * 12; // 12 months in a year
    case 'quarterly':
      return value * 4; // 4 quarters in a year
    case 'annually':
      return value;
    default:
      return 0;
  }
};
