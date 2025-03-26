
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

export const isLineOnHold = (line: BillingLine): boolean => {
  // Check for either on_hold or onHold property
  return line.on_hold || !!line.onHold;
};

export const formatBillingLineForAPI = (line: BillingLine): BillingLine => {
  // Ensure on_hold property is set correctly for API
  return {
    ...line,
    on_hold: isLineOnHold(line)
  };
};
