
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BillingFrequency } from '@/components/sites/forms/types/billingTypes';

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  onHold?: boolean;
  holdStartDate?: string;
  holdEndDate?: string;
  creditAmount?: number;
  creditDate?: string;
  creditReason?: string;
}

export const useSiteFormBillingLines = (initialLines: BillingLine[] = []) => {
  const [billingLines, setBillingLines] = useState<BillingLine[]>(initialLines);

  // Add a new billing line
  const addBillingLine = () => {
    const newLine: BillingLine = {
      id: uuidv4(),
      description: '',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true
    };
    
    setBillingLines(prev => [...prev, newLine]);
  };

  // Remove a billing line by ID
  const removeBillingLine = (id: string) => {
    setBillingLines(prev => prev.filter(line => line.id !== id));
  };

  // Update a field in a billing line
  const updateBillingLine = (id: string, field: string, value: any) => {
    setBillingLines(prev => 
      prev.map(line => 
        line.id === id ? { ...line, [field]: value } : line
      )
    );
  };

  return {
    billingLines,
    setBillingLines,
    addBillingLine,
    removeBillingLine,
    updateBillingLine
  };
};
