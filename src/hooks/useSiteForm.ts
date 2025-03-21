
import { useState } from 'react';
import { SiteStatus } from '@/components/sites/SiteCard';
import { SiteFormData, getInitialFormData } from '@/components/sites/forms/siteFormTypes';

export function useSiteForm() {
  // Form state
  const [formData, setFormData] = useState<SiteFormData>(getInitialFormData());
  
  // Handle basic field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle status change specifically for the Select component
  const handleStatusChange = (value: SiteStatus) => {
    handleChange({ target: { name: 'status', value } } as any);
  };
  
  // Handle nested field changes
  const handleNestedChange = (section: keyof SiteFormData, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] as object),
        [field]: value
      }
    });
  };
  
  // Handle nested within nested field changes
  const handleDoubleNestedChange = (section: keyof SiteFormData, subsection: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] as object),
        [subsection]: {
          ...((formData[section] as any)[subsection] as object),
          [field]: value
        }
      }
    });
  };
  
  // Handle array of objects field changes
  const handleSubcontractorChange = (index: number, field: string, value: string) => {
    const newSubcontractors = [...formData.subcontractors];
    newSubcontractors[index] = {
      ...newSubcontractors[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      subcontractors: newSubcontractors
    });
  };
  
  // Handle array field changes
  const handleStockChange = (index: number, value: string) => {
    const newStock = [...formData.replenishables.stock];
    newStock[index] = value;
    
    setFormData({
      ...formData,
      replenishables: {
        ...formData.replenishables,
        stock: newStock
      }
    });
  };
  
  // Add another subcontractor
  const addSubcontractor = () => {
    setFormData({
      ...formData,
      subcontractors: [
        ...formData.subcontractors,
        {
          businessName: '',
          contactName: '',
          email: '',
          phone: ''
        }
      ]
    });
  };
  
  // Remove a subcontractor
  const removeSubcontractor = (index: number) => {
    const newSubcontractors = [...formData.subcontractors];
    newSubcontractors.splice(index, 1);
    
    setFormData({
      ...formData,
      subcontractors: newSubcontractors
    });
  };

  return {
    formData,
    handleChange,
    handleStatusChange,
    handleNestedChange,
    handleDoubleNestedChange,
    handleSubcontractorChange,
    handleStockChange,
    addSubcontractor,
    removeSubcontractor
  };
}
