
import React from 'react';
import { BillingDetailsStep } from './BillingDetailsStep';
import { adaptBillingDetails } from '@/utils/typeAdapters';

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
  // Ensure billingDetails has all the required properties using our adapter
  const billingDetails = adaptBillingDetails(formData.billingDetails);
  
  const wrappedFormData = {
    ...formData,
    billingDetails
  };
  
  return (
    <BillingDetailsStep 
      formData={wrappedFormData}
      handleNestedChange={handleNestedChange}
      handleDoubleNestedChange={handleDoubleNestedChange}
    />
  );
}
