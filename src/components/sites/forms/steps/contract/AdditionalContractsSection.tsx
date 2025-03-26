import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWrapper } from '@/components/ui/date-picker/DatePickerWrapper';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { FormSection } from '@/components/sites/forms/FormSection';

export interface AdditionalContractsSectionProps {
  formData: any;
  handleNestedChange?: (section: string, field: string, value: any) => void;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
}

export function AdditionalContractsSection({ 
  formData, 
  handleNestedChange, 
  setFormData 
}: AdditionalContractsSectionProps) {
  const additionalContracts = formData.additionalContracts || [];
  
  const addAdditionalContract = () => {
    if (!setFormData) return;
    
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
  
  const removeAdditionalContract = (index: number) => {
    if (!setFormData) return;
    
    setFormData(prev => {
      const updatedContracts = [...(prev.additionalContracts || [])];
      updatedContracts.splice(index, 1);
      return {
        ...prev,
        additionalContracts: updatedContracts
      };
    });
  };
  
  const updateAdditionalContract = (index: number, field: string, value: any) => {
    if (!setFormData) return;
    
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
  
  const contractTypes = [
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'window', label: 'Window Cleaning' },
    { value: 'carpet', label: 'Carpet Cleaning' },
    { value: 'pest', label: 'Pest Control' },
    { value: 'other', label: 'Other' }
  ];

  // Get the handler function based on what's available
  const handleChange = setFormData ? updateAdditionalContract : 
                       handleNestedChange ? 
                       (index: number, field: string, value: any) => 
                         handleNestedChange(`additionalContracts[${index}]`, field, value) : 
                       () => {};
  
  return (
    <FormSection
      title="Additional Contracts"
      description="Add any additional contracts or service agreements related to this site."
    >
      {additionalContracts.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No additional contracts. Add one below.
        </div>
      ) : (
        additionalContracts.map((contract: ContractDetails, index: number) => (
          <div key={index} className="border rounded-md p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium">Additional Contract #{index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeAdditionalContract(index)}
              >
                Remove
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contract Type</label>
                <Select
                  value={contract.contractType || 'cleaning'}
                  onValueChange={(value) => handleChange(index, 'contractType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contract Number</label>
                <Input
                  value={contract.contractNumber || ''}
                  onChange={(e) => handleChange(index, 'contractNumber', e.target.value)}
                  placeholder="Enter contract number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <DatePickerWrapper
                  value={contract.startDate ? new Date(contract.startDate) : new Date()}
                  onChange={(date) => handleChange(index, 'startDate', date?.toISOString().split('T')[0])}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <DatePickerWrapper
                  value={contract.endDate ? new Date(contract.endDate) : new Date()}
                  onChange={(date) => handleChange(index, 'endDate', date?.toISOString().split('T')[0])}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Renewal Terms</label>
                <Textarea
                  value={contract.renewalTerms || ''}
                  onChange={(e) => handleChange(index, 'renewalTerms', e.target.value)}
                  placeholder="Describe renewal terms"
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Termination Period</label>
                <Input
                  value={contract.terminationPeriod || ''}
                  onChange={(e) => handleChange(index, 'terminationPeriod', e.target.value)}
                  placeholder="e.g., 30 days written notice"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <Textarea
                value={contract.notes || ''}
                onChange={(e) => handleChange(index, 'notes', e.target.value)}
                placeholder="Additional notes about this contract"
                className="min-h-[100px]"
              />
            </div>
          </div>
        ))
      )}
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={addAdditionalContract}
      >
        Add Another Contract
      </Button>
    </FormSection>
  );
}
