
import React from 'react';
import { PeriodicalsStep } from './PeriodicalsStep';
import { PeriodicalsStepProps } from './interfaces';

interface PeriodicalsStepWrapperProps {
  formData: any;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
}

export function PeriodicalsStepWrapper({ 
  formData, 
  handleNestedChange,
  handleDoubleNestedChange
}: PeriodicalsStepWrapperProps) {
  // Ensure periodicals exists in formData
  const periodicals = formData.periodicals || {};
  
  const wrappedFormData = {
    ...formData,
    periodicals
  };
  
  const periodicalsProps: PeriodicalsStepProps = {
    formData: wrappedFormData,
    handleDoubleNestedChange
  };
  
  return <PeriodicalsStep {...periodicalsProps} />;
}
