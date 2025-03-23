import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData } from '../../siteFormTypes';
import { LaborPlanSection } from './LaborPlanSection';

interface ServiceDeliveryMethodProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  annualDirectCost: number;
  annualContractorCost: number;
  profitMargin: number;
  annualValue: number;
}

export function ServiceDeliveryMethod({ 
  formData, 
  handleNestedChange,
  annualDirectCost,
  annualContractorCost,
  profitMargin,
  annualValue
}: ServiceDeliveryMethodProps) {
  const [costFrequency, setCostFrequency] = useState<'weekly' | 'monthly' | 'annually'>(
    formData.billingDetails.contractorCostFrequency || 'annually'
  );

  const handleCostFrequencyChange = (value: 'weekly' | 'monthly' | 'annually') => {
    setCostFrequency(value);
    handleNestedChange('billingDetails', 'contractorCostFrequency', value);

    handleNestedChange('billingDetails', 'weeklyContractorCost', 0);
    handleNestedChange('billingDetails', 'monthlyContractorCost', 0);
    handleNestedChange('billingDetails', 'annualContractorCost', 0);
  };

  const handleCostChange = (value: number) => {
    const weeklyValue = costFrequency === 'weekly' ? value : 
                        costFrequency === 'monthly' ? value / 4.33 : 
                        value / 52;
    
    const monthlyValue = costFrequency === 'monthly' ? value : 
                         costFrequency === 'weekly' ? value * 4.33 : 
                         value / 12;
    
    const annualValue = costFrequency === 'annually' ? value : 
                        costFrequency === 'monthly' ? value * 12 : 
                        value * 52;

    handleNestedChange('billingDetails', 'weeklyContractorCost', weeklyValue);
    handleNestedChange('billingDetails', 'monthlyContractorCost', monthlyValue);
    handleNestedChange('billingDetails', 'annualContractorCost', annualValue);
  };

  return (
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
          
          <LaborPlanSection
            formData={formData}
            handleNestedChange={handleNestedChange}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contractor-cost-frequency">Cost Entry Frequency</Label>
            <Select 
              value={costFrequency}
              onValueChange={(value: 'weekly' | 'monthly' | 'annually') => handleCostFrequencyChange(value)}
            >
              <SelectTrigger id="contractor-cost-frequency" className="glass-input">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annually">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractor-cost">
                {costFrequency === 'weekly' ? 'Weekly' : 
                 costFrequency === 'monthly' ? 'Monthly' : 'Annual'} Contractor Cost ($)
              </Label>
              <Input
                id="contractor-cost"
                type="number"
                placeholder="0.00"
                value={
                  costFrequency === 'weekly' ? formData.billingDetails.weeklyContractorCost || '' :
                  costFrequency === 'monthly' ? formData.billingDetails.monthlyContractorCost || '' :
                  formData.billingDetails.annualContractorCost || ''
                }
                onChange={(e) => handleCostChange(parseFloat(e.target.value) || 0)}
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

          <div className="grid grid-cols-3 gap-4 border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
            <div className="space-y-1 text-center">
              <Label className="text-xs text-muted-foreground">Weekly Cost</Label>
              <p className="font-medium">${formData.billingDetails.weeklyContractorCost?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="space-y-1 text-center">
              <Label className="text-xs text-muted-foreground">Monthly Cost</Label>
              <p className="font-medium">${formData.billingDetails.monthlyContractorCost?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="space-y-1 text-center">
              <Label className="text-xs text-muted-foreground">Annual Cost</Label>
              <p className="font-medium">${formData.billingDetails.annualContractorCost?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      )}
      
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
                  : formData.billingDetails.annualContractorCost?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual Profit</p>
              <p className="font-medium">
                ${(annualValue - (formData.billingDetails.serviceDeliveryType === 'direct' 
                  ? annualDirectCost 
                  : formData.billingDetails.annualContractorCost || 0)).toFixed(2)}
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
  );
}
