
import { SiteFormData } from './siteFormData';
import { BillingContact } from './billingTypes';
import { ContractDetails } from './contractTypes';
import { ReactChangeEvent } from '@/types/events';

export interface SiteFormHandlers {
  formData: SiteFormData;
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isSubmitting: boolean;
  handleSubmit: (siteId?: string) => Promise<any>;
  handleClientChange: (clientId: string) => void;
  loadSiteData: (siteData: any) => void;
  loadClientData: (clientId: string) => void;
  // Form field handlers
  handleChange: (e: ReactChangeEvent) => void;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  // Contact handlers
  addBillingContact: (contact: BillingContact) => void;
  updateBillingContact: (index: number, field: string, value: any) => void;
  removeBillingContact: (index: number) => void;
  // Subcontractor handlers
  addSubcontractor: () => void;
  updateSubcontractor: (index: number, field: string, value: any) => void;
  removeSubcontractor: (index: number) => void;
  // Replenishable handlers
  addReplenishable: (type: string) => void;
  updateReplenishable: (type: string, index: number, field: string, value: any) => void;
  removeReplenishable: (type: string, index: number) => void;
  // Billing line handlers
  addBillingLine: () => void;
  updateBillingLine: (id: string, field: string, value: any) => void;
  removeBillingLine: (id: string) => void;
  // Contract term handlers
  addContractTerm: () => void;
  updateContractTerm: (index: number, field: string, value: any) => void;
  removeContractTerm: (index: number) => void;
  // Additional contract handlers
  addAdditionalContract: () => void;
  updateAdditionalContract: (index: number, field: string, value: any) => void;
  removeAdditionalContract: (index: number) => void;
  // Validation
  validateStep: (step: number) => boolean;
  getCompletionPercentage: () => number;
  errors: Record<string, string>;
}
