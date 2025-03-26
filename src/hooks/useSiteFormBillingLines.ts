
import { useState, useCallback } from 'react';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';
import { v4 as uuidv4 } from 'uuid';

export function useSiteFormBillingLines() {
  const [billingLines, setBillingLines] = useState<BillingLine[]>([]);

  // Add a new billing line
  const addBillingLine = useCallback(() => {
    const newLine: BillingLine = {
      id: uuidv4(),
      description: '',
      amount: 0,
      frequency: 'monthly',
      is_recurring: true, // Use snake_case for DB compatibility
      on_hold: false,
      // Add camelCase aliases for convenience
      isRecurring: true,
      onHold: false
    };
    setBillingLines((prev) => [...prev, newLine]);
  }, []);

  // Update an existing billing line
  const updateBillingLine = useCallback((id: string, field: string, value: any) => {
    setBillingLines((prev) =>
      prev.map((line) => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value };
          
          // Sync snake_case and camelCase properties
          if (field === 'is_recurring') {
            updatedLine.isRecurring = value;
          } else if (field === 'isRecurring') {
            updatedLine.is_recurring = value;
          } else if (field === 'on_hold') {
            updatedLine.onHold = value;
          } else if (field === 'onHold') {
            updatedLine.on_hold = value;
          } else if (field === 'weekly_amount') {
            updatedLine.weeklyAmount = value;
          } else if (field === 'weeklyAmount') {
            updatedLine.weekly_amount = value;
          } else if (field === 'monthly_amount') {
            updatedLine.monthlyAmount = value;
          } else if (field === 'monthlyAmount') {
            updatedLine.monthly_amount = value;
          } else if (field === 'annual_amount') {
            updatedLine.annualAmount = value;
          } else if (field === 'annualAmount') {
            updatedLine.annual_amount = value;
          }
          
          return updatedLine;
        }
        return line;
      })
    );
  }, []);

  // Remove a billing line
  const removeBillingLine = useCallback((id: string) => {
    setBillingLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  return {
    billingLines,
    addBillingLine,
    updateBillingLine,
    removeBillingLine,
    setBillingLines
  };
}
