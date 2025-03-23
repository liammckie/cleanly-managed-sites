
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
  const [annualDirectCost, setAnnualDirectCost] = useState<number>(0);
  const [annualContractorCost, setAnnualContractorCost] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(0);

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

  // Calculate annual direct cost based on weekly budget
  useEffect(() => {
    if (formData.billingDetails.serviceDeliveryType === 'direct') {
      const weeklyBudget = formData.billingDetails.weeklyBudget || 0;
      const annualCost = weeklyBudget * 52;
      setAnnualDirectCost(annualCost);
      
      // Calculate profit margin
      if (annualValue > 0) {
        const profit = annualValue - annualCost;
        const margin = (profit / annualValue) * 100;
        setProfitMargin(margin);
      }
    }
  }, [formData.billingDetails.weeklyBudget, annualValue, formData.billingDetails.serviceDeliveryType]);

  // Calculate annual contractor cost
  useEffect(() => {
    if (formData.billingDetails.serviceDeliveryType === 'contractor') {
      const contractorCost = formData.billingDetails.annualContractorCost || 0;
      setAnnualContractorCost(contractorCost);
      
      // Calculate profit margin
      if (annualValue > 0) {
        const profit = annualValue - contractorCost;
        const margin = (profit / annualValue) * 100;
        setProfitMargin(margin);
      }
    }
  }, [formData.billingDetails.annualContractorCost, annualValue, formData.billingDetails.serviceDeliveryType]);

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
      
      {/* Service Delivery Type section */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Service Delivery Method</h3>
        
        <div className="space-y-3">
          <Label>How will services be delivered?</Label>
          <RadioGroup 
            value={formData.billingDetails.serviceDeliveryType || 'direct'} 
            onValueChange={(value) => handleNestedChange('billingDetails', 'serviceDeliveryType', value)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="direct" id="direct" />
              <Label htmlFor="direct">Direct Employees</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="contractor" id="contractor" />
              <Label htmlFor="contractor">Contractor</Label>
            </div>
          </RadioGroup>
        </div>
        
        {formData.billingDetails.serviceDeliveryType === 'direct' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weekly-budget">Weekly Budget ($)</Label>
                <Input
                  id="weekly-budget"
                  type="number"
                  placeholder="0.00"
                  value={formData.billingDetails.weeklyBudget || ''}
                  onChange={(e) => handleNestedChange('billingDetails', 'weeklyBudget', parseFloat(e.target.value))}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Annual Labor Cost Forecast</Label>
                <div className="flex items-center h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <Calculator className="w-4 h-4 mr-2 text-muted-foreground" />
                  ${annualDirectCost.toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* Labor Plan */}
            <Card className="border border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Labor Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="grid grid-cols-7 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="text-center">
                        <Label htmlFor={`day-${day.toLowerCase()}`} className="text-xs">{day}</Label>
                        <div className="mt-1">
                          <Checkbox 
                            id={`day-${day.toLowerCase()}`} 
                            checked={formData.billingDetails.laborPlan?.workingDays?.[day.toLowerCase()] || false}
                            onCheckedChange={(checked) => {
                              const workingDays = {
                                ...(formData.billingDetails.laborPlan?.workingDays || {}),
                                [day.toLowerCase()]: checked
                              };
                              handleNestedChange('billingDetails', 'laborPlan', {
                                ...formData.billingDetails.laborPlan,
                                workingDays
                              });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shift-start-time">Shift Start Time</Label>
                      <Input
                        id="shift-start-time"
                        type="time"
                        value={formData.billingDetails.laborPlan?.shiftStartTime || ''}
                        onChange={(e) => {
                          handleNestedChange('billingDetails', 'laborPlan', {
                            ...formData.billingDetails.laborPlan,
                            shiftStartTime: e.target.value
                          });
                        }}
                        className="glass-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="shift-end-time">Shift End Time</Label>
                      <Input
                        id="shift-end-time"
                        type="time"
                        value={formData.billingDetails.laborPlan?.shiftEndTime || ''}
                        onChange={(e) => {
                          handleNestedChange('billingDetails', 'laborPlan', {
                            ...formData.billingDetails.laborPlan,
                            shiftEndTime: e.target.value
                          });
                        }}
                        className="glass-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="labor-notes">Labor Notes</Label>
                    <Textarea
                      id="labor-notes"
                      placeholder="Enter any additional information about the labor plan..."
                      rows={3}
                      value={formData.billingDetails.laborPlan?.notes || ''}
                      onChange={(e) => {
                        handleNestedChange('billingDetails', 'laborPlan', {
                          ...formData.billingDetails.laborPlan,
                          notes: e.target.value
                        });
                      }}
                      className="glass-input resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual-contractor-cost">Annual Contractor Cost ($)</Label>
              <Input
                id="annual-contractor-cost"
                type="number"
                placeholder="0.00"
                value={formData.billingDetails.annualContractorCost || ''}
                onChange={(e) => handleNestedChange('billingDetails', 'annualContractorCost', parseFloat(e.target.value))}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contractor-invoice-frequency">Contractor Invoice Frequency</Label>
              <Select 
                value={formData.billingDetails.contractorInvoiceFrequency || 'monthly'}
                onValueChange={(value) => handleNestedChange('billingDetails', 'contractorInvoiceFrequency', value)}
              >
                <SelectTrigger id="contractor-invoice-frequency" className="glass-input">
                  <SelectValue placeholder="Select frequency" />
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
        )}
        
        {/* Profit Calculation */}
        {(formData.billingDetails.serviceDeliveryType === 'direct' && formData.billingDetails.weeklyBudget) || 
         (formData.billingDetails.serviceDeliveryType === 'contractor' && formData.billingDetails.annualContractorCost) ? (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h4 className="font-medium mb-2">Profit Calculation</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="font-medium">${annualValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Cost</p>
                <p className="font-medium">
                  ${formData.billingDetails.serviceDeliveryType === 'direct' 
                    ? annualDirectCost.toFixed(2) 
                    : annualContractorCost.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Profit</p>
                <p className="font-medium">
                  ${(annualValue - (formData.billingDetails.serviceDeliveryType === 'direct' 
                    ? annualDirectCost 
                    : annualContractorCost)).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className={`font-medium ${profitMargin < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {profitMargin.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ) : null}
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
