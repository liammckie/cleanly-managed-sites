
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { SiteFormData } from '../siteFormTypes';
import { Card } from '@/components/ui/card';

interface BillingDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  handleDoubleNestedChange: (section: keyof SiteFormData, subsection: string, field: string, value: any) => void;
  addBillingLine?: () => void;
  removeBillingLine?: (index: number) => void;
  updateBillingLine?: (index: number, field: string, value: any) => void;
}

export function BillingDetailsStep({ 
  formData, 
  handleNestedChange, 
  handleDoubleNestedChange,
  addBillingLine,
  removeBillingLine,
  updateBillingLine
}: BillingDetailsStepProps) {
  // Calculate annual forecast based on billing lines
  useEffect(() => {
    if (formData.billingDetails.billingLines && formData.billingDetails.billingLines.length > 0) {
      let annualAmount = 0;
      
      formData.billingDetails.billingLines.forEach(line => {
        const amount = parseFloat(line.amount?.toString() || '0');
        if (isNaN(amount)) return;
        
        switch (line.frequency) {
          case 'weekly':
            annualAmount += amount * 52;
            break;
          case 'fortnightly':
            annualAmount += amount * 26;
            break;
          case 'monthly':
            annualAmount += amount * 12;
            break;
          case 'quarterly':
            annualAmount += amount * 4;
            break;
          case 'annually':
            annualAmount += amount;
            break;
          default:
            annualAmount += amount * 12; // default to monthly
        }
      });
      
      handleNestedChange('billingDetails', 'annualForecast', annualAmount.toFixed(2));
    }
  }, [formData.billingDetails.billingLines]);

  // Update address fields when useSiteAddress changes
  const handleAddressToggle = (checked: boolean) => {
    handleNestedChange('billingDetails', 'useSiteAddress', checked);
    
    if (checked) {
      handleNestedChange('billingDetails', 'billingAddress', formData.address);
      handleNestedChange('billingDetails', 'billingCity', formData.city);
      handleNestedChange('billingDetails', 'billingState', formData.state);
      handleNestedChange('billingDetails', 'billingPostcode', formData.postcode);
    }
  };

  const frequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "fortnightly", label: "Fortnightly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annually", label: "Annually" },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Billing Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="billing-frequency">Billing Frequency</Label>
            <select
              id="billing-frequency"
              className="w-full border border-gray-300 rounded-md px-3 py-2 glass-input"
              value={formData.billingDetails.billingFrequency}
              onChange={(e) => handleNestedChange('billingDetails', 'billingFrequency', e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment-terms">Payment Terms</Label>
            <select
              id="payment-terms"
              className="w-full border border-gray-300 rounded-md px-3 py-2 glass-input"
              value={formData.billingDetails.paymentTerms}
              onChange={(e) => handleNestedChange('billingDetails', 'paymentTerms', e.target.value)}
            >
              <option value="7 days">7 Days</option>
              <option value="14 days">14 Days</option>
              <option value="30 days">30 Days</option>
              <option value="60 days">60 Days</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="invoice-method">Invoice Method</Label>
            <select
              id="invoice-method"
              className="w-full border border-gray-300 rounded-md px-3 py-2 glass-input"
              value={formData.billingDetails.invoiceMethod}
              onChange={(e) => handleNestedChange('billingDetails', 'invoiceMethod', e.target.value)}
            >
              <option value="email">Email</option>
              <option value="mail">Mail</option>
              <option value="portal">Client Portal</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="billing-email">Billing Email</Label>
            <Input
              id="billing-email"
              type="email"
              placeholder="billing@example.com"
              value={formData.billingDetails.billingEmail}
              onChange={(e) => handleNestedChange('billingDetails', 'billingEmail', e.target.value)}
              className="glass-input"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="use-site-address" 
            checked={formData.billingDetails.useSiteAddress}
            onCheckedChange={handleAddressToggle}
          />
          <label
            htmlFor="use-site-address"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use Site Address for Billing
          </label>
        </div>
        
        {!formData.billingDetails.useSiteAddress && (
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="billing-address">Billing Address</Label>
              <Input
                id="billing-address"
                placeholder="Enter address"
                value={formData.billingDetails.billingAddress}
                onChange={(e) => handleNestedChange('billingDetails', 'billingAddress', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billing-city">City</Label>
                <Input
                  id="billing-city"
                  placeholder="City"
                  value={formData.billingDetails.billingCity}
                  onChange={(e) => handleNestedChange('billingDetails', 'billingCity', e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-state">State</Label>
                <Input
                  id="billing-state"
                  placeholder="State"
                  value={formData.billingDetails.billingState}
                  onChange={(e) => handleNestedChange('billingDetails', 'billingState', e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-postcode">Postcode</Label>
                <Input
                  id="billing-postcode"
                  placeholder="Postcode"
                  value={formData.billingDetails.billingPostcode}
                  onChange={(e) => handleNestedChange('billingDetails', 'billingPostcode', e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Billing Lines</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addBillingLine}
            className="flex items-center gap-1"
          >
            <PlusCircle size={16} />
            <span>Add Billing Line</span>
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.billingDetails.billingLines && formData.billingDetails.billingLines.map((line, index) => (
            <Card key={line.id || index} className="p-4 border border-muted relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor={`line-${index}-description`}>Description</Label>
                  <Input
                    id={`line-${index}-description`}
                    placeholder="Line item description"
                    value={line.description}
                    onChange={(e) => updateBillingLine && updateBillingLine(index, 'description', e.target.value)}
                    className="glass-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`line-${index}-amount`}>Amount</Label>
                  <Input
                    id={`line-${index}-amount`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={line.amount}
                    onChange={(e) => updateBillingLine && updateBillingLine(index, 'amount', parseFloat(e.target.value))}
                    className="glass-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div className="space-y-2">
                  <Label htmlFor={`line-${index}-frequency`}>Frequency</Label>
                  <select
                    id={`line-${index}-frequency`}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 glass-input"
                    value={line.frequency}
                    onChange={(e) => updateBillingLine && updateBillingLine(index, 'frequency', e.target.value)}
                  >
                    {frequencyOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox 
                    id={`line-${index}-recurring`} 
                    checked={line.isRecurring}
                    onCheckedChange={(checked) => updateBillingLine && updateBillingLine(index, 'isRecurring', !!checked)}
                  />
                  <label
                    htmlFor={`line-${index}-recurring`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Recurring Charge
                  </label>
                </div>
              </div>
              
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBillingLine && removeBillingLine(index)}
                  className="absolute top-2 right-2 h-8 w-8 p-0 text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </Card>
          ))}
          
          <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
            <div className="flex justify-between">
              <Label className="font-medium">Annual Revenue Forecast:</Label>
              <span className="font-bold">
                ${formData.billingDetails.annualForecast || '0.00'}
              </span>
            </div>
            
            {formData.jobSpecifications.serviceDeliveryType === 'contractor' && formData.jobSpecifications.annualContractorCost && (
              <>
                <div className="flex justify-between mt-2">
                  <Label className="font-medium">Annual Contractor Cost:</Label>
                  <span className="font-bold text-red-600">
                    -${formData.jobSpecifications.annualContractorCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-blue-200">
                  <Label className="font-medium">Projected Annual Profit:</Label>
                  <span className={`font-bold ${(parseFloat(formData.billingDetails.annualForecast || '0') - (formData.jobSpecifications.annualContractorCost || 0)) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${((parseFloat(formData.billingDetails.annualForecast || '0') - (formData.jobSpecifications.annualContractorCost || 0))).toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Purchase Order Details</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="po-required" 
            checked={formData.billingDetails.purchaseOrderRequired}
            onCheckedChange={(checked) => handleNestedChange('billingDetails', 'purchaseOrderRequired', !!checked)}
          />
          <label
            htmlFor="po-required"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Purchase Order Required
          </label>
        </div>
        
        {formData.billingDetails.purchaseOrderRequired && (
          <div className="space-y-2 mt-2">
            <Label htmlFor="po-number">Purchase Order Number</Label>
            <Input
              id="po-number"
              placeholder="Enter PO number"
              value={formData.billingDetails.purchaseOrderNumber}
              onChange={(e) => handleNestedChange('billingDetails', 'purchaseOrderNumber', e.target.value)}
              className="glass-input"
            />
          </div>
        )}
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Additional Billing Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="account-number">Account Number</Label>
            <Input
              id="account-number"
              placeholder="Enter account number"
              value={formData.billingDetails.accountNumber}
              onChange={(e) => handleNestedChange('billingDetails', 'accountNumber', e.target.value)}
              className="glass-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tax-id">Tax ID</Label>
            <Input
              id="tax-id"
              placeholder="Enter tax ID"
              value={formData.billingDetails.taxId}
              onChange={(e) => handleNestedChange('billingDetails', 'taxId', e.target.value)}
              className="glass-input"
            />
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <Label htmlFor="billing-notes">Billing Notes</Label>
          <Textarea
            id="billing-notes"
            placeholder="Enter any additional billing notes..."
            rows={4}
            value={formData.billingDetails.notes}
            onChange={(e) => handleNestedChange('billingDetails', 'notes', e.target.value)}
            className="glass-input resize-none"
          />
        </div>
      </div>
    </div>
  );
}
