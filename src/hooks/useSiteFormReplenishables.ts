
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';

export const useSiteFormReplenishables = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  // Handle stock item changes
  const handleStockChange = (index: number, value: string) => {
    const updatedStock = [...formData.replenishables.stock];
    updatedStock[index] = value;
    
    setFormData(prev => ({
      ...prev,
      replenishables: {
        ...prev.replenishables,
        stock: updatedStock
      }
    }));
  };
  
  return {
    handleStockChange
  };
};
