
import React from 'react';
import { PeriodicalsStep } from './PeriodicalsStep';

interface PeriodicalsStepWrapperProps {
  formData: any;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
}

export function PeriodicalsStepWrapper({ formData, handleNestedChange, handleDoubleNestedChange }: PeriodicalsStepWrapperProps) {
  return (
    <PeriodicalsStep 
      formData={formData}
      handleDoubleNestedChange={handleDoubleNestedChange}
    />
  );
}
