
import { v4 as uuidv4 } from 'uuid';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

export function useBillingLines(
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) {
  // Add a new billing line
  const addBillingLine = () => {
    const newBillingLine: BillingLine = {
      id: uuidv4(),
      description: '',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true,
      onHold: false
    };
    
    setFormData(prev => {
      // Ensure billingDetails exists
      const billingDetails = prev.billingDetails || { billingLines: [] };
      
      // Ensure billingLines exists
      const billingLines = billingDetails.billingLines || [];
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          billingLines: [...billingLines, newBillingLine]
        }
      };
    });
  };
  
  // Update an existing billing line
  const updateBillingLine = (id: string, field: string, value: any) => {
    setFormData(prev => {
      // Ensure billingDetails exists
      const billingDetails = prev.billingDetails || { billingLines: [] };
      
      // Ensure billingLines exists
      const billingLines = billingDetails.billingLines || [];
      
      const updatedLines = billingLines.map(line => 
        line.id === id ? { ...line, [field]: value } : line
      );
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          billingLines: updatedLines
        }
      };
    });
  };
  
  // Remove a billing line
  const removeBillingLine = (id: string) => {
    setFormData(prev => {
      // Ensure billingDetails exists
      const billingDetails = prev.billingDetails || { billingLines: [] };
      
      // Ensure billingLines exists
      const billingLines = billingDetails.billingLines || [];
      
      const filteredLines = billingLines.filter(line => line.id !== id);
      
      return {
        ...prev,
        billingDetails: {
          ...billingDetails,
          billingLines: filteredLines
        }
      };
    });
  };

  return {
    addBillingLine,
    updateBillingLine,
    removeBillingLine
  };
}
