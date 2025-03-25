
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

/**
 * Hook to manage billing lines for a site
 */
export function useSiteFormBillingLines(initialBillingLines: BillingLine[] = []) {
  const [billingLines, setBillingLines] = useState<BillingLine[]>(initialBillingLines);

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

  // Update a specific billing line
  const updateBillingLine = (id: string, field: string, value: any) => {
    setBillingLines(prev => 
      prev.map(line => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value };
          
          // Calculate weekly/monthly/annual amounts based on frequency and amount
          if (field === 'amount' || field === 'frequency') {
            const amount = typeof value === 'number' && field === 'amount' 
              ? value 
              : line.amount;
              
            const frequency = field === 'frequency' ? value : line.frequency;
            
            switch (frequency) {
              case 'weekly':
                updatedLine.weeklyAmount = amount;
                updatedLine.monthlyAmount = amount * 4.33;
                updatedLine.annualAmount = amount * 52;
                break;
              case 'fortnightly':
                updatedLine.weeklyAmount = amount / 2;
                updatedLine.monthlyAmount = amount * 2.165;
                updatedLine.annualAmount = amount * 26;
                break;
              case 'monthly':
                updatedLine.weeklyAmount = amount / 4.33;
                updatedLine.monthlyAmount = amount;
                updatedLine.annualAmount = amount * 12;
                break;
              case 'quarterly':
                updatedLine.weeklyAmount = amount / 13;
                updatedLine.monthlyAmount = amount / 3;
                updatedLine.annualAmount = amount * 4;
                break;
              case 'annually':
                updatedLine.weeklyAmount = amount / 52;
                updatedLine.monthlyAmount = amount / 12;
                updatedLine.annualAmount = amount;
                break;
              default:
                updatedLine.weeklyAmount = amount;
                updatedLine.monthlyAmount = amount * 4.33;
                updatedLine.annualAmount = amount * 52;
            }
          }
          
          return updatedLine;
        }
        return line;
      })
    );
  };

  // Remove a billing line
  const removeBillingLine = (id: string) => {
    setBillingLines(prev => prev.filter(line => line.id !== id));
  };

  // Calculate totals across all billing lines
  const calculateBillingTotals = () => {
    const weekly = billingLines.reduce((sum, line) => sum + (line.weeklyAmount || 0), 0);
    const monthly = billingLines.reduce((sum, line) => sum + (line.monthlyAmount || 0), 0);
    const annual = billingLines.reduce((sum, line) => sum + (line.annualAmount || 0), 0);
    
    return { weekly, monthly, annual };
  };

  return {
    billingLines,
    addBillingLine,
    updateBillingLine,
    removeBillingLine,
    calculateBillingTotals
  };
}
