import { useState } from 'react';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';
import { BillingFrequency } from '@/lib/types/commonTypes';
import { v4 as uuidv4 } from 'uuid';

export type BillingLineFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export function useSiteFormBillingLines(formData: SiteFormData, setFormData: (data: SiteFormData) => void) {
  const updateBillingLine = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      billingDetails: {
        ...formData.billingDetails,
        billingLines: formData.billingDetails?.billingLines?.map(line =>
          line.id === id ? { ...line, [field]: value } : line
        )
      }
    });
  };

  const removeBillingLine = (id: string) => {
    setFormData({
      ...formData,
      billingDetails: {
        ...formData.billingDetails,
        billingLines: formData.billingDetails?.billingLines?.filter(line => line.id !== id)
      }
    });
  };

  const calculateBillingTotals = () => {
    if (!formData.billingDetails?.billingLines) return { weekly: 0, monthly: 0, annual: 0 };

    let weekly = 0;
    let monthly = 0;
    let annual = 0;

    formData.billingDetails.billingLines.forEach(line => {
      switch (line.frequency) {
        case 'weekly':
          weekly += line.amount;
          break;
        case 'monthly':
          monthly += line.amount;
          break;
        case 'quarterly':
          monthly += line.amount / 3;
          break;
        case 'annually':
          annual += line.amount;
          break;
        case 'one-time':
          // One-time billing lines don't contribute to recurring totals
          break;
        case 'fortnightly':
          weekly += line.amount / 2;
          break;
        default:
          break;
      }
    });

    annual = monthly * 12;
    weekly = annual / 52;

    return { weekly, monthly, annual };
  };

  const addBillingLine = () => {
    const newLine: BillingLine = {
      id: uuidv4(),
      description: '',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true
    };

    setFormData({
      ...formData,
      billingDetails: {
        ...formData.billingDetails,
        billingLines: [
          ...(formData.billingDetails?.billingLines || []),
          newLine
        ]
      }
    });
  };

  return {
    addBillingLine,
    updateBillingLine,
    removeBillingLine,
    calculateBillingTotals
  };
}
