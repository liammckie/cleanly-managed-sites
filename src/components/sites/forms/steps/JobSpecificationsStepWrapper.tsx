
import React from 'react';
import { JobSpecificationsStep } from './JobSpecificationsStep';

interface JobSpecificationsStepWrapperProps {
  formData: any;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export function JobSpecificationsStepWrapper({ formData, handleNestedChange }: JobSpecificationsStepWrapperProps) {
  return (
    <JobSpecificationsStep 
      formData={formData}
      handleNestedChange={handleNestedChange}
    />
  );
}
