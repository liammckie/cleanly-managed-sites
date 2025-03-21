
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData } from '../siteFormTypes';
import { History } from 'lucide-react';

interface ContractDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function ContractDetailsStep({ formData, handleNestedChange }: ContractDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Contract Information</h3>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contract-value">Monthly Value ($)</Label>
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
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-8">
            <Checkbox 
              id="auto-renew" 
              checked={formData.contractDetails.autoRenew || false}
              onCheckedChange={(checked) => handleNestedChange('contractDetails', 'autoRenew', checked)}
            />
            <Label htmlFor="auto-renew">Auto-renew contract</Label>
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
