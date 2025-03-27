
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
  return (
    <JobSpecificationsStep
      formData={formData}
      handleNestedChange={handleNestedChange}
    />
  );
}
