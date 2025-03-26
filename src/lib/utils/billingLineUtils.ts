
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

export const toggleLineOnHoldStatus = (line: BillingLine): BillingLine => {
  if (!line) return line;
  
  const newLine = { ...line };
  newLine.onHold = !newLine.onHold;
  
  return newLine;
};

export const createEmptyBillingLine = (): BillingLine => {
  return {
    id: crypto.randomUUID(),
    description: '',
    amount: 0,
    frequency: 'monthly',
    isRecurring: true,
    onHold: false,
    weeklyAmount: 0,
    monthlyAmount: 0,
    annualAmount: 0,
  };
};
