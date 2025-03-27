
import React from 'react';
import { SiteFormData } from './types/siteFormData';

interface SiteFormProps {
  formData: SiteFormData;
  step: number;
  errors: Record<string, string>;
  handleChange: (field: keyof SiteFormData, value: any) => void;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  handleDoubleNestedChange: (section: keyof SiteFormData, subsection: string, field: string, value: any) => void;
  handleClientChange: (clientId: string) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  
  // Billing handlers
  addBillingLine: () => void;
  updateBillingLine: (id: string, field: string, value: any) => void;
  removeBillingLine: (id: string) => void;
  
  // Subcontractor handlers
  addSubcontractor: () => void;
  updateSubcontractor: (index: number, field: string, value: any) => void;
  removeSubcontractor: (index: number) => void;
  
  // Replenishable handlers
  addReplenishableStock: () => void;
  addReplenishableSupplies: () => void;
  updateReplenishable: (type: 'stock' | 'supplies', index: number, field: string, value: any) => void;
  removeReplenishable: (type: 'stock' | 'supplies', index: number) => void;
  
  // Contract term handlers
  addContractTerm: () => void;
  updateContractTerm: (index: number, field: string, value: any) => void;
  removeContractTerm: (index: number) => void;
  
  // Additional contract handlers
  addAdditionalContract: () => void;
  updateAdditionalContract: (index: number, field: string, value: any) => void;
  removeAdditionalContract: (index: number) => void;
}

export function SiteForm(props: SiteFormProps) {
  // Render the appropriate step based on the current step number
  const renderStep = () => {
    switch (props.step) {
      case 0:
        return <div>Basic Info Step</div>;
      case 1:
        return <div>Contacts Step</div>;
      case 2:
        return <div>Contract Step</div>;
      case 3:
        return <div>Billing Step</div>;
      case 4:
        return <div>Subcontractors Step</div>;
      case 5:
        return <div>Specifications Step</div>;
      case 6:
        return <div>Additional Step</div>;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div>
      {renderStep()}
    </div>
  );
}
