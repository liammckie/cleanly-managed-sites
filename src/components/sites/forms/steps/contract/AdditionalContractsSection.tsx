
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';

interface AdditionalContractsSectionProps {
  additionalContracts: ContractDetails[];
  onAddContract: () => void;
  onRemoveContract: (index: number) => void;
  onUpdateContract: (index: number, field: string, value: any) => void;
}

export const AdditionalContractsSection: React.FC<AdditionalContractsSectionProps> = ({
  additionalContracts,
  onAddContract,
  onRemoveContract,
  onUpdateContract
}) => {
  const handleAddContract = () => {
    onAddContract();
  };

  const createNewContract = (): ContractDetails => ({
    startDate: '',
    endDate: '',
    contractLength: 0,
    contractLengthUnit: 'months',
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
    terms: []
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Additional Contracts</h3>
        <Button type="button" variant="outline" size="sm" onClick={handleAddContract}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contract
        </Button>
      </div>
      
      {additionalContracts.length === 0 ? (
        <p className="text-muted-foreground">No additional contracts have been added.</p>
      ) : (
        <div className="space-y-6">
          {additionalContracts.map((contract, index) => (
            <Card key={index} className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-destructive"
                onClick={() => onRemoveContract(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Contract Type</label>
                      <Input
                        value={contract.contractType || ''}
                        onChange={(e) => onUpdateContract(index, 'contractType', e.target.value)}
                        placeholder="e.g. Cleaning, Security, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Contract Number</label>
                      <Input
                        value={contract.contractNumber || ''}
                        onChange={(e) => onUpdateContract(index, 'contractNumber', e.target.value)}
                        placeholder="Contract reference number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {contract.startDate ? (
                              format(new Date(contract.startDate), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={contract.startDate ? new Date(contract.startDate) : undefined}
                            onSelect={(date) => onUpdateContract(index, 'startDate', date ? format(date, 'yyyy-MM-dd') : '')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {contract.endDate ? (
                              format(new Date(contract.endDate), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={contract.endDate ? new Date(contract.endDate) : undefined}
                            onSelect={(date) => onUpdateContract(index, 'endDate', date ? format(date, 'yyyy-MM-dd') : '')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Renewal Terms</label>
                      <Input
                        value={contract.renewalTerms || ''}
                        onChange={(e) => onUpdateContract(index, 'renewalTerms', e.target.value)}
                        placeholder="Renewal terms details"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Termination Period</label>
                      <Input
                        value={contract.terminationPeriod || ''}
                        onChange={(e) => onUpdateContract(index, 'terminationPeriod', e.target.value)}
                        placeholder="e.g. 30 days, 90 days"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`auto-renew-${index}`}
                        checked={contract.autoRenewal || false}
                        onCheckedChange={(checked) => onUpdateContract(index, 'autoRenewal', Boolean(checked))}
                      />
                      <label
                        htmlFor={`auto-renew-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Auto Renewal
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Notes</label>
                      <Textarea
                        value={contract.notes || ''}
                        onChange={(e) => onUpdateContract(index, 'notes', e.target.value)}
                        placeholder="Additional notes about this contract"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
