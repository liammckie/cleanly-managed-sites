
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData } from '../siteFormTypes';
import { History, Plus, Trash2, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContractDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  addContractTerm?: () => void;
  removeContractTerm?: (index: number) => void;
  updateContractTerm?: (index: number, field: string, value: any) => void;
}

export function ContractDetailsStep({ 
  formData, 
  handleNestedChange,
  addContractTerm,
  removeContractTerm,
  updateContractTerm
}: ContractDetailsStepProps) {
  const [annualValue, setAnnualValue] = useState<number>(0);

  // Calculate annual value based on billing cycle and contract value
  useEffect(() => {
    const value = formData.contractDetails.value || 0;
    const cycle = formData.contractDetails.billingCycle || 'monthly';
    
    let annual = 0;
    switch (cycle) {
      case 'weekly':
        annual = value * 52;
        break;
      case 'monthly':
        annual = value * 12;
        break;
      case 'quarterly':
        annual = value * 4;
        break;
      case 'annually':
        annual = value;
        break;
      default:
        annual = 0;
    }
    
    setAnnualValue(annual);
    
    // Add a billing line automatically if a value is set
    if (value > 0 && formData.billingDetails.billingLines.length === 0) {
      handleNestedChange('billingDetails', 'billingLines', [{
        description: 'Contract payment',
        amount: value,
        frequency: cycle,
        isRecurring: true
      }]);
    }
  }, [formData.contractDetails.value, formData.contractDetails.billingCycle]);

  return (
    <div className="space-y-6">
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
      
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Special Conditions and Contract Terms</h3>
          {addContractTerm && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addContractTerm}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Term
            </Button>
          )}
        </div>
        
        {formData.contractDetails.terms && formData.contractDetails.terms.length > 0 ? (
          <div className="space-y-4">
            {formData.contractDetails.terms.map((term, index) => (
              <Card key={index} className="border border-muted">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <CardTitle className="text-base font-medium">
                    Term {index + 1}: {term.name || 'Untitled Term'}
                  </CardTitle>
                  {removeContractTerm && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeContractTerm(index)}
                      className="h-8 w-8 p-0 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`term-name-${index}`}>Term Name</Label>
                      <Input
                        id={`term-name-${index}`}
                        value={term.name}
                        onChange={(e) => updateContractTerm && updateContractTerm(index, 'name', e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`term-description-${index}`}>Description</Label>
                      <Input
                        id={`term-description-${index}`}
                        value={term.description}
                        onChange={(e) => updateContractTerm && updateContractTerm(index, 'description', e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`term-start-date-${index}`}>Start Date</Label>
                      <Input
                        id={`term-start-date-${index}`}
                        type="date"
                        value={term.startDate}
                        onChange={(e) => updateContractTerm && updateContractTerm(index, 'startDate', e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`term-end-date-${index}`}>End Date</Label>
                      <Input
                        id={`term-end-date-${index}`}
                        type="date"
                        value={term.endDate}
                        onChange={(e) => updateContractTerm && updateContractTerm(index, 'endDate', e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`term-renewal-terms-${index}`}>Renewal Terms</Label>
                      <Input
                        id={`term-renewal-terms-${index}`}
                        value={term.renewalTerms}
                        onChange={(e) => updateContractTerm && updateContractTerm(index, 'renewalTerms', e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`term-termination-period-${index}`}>Termination Period</Label>
                      <Input
                        id={`term-termination-period-${index}`}
                        value={term.terminationPeriod}
                        onChange={(e) => updateContractTerm && updateContractTerm(index, 'terminationPeriod', e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    
                    <div className="col-span-2 flex items-center space-x-2 mt-2">
                      <Checkbox 
                        id={`term-auto-renew-${index}`} 
                        checked={term.autoRenew || false}
                        onCheckedChange={(checked) => updateContractTerm && updateContractTerm(index, 'autoRenew', checked)}
                      />
                      <Label htmlFor={`term-auto-renew-${index}`}>Auto-renew this term</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No special conditions or terms added. Click "Add Term" to create a new condition or term.
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="termination-period">Main Termination Period</Label>
          <Input
            id="termination-period"
            placeholder="e.g., 30 days notice"
            value={formData.contractDetails.terminationPeriod}
            onChange={(e) => handleNestedChange('contractDetails', 'terminationPeriod', e.target.value)}
            className="glass-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="renewal-terms">General Renewal Terms</Label>
          <Textarea
            id="renewal-terms"
            placeholder="Enter renewal terms..."
            rows={3}
            value={formData.contractDetails.renewalTerms}
            onChange={(e) => handleNestedChange('contractDetails', 'renewalTerms', e.target.value)}
            className="glass-input resize-none"
          />
        </div>
      </div>
    </div>
  );
}
