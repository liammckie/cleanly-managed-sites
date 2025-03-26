
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';
import { calculateBillingAmounts } from '@/lib/utils/billingCalculations';

export const useSiteFormBillingLines = () => {
  const [billingLines, setBillingLines] = useState<BillingLine[]>([
    {
      id: uuidv4(),
      description: 'Cleaning Service',
      amount: 0,
      frequency: 'weekly',
      isRecurring: true,
      onHold: false,
      weeklyAmount: 0,
      monthlyAmount: 0,
      annualAmount: 0
    }
  ]);

  const addBillingLine = () => {
    const newLine: BillingLine = {
      id: uuidv4(),
      description: '',
      amount: 0,
      frequency: 'weekly',
      isRecurring: true,
      onHold: false
    };

    setBillingLines(prevLines => [...prevLines, newLine]);
  };

  const updateBillingLine = (id: string, field: string, value: any) => {
    setBillingLines(prevLines =>
      prevLines.map(line => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value };

          // Special recalculations when amount or frequency changes
          if (field === 'amount' || field === 'frequency') {
            const { weeklyAmount, monthlyAmount, annualAmount } = calculateBillingAmounts(
              updatedLine.amount,
              updatedLine.frequency
            );
            updatedLine.weeklyAmount = weeklyAmount;
            updatedLine.monthlyAmount = monthlyAmount;
            updatedLine.annualAmount = annualAmount;
          }

          return updatedLine;
        }
        return line;
      })
    );
  };

  const removeBillingLine = (id: string) => {
    setBillingLines(prevLines => prevLines.filter(line => line.id !== id));
  };

  return {
    billingLines,
    addBillingLine,
    updateBillingLine,
    removeBillingLine
  };
};
