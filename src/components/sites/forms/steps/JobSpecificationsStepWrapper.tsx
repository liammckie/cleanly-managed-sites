
import React from 'react';
import { JobSpecificationsStep } from './JobSpecificationsStep';
import { adaptJobSpecifications } from '@/utils/typeAdapters';

interface JobSpecificationsStepWrapperProps {
  formData: any;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export function JobSpecificationsStepWrapper({ 
  formData, 
  handleNestedChange
}: JobSpecificationsStepWrapperProps) {
  // Ensure jobSpecifications has all the required properties using our adapter
  const jobSpecifications = formData.jobSpecifications ? 
    adaptJobSpecifications(formData.jobSpecifications) : 
    adaptJobSpecifications({});
  
  const wrappedFormData = {
    ...formData,
    jobSpecifications
  };
  
  return (
    <JobSpecificationsStep 
      formData={wrappedFormData}
      handleNestedChange={handleNestedChange}
    />
  );
}
