
import { SiteFormData } from '@/components/sites/forms/siteFormTypes';
import { ReplenishableSupply } from '@/components/sites/forms/types/replenishableTypes';

export const useSiteFormReplenishables = (
  formData: SiteFormData,
  setFormData: React.Dispatch<React.SetStateAction<SiteFormData>>
) => {
  // Handle stock item changes with type safety
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
  
  // Add a new replenishable
  const addReplenishable = () => {
    const newReplenishable: ReplenishableSupply = {
      id: crypto.randomUUID(),
      name: '',
      quantity: 0,
      notes: ''
    };
    
    setFormData(prev => ({
      ...prev,
      replenishables: {
        ...prev.replenishables,
        supplies: [...(prev.replenishables.supplies || []), newReplenishable]
      }
    }));
  };
  
  // Update a replenishable item
  const updateReplenishable = (index: number, field: string, value: any) => {
    const updatedSupplies = [...(formData.replenishables.supplies || [])];
    
    if (updatedSupplies[index]) {
      updatedSupplies[index] = {
        ...updatedSupplies[index],
        [field]: value
      };
      
      setFormData(prev => ({
        ...prev,
        replenishables: {
          ...prev.replenishables,
          supplies: updatedSupplies
        }
      }));
    }
  };
  
  // Remove a replenishable item
  const removeReplenishable = (index: number) => {
    const updatedSupplies = [...(formData.replenishables.supplies || [])];
    updatedSupplies.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      replenishables: {
        ...prev.replenishables,
        supplies: updatedSupplies
      }
    }));
  };
  
  return {
    handleStockChange,
    addReplenishable,
    updateReplenishable,
    removeReplenishable
  };
};
