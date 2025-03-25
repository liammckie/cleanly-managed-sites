
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { SiteFormData } from '../../types/siteFormData';
import { ContractTerm } from '../../types/contractTypes';

interface PrimaryContractInformationProps {
  formData: SiteFormData;
  updateFormField: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function PrimaryContractInformation({ 
  formData, 
  updateFormField,
  errors
}: PrimaryContractInformationProps) {
  // Initialize contract details if it doesn't exist
  const contractDetails = formData.contract_details || {};

  // Initialize billingCycle if it doesn't exist
  if (!contractDetails.billingCycle) {
    updateFormField('contract_details.billingCycle', 'monthly');
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Primary Contract Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contractNumber">Contract Number</Label>
            <Input
              id="contractNumber"
              value={contractDetails.contractNumber || ''}
              onChange={(e) => updateFormField('contract_details.contractNumber', e.target.value)}
              placeholder="E.g., CTR-2023-001"
            />
          </div>
          
          <div>
            <Label htmlFor="contractType">Contract Type</Label>
            <Select 
              value={contractDetails.contractType || ''} 
              onValueChange={(value) => updateFormField('contract_details.contractType', value)}
            >
              <SelectTrigger id="contractType">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed_term">Fixed Term</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="project_based">Project Based</SelectItem>
                <SelectItem value="retainer">Retainer</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contractStartDate">Start Date</Label>
            <DatePicker
              id="contractStartDate"
              value={contractDetails.startDate ? new Date(contractDetails.startDate) : undefined}
              onChange={(date) => updateFormField('contract_details.startDate', date ? date.toISOString().split('T')[0] : '')}
            />
          </div>
          
          <div>
            <Label htmlFor="contractEndDate">End Date</Label>
            <DatePicker
              id="contractEndDate"
              value={contractDetails.endDate ? new Date(contractDetails.endDate) : undefined}
              onChange={(date) => updateFormField('contract_details.endDate', date ? date.toISOString().split('T')[0] : '')}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="terminationPeriod">Notice Period (Days)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="terminationPeriod"
                type="number"
                min="0"
                value={contractDetails.terminationPeriod || ''}
                onChange={(e) => updateFormField('contract_details.terminationPeriod', e.target.value)}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm">
                    The number of days' notice required to terminate the contract. This applies to both parties.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <Label htmlFor="nextReviewDate">Next Review Date</Label>
            <DatePicker
              id="nextReviewDate"
              value={contractDetails.nextReviewDate ? new Date(contractDetails.nextReviewDate) : undefined}
              onChange={(date) => updateFormField('contract_details.nextReviewDate', date ? date.toISOString().split('T')[0] : '')}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="renewalType">Renewal Type</Label>
            <Select 
              value={contractDetails.renewalType || ''} 
              onValueChange={(value) => updateFormField('contract_details.renewalType', value)}
            >
              <SelectTrigger id="renewalType">
                <SelectValue placeholder="Select renewal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Term</SelectItem>
                <SelectItem value="evergreen">Evergreen</SelectItem>
                <SelectItem value="extension">Extension Option</SelectItem>
                <SelectItem value="renegotiation">Renegotiation</SelectItem>
                <SelectItem value="non_renewable">Non-Renewable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <Select 
              value={contractDetails.billingCycle || 'monthly'} 
              onValueChange={(value) => updateFormField('contract_details.billingCycle', value)}
            >
              <SelectTrigger id="billingCycle">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={contractDetails.status || 'active'} 
              onValueChange={(value) => updateFormField('contract_details.status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="value">Monthly Value</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                className="pl-8"
                value={contractDetails.value || ''}
                onChange={(e) => updateFormField('contract_details.value', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t pt-4">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <Switch
                id="autoRenewal"
                checked={contractDetails.autoRenewal || false}
                onCheckedChange={(checked) => updateFormField('contract_details.autoRenewal', checked)}
              />
              <Label htmlFor="autoRenewal">Auto Renewal</Label>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1 ml-7">
              Contract will automatically renew at the end of the term
            </p>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <Switch
                id="cpiApplied"
                checked={contractDetails.cpiApplied || false}
                onCheckedChange={(checked) => updateFormField('contract_details.cpiApplied', checked)}
              />
              <Label htmlFor="cpiApplied">CPI Adjustment</Label>
            </div>
            
            {contractDetails.cpiApplied && (
              <div className="mt-2 ml-7">
                <Label htmlFor="cpiApplicationDate" className="text-xs">CPI Adjustment Date</Label>
                <DatePicker
                  id="cpiApplicationDate"
                  value={contractDetails.cpiApplicationDate ? new Date(contractDetails.cpiApplicationDate) : undefined}
                  onChange={(date) => updateFormField('contract_details.cpiApplicationDate', date ? date.toISOString().split('T')[0] : '')}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
