
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, History } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData } from '../../siteFormTypes';
import { ContractType } from '../../types/contractTypes';

interface PrimaryContractInformationProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  annualValue: number;
}

export function PrimaryContractInformation({ 
  formData, 
  handleNestedChange,
  annualValue
}: PrimaryContractInformationProps) {
  // Calculate weekly value from contract value
  const weeklyValue = formData.contractDetails.value 
    ? (formData.contractDetails.billingCycle === 'weekly' 
      ? formData.contractDetails.value 
      : formData.contractDetails.billingCycle === 'monthly' 
        ? formData.contractDetails.value / 4.33
        : formData.contractDetails.billingCycle === 'quarterly'
          ? formData.contractDetails.value / 13
          : formData.contractDetails.value / 52)
    : 0;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Primary Contract Information</h3>
        <div className="flex items-center text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          <History className="h-3.5 w-3.5 mr-1 text-blue-500" />
          Changes will be versioned
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contract-number">Contract Number</Label>
          <Input
            id="contract-number"
            value={formData.contractDetails.contractNumber}
            onChange={(e) => handleNestedChange('contractDetails', 'contractNumber', e.target.value)}
            className="glass-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract-type">Contract Type</Label>
          <Select 
            value={formData.contractDetails.contractType || 'cleaning'}
            onValueChange={(value) => handleNestedChange('contractDetails', 'contractType', value as ContractType)}
          >
            <SelectTrigger id="contract-type" className="glass-input">
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="pest">Pest Control</SelectItem>
              <SelectItem value="grounds">Grounds Maintenance</SelectItem>
              <SelectItem value="waste">Waste Management</SelectItem>
              <SelectItem value="hygiene">Hygiene Services</SelectItem>
              <SelectItem value="gardening">Gardening</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={formData.contractDetails.startDate}
            onChange={(e) => handleNestedChange('contractDetails', 'startDate', e.target.value)}
            className="glass-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={formData.contractDetails.endDate}
            onChange={(e) => handleNestedChange('contractDetails', 'endDate', e.target.value)}
            className="glass-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="next-review-date">Next Review Date</Label>
          <Input
            id="next-review-date"
            type="date"
            value={formData.contractDetails.nextReviewDate || ''}
            onChange={(e) => handleNestedChange('contractDetails', 'nextReviewDate', e.target.value)}
            className="glass-input"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contract-value">Contract Value ($)</Label>
          <Input
            id="contract-value"
            type="number"
            placeholder="0.00"
            value={formData.contractDetails.value || ''}
            onChange={(e) => handleNestedChange('contractDetails', 'value', parseFloat(e.target.value))}
            className="glass-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="billing-cycle">Billing Cycle</Label>
          <Select 
            value={formData.contractDetails.billingCycle || 'monthly'}
            onValueChange={(value) => handleNestedChange('contractDetails', 'billingCycle', value)}
          >
            <SelectTrigger id="billing-cycle" className="glass-input">
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Weekly Value</Label>
          <div className="flex items-center h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <Calculator className="w-4 h-4 mr-2 text-muted-foreground" />
            ${weeklyValue.toFixed(2)}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Annual Value Forecast</Label>
          <div className="flex items-center h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <Calculator className="w-4 h-4 mr-2 text-muted-foreground" />
            ${annualValue.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="auto-renew" 
            checked={formData.contractDetails.autoRenew || false}
            onCheckedChange={(checked) => handleNestedChange('contractDetails', 'autoRenew', checked)}
          />
          <Label htmlFor="auto-renew">Auto-renew contract</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="cpi-applied" 
            checked={formData.contractDetails.cpiApplied || false}
            onCheckedChange={(checked) => handleNestedChange('contractDetails', 'cpiApplied', checked)}
          />
          <Label htmlFor="cpi-applied">CPI can be applied automatically</Label>
        </div>
      </div>
      
      {formData.contractDetails.cpiApplied && (
        <div className="space-y-2 mt-2">
          <Label htmlFor="cpi-application-date">CPI Application Date</Label>
          <Input
            id="cpi-application-date"
            type="date"
            value={formData.contractDetails.cpiApplicationDate || ''}
            onChange={(e) => handleNestedChange('contractDetails', 'cpiApplicationDate', e.target.value)}
            className="glass-input"
          />
        </div>
      )}
    </div>
  );
}
