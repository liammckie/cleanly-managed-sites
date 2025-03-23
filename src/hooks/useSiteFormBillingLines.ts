
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateBillingAmounts } from '@/lib/utils/billingCalculations';

// Define the structure for a billing line
export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
  onHold?: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
}

// Custom hook for managing billing lines in a form
export const useSiteFormBillingLines = (initialLines: BillingLine[] = []) => {
  const [billingLines, setBillingLines] = useState<BillingLine[]>(
    initialLines.length > 0 ? initialLines : [{
      id: uuidv4(),
      description: 'General Contract Cleaning',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true
    }]
  );

  // Add a new empty billing line
  const addBillingLine = useCallback(() => {
    setBillingLines(prev => [
      ...prev,
      {
        id: uuidv4(),
        description: '',
        amount: 0,
        frequency: 'monthly',
        isRecurring: true
      }
    ]);
  }, []);

  // Remove a billing line by id
  const removeBillingLine = useCallback((id: string) => {
    setBillingLines(prev => prev.filter(line => line.id !== id));
  }, []);

  // Update a specific field of a billing line
  const updateBillingLine = useCallback((id: string, field: keyof BillingLine, value: any) => {
    setBillingLines(prev => prev.map(line => {
      if (line.id !== id) return line;
      
      const updatedLine = { ...line, [field]: value };
      
      // If amount or frequency changes, recalculate the derived amounts
      if (field === 'amount' || field === 'frequency') {
        const { weeklyAmount, monthlyAmount, annualAmount } = calculateBillingAmounts(
          updatedLine.amount, 
          updatedLine.frequency
        );
        
        return {
          ...updatedLine,
          weeklyAmount,
          monthlyAmount,
          annualAmount
        };
      }
      
      return updatedLine;
    }));
  }, []);

  return {
    billingLines,
    addBillingLine,
    removeBillingLine,
    updateBillingLine,
    setBillingLines
  };
};
