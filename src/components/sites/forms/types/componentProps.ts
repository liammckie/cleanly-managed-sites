
import { SiteFormData } from './siteFormData';
import { SecurityDetails } from './securityTypes';
import { BillingContact, BillingLine } from './billingTypes';
import { ContractTerm } from './contractTypes';

export interface BasicInformationStepProps {
  formData: SiteFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClientChange: (clientId: string) => void;
}

export interface ContactsStepProps {
  contacts: SiteFormData['contacts'];
  addContact?: () => void;
  updateContact?: (index: number, field: string, value: any) => void;
  removeContact?: (index: number) => void;
  setPrimaryContact?: (index: number) => void;
}

export interface SubcontractorsStepProps {
  subcontractors: any[];
  addSubcontractor?: () => void;
  updateSubcontractor?: (index: number, field: string, value: any) => void;
  removeSubcontractor?: (index: number) => void;
}

export interface SecurityStepProps {
  securityDetails: SecurityDetails;
  handleSecurityChange?: (field: string, value: any) => void;
}

export interface ReplenishablesStepProps {
  replenishables: {
    stock?: any[];
    supplies?: any[];
    notes?: string;
  };
  addReplenishableStock?: () => void;
  addReplenishableSupplies?: () => void;
  updateReplenishable?: (type: 'stock' | 'supplies', index: number, field: string, value: any) => void;
  removeReplenishable?: (type: 'stock' | 'supplies', index: number) => void;
}

export interface BillingDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange?: (section: string, subsection: string, field: string, value: any) => void;
  addBillingLine?: () => void;
  updateBillingLine?: (id: string, field: string, value: any) => void;
  removeBillingLine?: (id: string) => void;
}

export interface ContractDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  addContractTerm?: (term: ContractTerm) => void;
  updateContractTerm?: (index: number, field: string, value: any) => void;
  removeContractTerm?: (index: number) => void;
  addAdditionalContract?: () => void;
  updateAdditionalContract?: (index: number, field: string, value: any) => void;
  removeAdditionalContract?: (index: number) => void;
}

export interface PeriodicalsStepProps {
  formData: SiteFormData;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
}
