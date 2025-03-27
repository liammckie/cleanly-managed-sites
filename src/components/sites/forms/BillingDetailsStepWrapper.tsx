
import React from 'react';
import { BillingDetailsStep } from './steps/BillingDetailsStep';
import { useSiteFormBillingLines } from '@/hooks/useSiteFormBillingLines';

interface BillingDetailsStepWrapperProps {
  formData: any;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange?: (section: string, subsection: string, field: string, value: any) => void;
}

export function BillingDetailsStepWrapper({ 
  formData, 
  handleNestedChange,
  handleDoubleNestedChange
}: BillingDetailsStepWrapperProps) {
  // Use the billing lines hook to manage billing lines
  const { billingLines, addBillingLine, updateBillingLine, removeBillingLine } = useSiteFormBillingLines();
  
  // Ensure billingDetails has all the required properties
  const billingDetails = formData.billingDetails || {
    billingLines: [],
    useClientInfo: false,
    serviceDeliveryType: 'direct',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Australia'
    }
  };
  
  const wrappedFormData = {
    ...formData,
    billingDetails
  };
  
  return (
    <BillingDetailsStep 
      formData={wrappedFormData}
      handleNestedChange={handleNestedChange}
      handleDoubleNestedChange={handleDoubleNestedChange}
      addBillingLine={addBillingLine}
      updateBillingLine={updateBillingLine}
      removeBillingLine={removeBillingLine}
    />
  );
}
