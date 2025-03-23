
import React, { ReactNode, ChangeEvent } from 'react';
import { BasicInformationStep } from './steps/BasicInformationStep';
import { ContactsStep } from './steps/ContactsStep';
import { ContractDetailsStep } from './steps/ContractDetailsStep';
import { JobSpecificationsStep } from './steps/JobSpecificationsStep';
import { PeriodicalsStep } from './steps/PeriodicalsStep';
import { ReplenishablesStep } from './steps/ReplenishablesStep';
import { SecurityStep } from './steps/SecurityStep';
import { SubcontractorsStep } from './steps/SubcontractorsStep';
import { ReviewStep } from './steps/ReviewStep';
import { BillingDetailsStep } from './steps/BillingDetailsStep';
import { SiteFormData } from './siteFormTypes';

export type StepConfig = {
  id: string;
  title: string;
  description?: string;
  component: ReactNode;
};

export const getSiteFormSteps = (
  formData: SiteFormData,
  handleChange: (field: string, value: any) => void,
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void,
  handleArrayChange: (field: string, values: any[]) => void,
  handleArrayUpdate: (field: string, index: number, value: any) => void,
  handleDoubleNestedChange: (section: keyof SiteFormData, subsection: string, field: string, value: any) => void,
  addArrayItem: (field: string) => void,
  removeArrayItem: (field: string, index: number) => void,
  addSubcontractor: () => void,
  updateSubcontractor: (index: number, field: string, value: any) => void,
  removeSubcontractor: (index: number) => void,
  addReplenishable: () => void,
  updateReplenishable: (index: number, field: string, value: any) => void,
  removeReplenishable: (index: number) => void,
  addBillingLine: () => void,
  updateBillingLine: (id: string, field: string, value: any) => void,
  removeBillingLine: (id: string) => void,
  addContractTerm: () => void,
  updateContractTerm: (index: number, field: string, value: any) => void,
  removeContractTerm: (index: number) => void,
  addAdditionalContract: () => void,
  updateAdditionalContract: (index: number, field: string, value: any) => void,
  removeAdditionalContract: (index: number) => void,
  handleFileUpload: (field: string, file: File) => void,
  handleFileRemove: (field: string, fileName: string) => void
): StepConfig[] => {
  // Helper function to convert our handleChange to expected event handler
  const createChangeHandler = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(field, e.target.value);
  };

  return [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Enter the basic details of the site',
      component: (
        <BasicInformationStep
          formData={formData}
          handleChange={createChangeHandler}
          handleNestedChange={handleNestedChange}
          handleArrayChange={handleArrayChange}
          handleArrayUpdate={handleArrayUpdate}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
        />
      ),
    },
    {
      id: 'contacts',
      title: 'Contacts',
      description: 'Manage contacts for this site',
      component: (
        <ContactsStep
          formData={formData}
        />
      ),
    },
    {
      id: 'contract-details',
      title: 'Contract Details',
      description: 'Manage contract details and terms',
      component: (
        <ContractDetailsStep
          formData={formData}
          handleNestedChange={handleNestedChange}
          handleDoubleNestedChange={handleDoubleNestedChange}
          addContractTerm={addContractTerm}
          updateContractTerm={updateContractTerm}
          removeContractTerm={removeContractTerm}
          addAdditionalContract={addAdditionalContract}
          updateAdditionalContract={updateAdditionalContract}
          removeAdditionalContract={removeAdditionalContract}
        />
      ),
    },
    {
      id: 'billing-details',
      title: 'Billing Details',
      description: 'Manage billing information',
      component: (
        <BillingDetailsStep
          formData={formData}
          handleNestedChange={handleNestedChange}
          handleDoubleNestedChange={handleDoubleNestedChange}
          addBillingLine={addBillingLine}
          removeBillingLine={removeBillingLine}
          updateBillingLine={updateBillingLine}
        />
      ),
    },
    {
      id: 'job-specs',
      title: 'Job Specifications',
      description: 'Enter job specifications and requirements',
      component: (
        <JobSpecificationsStep
          formData={formData}
          handleNestedChange={handleNestedChange}
          handleFileUpload={handleFileUpload}
          handleFileRemove={handleFileRemove}
        />
      ),
    },
    {
      id: 'periodicals',
      title: 'Periodicals',
      description: 'Manage periodic tasks and schedules',
      component: (
        <PeriodicalsStep
          formData={formData}
          handleNestedChange={handleNestedChange}
        />
      ),
    },
    {
      id: 'replenishables',
      title: 'Replenishables',
      description: 'Manage replenishable supplies',
      component: (
        <ReplenishablesStep
          formData={formData}
          handleNestedChange={handleNestedChange}
          addReplenishable={addReplenishable}
          updateReplenishable={updateReplenishable}
          removeReplenishable={removeReplenishable}
        />
      ),
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Manage security details',
      component: (
        <SecurityStep
          formData={formData}
          handleNestedChange={handleNestedChange}
        />
      ),
    },
    {
      id: 'subcontractors',
      title: 'Subcontractors',
      description: 'Manage subcontractors for this site',
      component: (
        <SubcontractorsStep
          formData={formData}
          handleNestedChange={handleNestedChange}
          addSubcontractor={addSubcontractor}
          updateSubcontractor={updateSubcontractor}
          removeSubcontractor={removeSubcontractor}
        />
      ),
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Review site information before submission',
      component: (
        <ReviewStep
          formData={formData}
        />
      ),
    },
  ];
};
