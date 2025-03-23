
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
import { ContactsStep } from './steps/ContactsStep';
import { ReviewStep } from './steps/ReviewStep';
import { SiteStatus } from '../SiteCard';
import { ContactRecord } from '@/lib/types';

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
  handleClientChange: (clientId: string) => void;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  handleDoubleNestedChange: (section: keyof SiteFormData, subsection: string, field: string, value: any) => void;
  handleSubcontractorChange: (index: number, field: string, value: string) => void;
  handleStockChange: (index: number, value: string) => void;
  addSubcontractor: () => void;
  removeSubcontractor: (index: number) => void;
  // Contact handlers
  handleContactChange: (index: number, field: keyof ContactRecord, value: any) => void;
  addContact: () => void;
  removeContact: (index: number) => void;
  addExistingContact?: (contactId: string) => void;
  // Billing lines handlers
  addBillingLine?: () => void;
  removeBillingLine?: (index: number) => void;
  updateBillingLine?: (index: number, field: string, value: any) => void;
  // Contract terms handlers
  addContractTerm?: () => void;
  removeContractTerm?: (index: number) => void;
  updateContractTerm?: (index: number, field: string, value: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>;
};

export const getStepsConfig = ({
  formData,
  errors,
  handleChange,
  handleStatusChange,
  handleClientChange,
  handleNestedChange,
  handleDoubleNestedChange,
  handleSubcontractorChange,
  handleStockChange,
  addSubcontractor,
  removeSubcontractor,
  handleContactChange,
  addContact,
  removeContact,
  addExistingContact,
  addBillingLine,
  removeBillingLine,
  updateBillingLine,
  addContractTerm,
  removeContractTerm,
  updateContractTerm,
  setFormData
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
        handleClientChange={handleClientChange}
        setFormData={setFormData}
      />
    )
  },
  {
    title: "Contacts",
    description: "Add contacts for this site.",
    component: (
      <ContactsStep 
        formData={formData}
        errors={errors}
        handleContactChange={handleContactChange}
        addContact={addContact}
        removeContact={removeContact}
        addExistingContact={addExistingContact}
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
        addContractTerm={addContractTerm}
        removeContractTerm={removeContractTerm}
        updateContractTerm={updateContractTerm}
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
        handleDoubleNestedChange={handleDoubleNestedChange}
        addBillingLine={addBillingLine}
        removeBillingLine={removeBillingLine}
        updateBillingLine={updateBillingLine}
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
