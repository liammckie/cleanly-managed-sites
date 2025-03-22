
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { ContractTerm } from '@/components/sites/forms/types/contractTypes';

export const useSiteFormContractTerms = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>,
  errors: Record<string, string>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  // Add new contract term
  const addContractTerm = () => {
    const newContractTerm: ContractTerm = {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      renewalTerms: '',
      terminationPeriod: '',
      autoRenew: false
    };
    
    const updatedTerms = [...(formData.contractDetails.terms || []), newContractTerm];
    
    setFormData(prev => ({
      ...prev,
      contractDetails: {
        ...prev.contractDetails,
        terms: updatedTerms
      }
    }));
  };
  
  // Remove a contract term
  const removeContractTerm = (index: number) => {
    const updatedTerms = [...(formData.contractDetails.terms || [])];
    updatedTerms.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      contractDetails: {
        ...prev.contractDetails,
        terms: updatedTerms
      }
    }));
    
    // Remove any errors related to this term
    const updatedErrors = { ...errors };
    Object.keys(updatedErrors).forEach(key => {
      if (key.startsWith(`contractDetails.terms[${index}]`)) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };
  
  // Update contract term field
  const updateContractTerm = (index: number, field: keyof ContractTerm, value: any) => {
    const updatedTerms = [...(formData.contractDetails.terms || [])];
    
    updatedTerms[index] = {
      ...updatedTerms[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      contractDetails: {
        ...prev.contractDetails,
        terms: updatedTerms
      }
    }));
    
    // Clear error when field is filled
    const errorKey = `contractDetails.terms[${index}].${field}`;
    if (errors[errorKey] && (typeof value === 'string' ? value.trim() : value)) {
      const updatedErrors = { ...errors };
      delete updatedErrors[errorKey];
      setErrors(updatedErrors);
    }
  };
  
  return {
    addContractTerm,
    removeContractTerm,
    updateContractTerm
  };
};
