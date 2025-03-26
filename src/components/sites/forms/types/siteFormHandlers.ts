
import { SiteFormData } from './siteFormData';

export interface SiteFormHandlers {
  formData: SiteFormData;
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>;
  step?: number;
  setStep?: (step: number) => void;
  errors?: Record<string, string>;
  handleChange?: (field: keyof SiteFormData, value: any) => void;
  handleNestedChange?: (section: keyof SiteFormData, field: string, value: any) => void;
  handleDoubleNestedChange?: (section: keyof SiteFormData, subsection: string, field: string, value: any) => void;
  handleClientChange?: (clientId: string) => void;
  loadSiteData?: (siteId: string) => Promise<void>;
  loadClientData?: (clientId: string) => Promise<void>;
  validateStep?: (stepIndex: number) => boolean;
  getCompletionPercentage?: () => number;
  handleSubmit?: () => Promise<void>;
  form?: any;
  
  // Billing lines handlers
  addBillingLine?: () => void;
  updateBillingLine?: (id: string, field: string, value: any) => void;
  removeBillingLine?: (id: string) => void;
  
  // Subcontractor handlers
  addSubcontractor?: () => void;
  updateSubcontractor?: (index: number, field: string, value: any) => void;
  removeSubcontractor?: (index: number) => void;
  
  // Replenishable handlers
  addReplenishable?: (type: 'stock' | 'supplies') => void;
  updateReplenishable?: (type: 'stock' | 'supplies', index: number, field: string, value: any) => void;
  removeReplenishable?: (type: 'stock' | 'supplies', index: number) => void;
  
  // Contract term handlers
  addContractTerm?: () => void;
  updateContractTerm?: (index: number, field: string, value: any) => void;
  removeContractTerm?: (index: number) => void;
  
  // Additional contract handlers
  addAdditionalContract?: () => void;
  updateAdditionalContract?: (index: number, field: string, value: any) => void;
  removeAdditionalContract?: (index: number) => void;
}
