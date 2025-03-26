
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
      isRecurring: true,
      on_hold: false  // Added this required field
    };
    setBillingLines((prev) => [...prev, newLine]);
  }, []);

  // Update an existing billing line
  const updateBillingLine = useCallback((id: string, field: string, value: any) => {
    setBillingLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, [field]: value } : line
      )
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
