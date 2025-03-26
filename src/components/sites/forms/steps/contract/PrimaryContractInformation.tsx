
// Let's fix the DatePicker implementations
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DatePickerWrapper } from '@/components/ui/date-picker/DatePickerWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormSection } from '@/components/sites/forms/FormSection';

export interface PrimaryContractInformationProps {
  formData: any;
  handleNestedChange: (section: string, field: string, value: any) => void;
  annualValue: number;
}

export function PrimaryContractInformation({
  formData, 
  handleNestedChange,
  annualValue
}: PrimaryContractInformationProps) {
  const contractDetails = formData.contract_details || {};
  
  const handleContractChange = (field: string, value: any) => {
    handleNestedChange('contract_details', field, value);
  };
  
  const contractTypes = [
    { value: 'fixed_term', label: 'Fixed Term' },
    { value: 'rolling', label: 'Rolling / Auto-Renewal' },
    { value: 'indefinite', label: 'Indefinite' },
    { value: 'trial', label: 'Trial Period' }
  ];
  
  const contractStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending Activation' },
    { value: 'expired', label: 'Expired' },
    { value: 'terminated', label: 'Terminated' },
    { value: 'on_hold', label: 'On Hold' }
  ];
  
  return (
    <FormSection
      title="Primary Contract Information"
      description="Enter the main contract details for this site."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contract Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contract Type</label>
              <Select
                value={contractDetails.type || 'fixed_term'}
                onValueChange={(value) => handleContractChange('type', value)}
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
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                value={contractDetails.status || 'active'}
                onValueChange={(value) => handleContractChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {contractStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <DatePickerWrapper
                value={contractDetails.startDate ? new Date(contractDetails.startDate) : new Date()}
                onChange={(date) => handleContractChange('startDate', date?.toISOString().split('T')[0])}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <DatePickerWrapper
                value={contractDetails.endDate ? new Date(contractDetails.endDate) : new Date()}
                onChange={(date) => handleContractChange('endDate', date?.toISOString().split('T')[0])}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={contractDetails.autoRenewal || false}
              onCheckedChange={(checked) => handleContractChange('autoRenewal', checked)}
              id="auto-renewal"
            />
            <label htmlFor="auto-renewal" className="text-sm font-medium">
              Auto-renewal
            </label>
          </div>
          
          {contractDetails.autoRenewal && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Renewal Notice Period (days)</label>
                <Input
                  type="number"
                  value={contractDetails.renewalNoticeDays || 30}
                  onChange={(e) => handleContractChange('renewalNoticeDays', parseInt(e.target.value))}
                  min={0}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Renewal Length (months)</label>
                <Input
                  type="number"
                  value={contractDetails.renewalLengthMonths || 12}
                  onChange={(e) => handleContractChange('renewalLengthMonths', parseInt(e.target.value))}
                  min={1}
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">Next Review Date</label>
            <DatePickerWrapper
              value={contractDetails.reviewDate ? new Date(contractDetails.reviewDate) : new Date()}
              onChange={(date) => handleContractChange('reviewDate', date?.toISOString().split('T')[0])}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Contract Number</label>
            <Input
              value={contractDetails.contractNumber || ''}
              onChange={(e) => handleContractChange('contractNumber', e.target.value)}
              placeholder="Enter contract number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Contract Value (Annual)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                className="pl-7"
                type="number"
                value={contractDetails.annualValue || annualValue || 0}
                onChange={(e) => handleContractChange('annualValue', parseFloat(e.target.value))}
                min={0}
                step={0.01}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Termination Clause</label>
            <Textarea
              value={contractDetails.terminationClause || ''}
              onChange={(e) => handleContractChange('terminationClause', e.target.value)}
              placeholder="Describe termination terms"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Notice Period (days)</label>
              <Input
                type="number"
                value={contractDetails.noticePeriodDays || 30}
                onChange={(e) => handleContractChange('noticePeriodDays', parseInt(e.target.value))}
                min={0}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Next Increase Date</label>
              <DatePickerWrapper
                value={contractDetails.nextIncreaseDate ? new Date(contractDetails.nextIncreaseDate) : new Date()}
                onChange={(date) => handleContractChange('nextIncreaseDate', date?.toISOString().split('T')[0])}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Special Terms</label>
            <Textarea
              value={contractDetails.specialTerms || ''}
              onChange={(e) => handleContractChange('specialTerms', e.target.value)}
              placeholder="Enter any special terms or conditions"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </FormSection>
  );
}
