
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData } from '../siteFormTypes';

interface ContractDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function ContractDetailsStep({ formData, handleNestedChange }: ContractDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Contract Information</h3>
        
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
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Contract Terms</h3>
        
        <div className="space-y-2">
          <Label htmlFor="renewal-terms">Renewal Terms</Label>
          <Textarea
            id="renewal-terms"
            placeholder="Enter renewal terms..."
            rows={3}
            value={formData.contractDetails.renewalTerms}
            onChange={(e) => handleNestedChange('contractDetails', 'renewalTerms', e.target.value)}
            className="glass-input resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="termination-period">Termination Period</Label>
          <Input
            id="termination-period"
            placeholder="e.g., 30 days notice"
            value={formData.contractDetails.terminationPeriod}
            onChange={(e) => handleNestedChange('contractDetails', 'terminationPeriod', e.target.value)}
            className="glass-input"
          />
        </div>
      </div>
    </div>
  );
}
