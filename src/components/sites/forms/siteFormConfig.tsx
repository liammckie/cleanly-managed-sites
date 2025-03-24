
import React from 'react';
import { BasicInformationStep } from './steps/BasicInformationStep';
import { ContactsStep } from './steps';
import { JobSpecificationsStep } from './steps/JobSpecificationsStep';
import { ContractDetailsStep } from './steps/ContractDetailsStep';
import { BillingDetailsStep } from './steps/BillingDetailsStep';
import { ReplenishablesStep } from './steps/ReplenishablesStep';
import { SubcontractorsStep } from './steps/SubcontractorsStep';
import { PeriodicalsStep } from './steps/PeriodicalsStep';
import { SiteFormData } from './siteFormTypes';

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
}

// Define the steps for the site form
export const getSiteFormSteps = (
  formData: SiteFormData,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleNestedChange: (section: string, field: string, value: any) => void,
  handleArrayChange: (field: string, values: any[]) => void,
  handleArrayUpdate: (field: string, index: number, value: any) => void,
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void,
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
  handleFileRemove: (field: string, fileName: string) => void,
  errors: Record<string, string> = {} // Add default empty errors object
): StepConfig[] => [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter the general details about the site',
    component: (
      <BasicInformationStep
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleStatusChange={(status) => handleChange({ target: { name: 'status', value: status } } as any)}
        handleClientChange={(clientId) => handleChange({ target: { name: 'clientId', value: clientId } } as any)}
        setFormData={() => {}} // This will be handled by useSiteForm
      />
    )
  },
  {
    id: 'contacts',
    title: 'Site Contacts',
    description: 'Manage contacts for this site',
    component: (
      <ContactsStep
        formData={formData}
        errors={errors}
        handleContactChange={(index, field, value) => {}}
        addContact={() => {}}
        removeContact={(index) => {}}
      />
    )
  },
  {
    id: 'contract-details',
    title: 'Contract Details',
    description: 'Manage contract information for this site',
    component: (
      <ContractDetailsStep
        formData={formData}
        handleNestedChange={handleNestedChange}
        addContractTerm={addContractTerm}
        updateContractTerm={updateContractTerm}
        removeContractTerm={removeContractTerm}
      />
    )
  },
  {
    id: 'billing-details',
    title: 'Billing Details',
    description: 'Set up billing information for this site',
    component: (
      <BillingDetailsStep
        formData={formData}
        handleNestedChange={handleNestedChange}
        handleDoubleNestedChange={handleDoubleNestedChange}
        addBillingLine={addBillingLine}
        updateBillingLine={updateBillingLine}
        removeBillingLine={removeBillingLine}
      />
    )
  },
  {
    id: 'job-specifications',
    title: 'Job Specifications',
    description: 'Define the job specifications for this site',
    component: (
      <JobSpecificationsStep
        formData={formData}
        handleNestedChange={handleNestedChange}
      />
    )
  },
  {
    id: 'periodicals',
    title: 'Periodical Services',
    description: 'Set up periodical services for this site',
    component: (
      <PeriodicalsStep
        formData={formData}
        handleDoubleNestedChange={handleDoubleNestedChange}
      />
    )
  },
  {
    id: 'supplies-replenishables',
    title: 'Supplies & Replenishables',
    description: 'Manage supplies and replenishables for this site',
    component: (
      <ReplenishablesStep
        formData={formData}
        handleNestedChange={handleNestedChange}
      />
    )
  },
  {
    id: 'subcontractors',
    title: 'Subcontractors',
    description: 'Manage subcontractors for this site',
    component: (
      <SubcontractorsStep
        formData={formData}
        errors={errors}
        handleSubcontractorChange={updateSubcontractor}
        addSubcontractor={addSubcontractor}
        removeSubcontractor={removeSubcontractor}
      />
    )
  }
];
