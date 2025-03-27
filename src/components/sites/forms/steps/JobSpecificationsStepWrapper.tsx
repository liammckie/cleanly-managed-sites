
import React from 'react';
import { JobSpecificationsStep } from './JobSpecificationsStep';
import { SiteFormData } from '../types/siteFormData';

interface JobSpecificationsStepWrapperProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export function JobSpecificationsStepWrapper({ 
  formData, 
  handleNestedChange
}: JobSpecificationsStepWrapperProps) {
  // Pass the props to the underlying component with explicit typing
  return (
    <JobSpecificationsStep
      formData={formData}
      handleNestedChange={handleNestedChange as any}
    />
  );
}
