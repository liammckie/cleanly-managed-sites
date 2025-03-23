
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { BillingLine, BillingFrequency } from '@/components/sites/forms/types/billingTypes';
import { calculateBillingAmounts } from '@/lib/utils/billingCalculations';
import { v4 as uuidv4 } from 'uuid';

export const useSiteFormBillingLines = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>,
  errors: Record<string, string>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  // Add new billing line
  const addBillingLine = () => {
    const newBillingLine: BillingLine = {
      id: uuidv4(),
      description: '',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true,
      weeklyAmount: 0,
      monthlyAmount: 0,
      annualAmount: 0
    };
    
    const updatedBillingLines = [...(formData.billingDetails.billingLines || []), newBillingLine];
    
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: updatedBillingLines
      }
    }));
  };
  
  // Remove a billing line
  const removeBillingLine = (index: number) => {
    const updatedBillingLines = [...(formData.billingDetails.billingLines || [])];
    updatedBillingLines.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: updatedBillingLines
      }
    }));
    
    // Remove any errors related to this billing line
    const updatedErrors = { ...errors };
    Object.keys(updatedErrors).forEach(key => {
      if (key.startsWith(`billingDetails.billingLines[${index}]`)) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };
  
  // Update billing line field
  const updateBillingLine = (index: number, field: keyof BillingLine, value: any) => {
    const updatedBillingLines = [...(formData.billingDetails.billingLines || [])];
    
    updatedBillingLines[index] = {
      ...updatedBillingLines[index],
      [field]: value
    };
    
    // If amount or frequency is updated, recalculate the weekly, monthly and annual amounts
    if (field === 'amount' || field === 'frequency') {
      const { weeklyAmount, monthlyAmount, annualAmount } = calculateBillingAmounts(
        typeof value === 'number' && field === 'amount' ? value : updatedBillingLines[index].amount,
        field === 'frequency' ? value as BillingFrequency : updatedBillingLines[index].frequency as BillingFrequency
      );
      
      updatedBillingLines[index].weeklyAmount = weeklyAmount;
      updatedBillingLines[index].monthlyAmount = monthlyAmount;
      updatedBillingLines[index].annualAmount = annualAmount;
    }
    
    setFormData(prev => ({
      ...prev,
      billingDetails: {
        ...prev.billingDetails,
        billingLines: updatedBillingLines
      }
    }));
    
    // Clear error when field is filled
    const errorKey = `billingDetails.billingLines[${index}].${field}`;
    if (errors[errorKey] && (typeof value === 'string' ? value.trim() : value)) {
      const updatedErrors = { ...errors };
      delete updatedErrors[errorKey];
      setErrors(updatedErrors);
    }
  };
  
  return {
    addBillingLine,
    removeBillingLine,
    updateBillingLine
  };
};
