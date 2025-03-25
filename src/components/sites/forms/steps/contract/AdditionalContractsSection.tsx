
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SiteFormData } from '../../types/siteFormData';
import { ContractDetails, ContractTerm } from '../../types/contractTypes';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AdditionalContractsSectionProps {
  formData: SiteFormData;
  addAdditionalContract: () => void;
  removeAdditionalContract: (index: number) => void;
  updateAdditionalContract: (index: number, field: string, value: any) => void;
}

export function AdditionalContractsSection({
  formData,
  addAdditionalContract,
  removeAdditionalContract,
  updateAdditionalContract
}: AdditionalContractsSectionProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  
  // Create a default contract object
  const defaultContract: ContractDetails = {
    contractNumber: '',
    startDate: '',
    endDate: '',
    terminationPeriod: '',
    renewalTerms: '',
    autoRenewal: false,
    contractType: '',
    status: 'active',
    value: 0,
    billingCycle: 'monthly',
    notes: ''
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Additional Contracts</h3>
        <Button 
          onClick={addAdditionalContract}
          variant="outline"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contract
        </Button>
      </div>
      
      {formData.additionalContracts && formData.additionalContracts.length === 0 && (
        <div className="text-center py-8 border rounded-md bg-muted/30">
          <p className="text-muted-foreground">No additional contracts added</p>
          <p className="text-sm text-muted-foreground">
            Add additional contracts like service agreements, specialized cleaning, etc.
          </p>
          <Button 
            onClick={addAdditionalContract}
            variant="outline" 
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contract
          </Button>
        </div>
      )}
      
      {formData.additionalContracts && formData.additionalContracts.map((contract, index) => (
        <Card key={index} className="shadow-sm">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {contract.contractNumber 
                  ? `Contract ${contract.contractNumber}`
                  : `Additional Contract ${index + 1}`
                }
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedIndex === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAdditionalContract(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {(expandedIndex === index) && (
            <>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`contract-number-${index}`}>Contract Number</Label>
                      <Input 
                        id={`contract-number-${index}`}
                        value={contract.contractNumber || ''}
                        onChange={(e) => updateAdditionalContract(index, 'contractNumber', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`contract-type-${index}`}>Contract Type</Label>
                      <Select
                        value={contract.contractType || ''}
                        onValueChange={(value) => updateAdditionalContract(index, 'contractType', value)}
                      >
                        <SelectTrigger id={`contract-type-${index}`}>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="service_agreement">Service Agreement</SelectItem>
                          <SelectItem value="maintenance">Maintenance Contract</SelectItem>
                          <SelectItem value="special_cleaning">Special Cleaning</SelectItem>
                          <SelectItem value="supplemental">Supplemental Contract</SelectItem>
                          <SelectItem value="project">Project-Based</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                      <DatePicker
                        id={`start-date-${index}`}
                        value={contract.startDate ? new Date(contract.startDate) : undefined}
                        onChange={(date) => updateAdditionalContract(index, 'startDate', date ? date.toISOString().split('T')[0] : '')}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`end-date-${index}`}>End Date</Label>
                      <DatePicker
                        id={`end-date-${index}`}
                        value={contract.endDate ? new Date(contract.endDate) : undefined}
                        onChange={(date) => updateAdditionalContract(index, 'endDate', date ? date.toISOString().split('T')[0] : '')}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`monthly-value-${index}`}>Monthly Value</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          id={`monthly-value-${index}`}
                          type="number"
                          className="pl-8"
                          value={contract.value || ''}
                          onChange={(e) => updateAdditionalContract(index, 'value', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`billing-cycle-${index}`}>Billing Cycle</Label>
                      <Select
                        value={contract.billingCycle || 'monthly'}
                        onValueChange={(value) => updateAdditionalContract(index, 'billingCycle', value)}
                      >
                        <SelectTrigger id={`billing-cycle-${index}`}>
                          <SelectValue placeholder="Select billing cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="fortnightly">Fortnightly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id={`auto-renewal-${index}`}
                      checked={contract.autoRenewal || false}
                      onCheckedChange={(checked) => updateAdditionalContract(index, 'autoRenewal', !!checked)}
                    />
                    <Label htmlFor={`auto-renewal-${index}`}>Auto Renewal</Label>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor={`notes-${index}`}>Notes</Label>
                    <Textarea
                      id={`notes-${index}`}
                      placeholder="Enter any additional notes about this contract"
                      value={contract.notes || ''}
                      onChange={(e) => updateAdditionalContract(index, 'notes', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end py-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpand(index)}
                >
                  Collapse
                </Button>
              </CardFooter>
            </>
          )}
          
          {/* Collapsed view */}
          {expandedIndex !== index && (
            <CardContent className="py-2">
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Start:</span> {contract.startDate || 'Not set'}
                </div>
                <div>
                  <span className="text-muted-foreground">End:</span> {contract.endDate || 'Not set'}
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span> {contract.contractType || 'Not specified'}
                </div>
                <div>
                  <span className="text-muted-foreground">Value:</span> ${contract.value?.toFixed(2) || '0.00'}/{contract.billingCycle || 'month'}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
