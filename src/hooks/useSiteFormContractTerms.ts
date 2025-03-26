
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { ContractTerm } from '@/components/sites/forms/types/contractTypes';

export const useSiteFormContractTerms = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  // Add a new contract term
  const addContractTerm = () => {
    const newTerm: ContractTerm = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      renewalTerms: '',
      terminationPeriod: '',
      autoRenew: false
    };
    
    setFormData(prev => {
      const updatedContractDetails = { 
        ...prev.contractDetails,
        terms: [...(prev.contractDetails?.terms || []), newTerm] 
      };
      
      return {
        ...prev,
        contractDetails: updatedContractDetails
      };
    });
  };
  
  // Update a contract term field
  const updateContractTerm = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const terms = [...(prev.contractDetails?.terms || [])];
      terms[index] = { ...terms[index], [field]: value };
      
      const updatedContractDetails = { 
        ...prev.contractDetails,
        terms
      };
      
      return {
        ...prev,
        contractDetails: updatedContractDetails
      };
    });
  };
  
  // Remove a contract term
  const removeContractTerm = (index: number) => {
    setFormData(prev => {
      const terms = [...(prev.contractDetails?.terms || [])];
      terms.splice(index, 1);
      
      const updatedContractDetails = { 
        ...prev.contractDetails,
        terms
      };
      
      return {
        ...prev,
        contractDetails: updatedContractDetails
      };
    });
  };
  
  return {
    addContractTerm,
    updateContractTerm,
    removeContractTerm
  };
};
