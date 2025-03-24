
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { ContractDetails } from '../../types/contractTypes';
import { SiteFormData } from '../../siteFormTypes';

interface AdditionalContractsSectionProps {
  formData: SiteFormData;
  setFormData?: React.Dispatch<React.SetStateAction<SiteFormData>>;
}

export function AdditionalContractsSection({ formData, setFormData }: AdditionalContractsSectionProps) {
  // Function to add an additional contract
  const addAdditionalContract = () => {
    if (!setFormData) return;
    
    // Create a new default contract
    const newContract: ContractDetails = {
      startDate: '',
      endDate: '',
      contractNumber: '',
      renewalTerms: '',
      terminationPeriod: '',
      contractType: 'cleaning',
      terms: []
    };
    
    // Add it to the additional contracts array
    setFormData(prev => ({
      ...prev,
      additionalContracts: [...(prev.additionalContracts || []), newContract]
    }));
  };

  // Function to remove an additional contract
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

  // Function to update an additional contract
  const updateAdditionalContract = (index: number, field: string, value: any) => {
    if (!setFormData || !formData.additionalContracts) return;
    
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

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Additional Contracts</h3>
        <Button 
          onClick={addAdditionalContract} 
          variant="outline" 
          size="sm"
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Contract
        </Button>
      </div>

      {formData.additionalContracts && formData.additionalContracts.length > 0 ? (
        <div className="space-y-4">
          {formData.additionalContracts.map((contract, index) => (
            <Card key={index} className="bg-slate-50">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                <CardTitle className="text-md">
                  Contract #{index + 2}: {contract.contractType || 'Cleaning'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeAdditionalContract(index)}
                  className="h-8 w-8 p-0" 
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="px-4 py-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contract Type</label>
                    <select 
                      className="w-full rounded-md border border-input p-2"
                      value={contract.contractType || 'cleaning'}
                      onChange={(e) => updateAdditionalContract(index, 'contractType', e.target.value)}
                    >
                      <option value="cleaning">Cleaning</option>
                      <option value="pest">Pest Control</option>
                      <option value="grounds">Grounds Maintenance</option>
                      <option value="waste">Waste Management</option>
                      <option value="hygiene">Hygiene Services</option>
                      <option value="gardening">Gardening</option>
                      <option value="security">Security</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contract Number</label>
                    <input 
                      type="text"
                      className="w-full rounded-md border border-input p-2"
                      value={contract.contractNumber || ''}
                      onChange={(e) => updateAdditionalContract(index, 'contractNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <input 
                      type="date"
                      className="w-full rounded-md border border-input p-2"
                      value={contract.startDate || ''}
                      onChange={(e) => updateAdditionalContract(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <input 
                      type="date"
                      className="w-full rounded-md border border-input p-2"
                      value={contract.endDate || ''}
                      onChange={(e) => updateAdditionalContract(index, 'endDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contract Value</label>
                    <input 
                      type="number"
                      className="w-full rounded-md border border-input p-2"
                      value={contract.value || ''}
                      onChange={(e) => updateAdditionalContract(index, 'value', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Billing Cycle</label>
                    <select 
                      className="w-full rounded-md border border-input p-2"
                      value={contract.billingCycle || 'monthly'}
                      onChange={(e) => updateAdditionalContract(index, 'billingCycle', e.target.value)}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-slate-50 rounded-md border border-slate-200">
          <p className="text-muted-foreground">No additional contracts added yet.</p>
          <Button 
            onClick={addAdditionalContract} 
            variant="secondary" 
            size="sm" 
            className="mt-2"
          >
            Add Contract
          </Button>
        </div>
      )}
    </div>
  );
}
