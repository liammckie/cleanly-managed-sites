
import { SiteFormData } from "./siteFormData";
import { BillingContact } from "./billingTypes";

export interface SiteFormHandlers {
  formData: SiteFormData;
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isSubmitting: boolean;
  handleSubmit: (siteId?: string) => Promise<{id: string}>;
  handleClientChange: (clientId: string) => void;
  loadSiteData: (siteData: any) => void;
  loadClientData: (clientId: string) => void;
  
  // Form field handlers
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleNestedChange?: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange?: (section: string, subsection: string, field: string, value: any) => void;
  
  // Subcontractor handlers
  updateSubcontractor?: (index: number, field: string, value: any) => void;
  addSubcontractor?: () => void;
  removeSubcontractor?: (index: number) => void;
  
  // Replenishable handlers
  addReplenishable?: () => void;
  updateReplenishable?: (index: number, field: string, value: any) => void;
  removeReplenishable?: (index: number) => void;
  
  // Billing handlers
  addBillingLine?: () => void;
  updateBillingLine?: (id: string, field: string, value: any) => void;
  removeBillingLine?: (id: string) => void;
  addBillingContact?: (contact: BillingContact) => void;
  
  // Contract handlers
  addContractTerm?: () => void;
  updateContractTerm?: (index: number, field: string, value: any) => void;
  removeContractTerm?: (index: number) => void;
  
  // Additional contract handlers
  addAdditionalContract?: () => void;
  updateAdditionalContract?: (index: number, field: string, value: any) => void;
  removeAdditionalContract?: (index: number) => void;
  
  // Validation
  validateStep?: (step: number) => boolean;
  errors?: Record<string, string>;
  getCompletionPercentage?: () => number;
  
  // React Hook Form integration
  form?: any;
}
