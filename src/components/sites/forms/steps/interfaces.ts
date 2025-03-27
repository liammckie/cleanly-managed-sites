
import { SiteFormData } from '../types/siteFormData';
import { BillingContact, BillingLine } from '../types/billingTypes';
import { SecurityDetails } from '../types/securityTypes';
import { ChangeEvent } from 'react';

export interface BasicInformationStepProps {
  formData: SiteFormData;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleClientChange: (clientId: string) => void;
}

export interface ContactsStepProps {
  contacts: SiteFormData['contacts'];
}

export interface BillingDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  addBillingLine: () => void;
  updateBillingLine: (id: string, field: string, value: any) => void;
  removeBillingLine: (id: string) => void;
}

export interface ContractDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
  addContractTerm: () => void;
  updateContractTerm: (index: number, field: string, value: any) => void;
  removeContractTerm: (index: number) => void;
}

export interface JobSpecificationsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export interface PeriodicalsStepProps {
  formData: SiteFormData;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
}

export interface SubcontractorsStepProps {
  subcontractors: any[];
  hasSubcontractors: boolean;
}

export interface ReplenishablesStepProps {
  replenishables: {
    stock?: any[];
    supplies?: any[];
    notes?: string;
  };
}

export interface SecurityStepProps {
  securityDetails: SecurityDetails;
}

export interface StepConfig {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}
