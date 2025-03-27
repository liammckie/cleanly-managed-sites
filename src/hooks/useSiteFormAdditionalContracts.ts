
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

export const useSiteFormAdditionalContracts = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  // Add a new additional contract
  const addAdditionalContract = () => {
    const newContract: ContractDetails = {
      startDate: '',
      endDate: '',
      autoRenewal: false,
      renewalPeriod: 0,
      renewalNotice: 0,
      noticeUnit: 'months',
      serviceFrequency: '',
      serviceDeliveryMethod: '',
      contractNumber: '',
      renewalTerms: '',
      terminationPeriod: '',
      contractType: 'cleaning',
      contractLength: 0,
      contractLengthUnit: 'months',
      terms: []
    };
    
    setFormData(prev => ({
      ...prev,
      additionalContracts: [...(prev.additionalContracts || []), newContract]
    }));
  };
  
  // Remove an additional contract
  const removeAdditionalContract = (index: number) => {
    setFormData(prev => {
      const updatedContracts = [...(prev.additionalContracts || [])];
      updatedContracts.splice(index, 1);
      return {
        ...prev,
        additionalContracts: updatedContracts
      };
    });
  };
  
  // Update an additional contract field
  const updateAdditionalContract = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedContracts = [...(prev.additionalContracts || [])];
      updatedContracts[index] = {
        ...updatedContracts[index],
        [field]: value
      };
      return {
        ...prev,
        additionalContracts: updatedContracts
      };
    });
  };
  
  return {
    addAdditionalContract,
    removeAdditionalContract,
    updateAdditionalContract
  };
};
