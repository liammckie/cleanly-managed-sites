
import React from 'react';
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
  );
}
