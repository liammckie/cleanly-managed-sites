
import React from 'react';
import { SiteFormData } from './siteFormTypes';
import { BasicInformationStep } from './steps/BasicInformationStep';
import { SubcontractorsStep } from './steps/SubcontractorsStep';
import { PeriodicalsStep } from './steps/PeriodicalsStep';
import { JobSpecificationsStep } from './steps/JobSpecificationsStep';
import { ReplenishablesStep } from './steps/ReplenishablesStep';
import { SecurityStep } from './steps/SecurityStep';
import { ContractDetailsStep } from './steps/ContractDetailsStep';
import { BillingDetailsStep } from './steps/BillingDetailsStep';
import { ReviewStep } from './steps/ReviewStep';
import { SiteStatus } from '../SiteCard';

export type StepConfigItem = {
  title: string;
  description: string;
  component: React.ReactNode;
};

export type GetStepsConfigProps = {
  formData: SiteFormData;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: SiteStatus) => void;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  handleDoubleNestedChange: (section: keyof SiteFormData, subsection: string, field: string, value: any) => void;
  handleSubcontractorChange: (index: number, field: string, value: string) => void;
  handleStockChange: (index: number, value: string) => void;
  addSubcontractor: () => void;
  removeSubcontractor: (index: number) => void;
};

export const getStepsConfig = ({
  formData,
  errors,
  handleChange,
  handleStatusChange,
  handleNestedChange,
  handleDoubleNestedChange,
  handleSubcontractorChange,
  handleStockChange,
  addSubcontractor,
  removeSubcontractor
}: GetStepsConfigProps): StepConfigItem[] => [
  {
    title: "Basic Information",
    description: "Enter the basic details about the site.",
    component: (
      <BasicInformationStep 
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleStatusChange={handleStatusChange}
      />
    )
  },
  {
    title: "Contract Details",
    description: "Add contract information for this site.",
    component: (
      <ContractDetailsStep 
        formData={formData}
        handleNestedChange={handleNestedChange}
      />
    )
  },
  {
    title: "Billing Details",
    description: "Add billing information for this site.",
    component: (
      <BillingDetailsStep 
        formData={formData}
        handleNestedChange={handleNestedChange}
      />
    )
  },
  {
    title: "Subcontractor Details",
    description: "Add information about the subcontractors for this site.",
    component: (
      <SubcontractorsStep 
        formData={formData}
        errors={errors}
        handleSubcontractorChange={handleSubcontractorChange}
        addSubcontractor={addSubcontractor}
        removeSubcontractor={removeSubcontractor}
      />
    )
  },
  {
    title: "Periodical Inclusions",
    description: "Add information about periodical cleaning services.",
    component: (
      <PeriodicalsStep 
        formData={formData}
        handleDoubleNestedChange={handleDoubleNestedChange}
      />
    )
  },
  {
    title: "Job Specifications",
    description: "Add details about the cleaning job requirements.",
    component: (
      <JobSpecificationsStep 
        formData={formData}
        handleNestedChange={handleNestedChange}
      />
    )
  },
  {
    title: "Replenishables & Stock",
    description: "Add information about replenishable stock items.",
    component: (
      <ReplenishablesStep 
        formData={formData}
        handleStockChange={handleStockChange}
        handleNestedChange={handleNestedChange}
      />
    )
  },
  {
    title: "Security Details",
    description: "Add security and access information for the site.",
    component: (
      <SecurityStep 
        formData={formData}
        handleNestedChange={handleNestedChange}
      />
    )
  },
  {
    title: "Review & Submit",
    description: "Review your information before creating the site.",
    component: (
      <ReviewStep formData={formData} />
    )
  }
];
