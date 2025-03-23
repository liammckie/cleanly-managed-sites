
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export const useSiteFormAdditionalContracts = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  // Add new additional contract
  const addAdditionalContract = () => {
    const newContract: ContractDetails = {
      startDate: '',
      endDate: '',
      contractNumber: '',
      renewalTerms: '',
      terminationPeriod: '',
      contractType: 'cleaning',
      terms: []
    };
    
    setFormData(prev => ({
      ...prev,
      additionalContracts: [...(prev.additionalContracts || []), newContract]
    }));
  };
  
  // Update additional contract
  const updateAdditionalContract = (index: number, field: string, value: any) => {
    if (!formData.additionalContracts) return;
    
    const updatedContracts = [...formData.additionalContracts];
    
    updatedContracts[index] = {
      ...updatedContracts[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      additionalContracts: updatedContracts
    }));
  };
  
  // Remove additional contract
  const removeAdditionalContract = (index: number) => {
    if (!formData.additionalContracts) return;
    
    const updatedContracts = [...formData.additionalContracts];
    updatedContracts.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      additionalContracts: updatedContracts
    }));
  };
  
  return {
    addAdditionalContract,
    updateAdditionalContract,
    removeAdditionalContract
  };
};
