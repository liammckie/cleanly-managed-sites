import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';

interface AdditionalContractsSectionProps {
  formData: SiteFormData;
  setFormData: (formData: any) => void;
}

export function AdditionalContractsSection({ formData, setFormData }: AdditionalContractsSectionProps) {
  const handleAddContract = () => {
    const newContract = {
      id: uuidv4(),
      contractNumber: '',
      startDate: '',
      endDate: '',
      autoRenewal: false,
      renewalPeriod: '',
      renewalNotice: '',
      serviceFrequency: '',
      serviceDeliveryMethod: '',
      value: '',
      notes: ''
    };

    setFormData(prev => ({
      ...prev,
      additionalContracts: [...(prev.additionalContracts || []), newContract]
    }));
  };

  const handleRemoveContract = (id: string) => {
    setFormData(prev => ({
      ...prev,
      additionalContracts: (prev.additionalContracts || []).filter(contract => contract.id !== id)
    }));
  };

  const handleContractChange = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      additionalContracts: (prev.additionalContracts || []).map(contract =>
        contract.id === id ? { ...contract, [field]: value } : contract
      )
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Contracts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(formData.additionalContracts || []).map(contract => (
          <div key={contract.id} className="space-y-2 border p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`contractNumber-${contract.id}`}>Contract Number</Label>
                <Input
                  type="text"
                  id={`contractNumber-${contract.id}`}
                  value={contract.contractNumber || ''}
                  onChange={(e) => handleContractChange(contract.id, 'contractNumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`value-${contract.id}`}>Value</Label>
                <Input
                  type="number"
                  id={`value-${contract.id}`}
                  value={contract.value || ''}
                  onChange={(e) => handleContractChange(contract.id, 'value', String(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`startDate-${contract.id}`}>Start Date</Label>
                <Input
                  type="date"
                  id={`startDate-${contract.id}`}
                  value={contract.startDate || ''}
                  onChange={(e) => handleContractChange(contract.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${contract.id}`}>End Date</Label>
                <Input
                  type="date"
                  id={`endDate-${contract.id}`}
                  value={contract.endDate || ''}
                  onChange={(e) => handleContractChange(contract.id, 'endDate', e.target.value)}
                />
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleRemoveContract(contract.id)}>
              Remove Contract
            </Button>
          </div>
        ))}
        <Button onClick={handleAddContract}>Add Contract</Button>
      </CardContent>
    </Card>
  );
}
