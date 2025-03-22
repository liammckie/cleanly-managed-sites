
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData } from '../siteFormTypes';
import { BillingFrequency } from '../types/billingTypes';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const handleAddressChange = (field: string, value: string) => {
    handleNestedChange('billingDetails', field, value);
  };
  
  const toggleUseSiteAddress = (checked: boolean) => {
    handleNestedChange('billingDetails', 'useSiteAddress', checked);
    
    if (checked) {
      // Copy site address to billing address
      handleNestedChange('billingDetails', 'billingAddress', formData.address);
      handleNestedChange('billingDetails', 'billingCity', formData.city);
      handleNestedChange('billingDetails', 'billingState', formData.state);
      handleNestedChange('billingDetails', 'billingPostcode', formData.postcode);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Billing Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="billing-frequency">Primary Billing Frequency</Label>
            <Select 
              value={formData.billingDetails.billingFrequency}
              onValueChange={(value) => handleNestedChange('billingDetails', 'billingFrequency', value)}
            >
              <SelectTrigger id="billing-frequency" className="glass-input">
                <SelectValue placeholder="Select billing frequency" />
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
            <Label htmlFor="payment-terms">Payment Terms</Label>
            <Select 
              value={formData.billingDetails.paymentTerms}
              onValueChange={(value) => handleNestedChange('billingDetails', 'paymentTerms', value)}
            >
              <SelectTrigger id="payment-terms" className="glass-input">
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7 days">7 days</SelectItem>
                <SelectItem value="14 days">14 days</SelectItem>
                <SelectItem value="30 days">30 days</SelectItem>
                <SelectItem value="60 days">60 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoice-method">Invoice Method</Label>
            <Select 
              value={formData.billingDetails.invoiceMethod}
              onValueChange={(value) => handleNestedChange('billingDetails', 'invoiceMethod', value)}
            >
              <SelectTrigger id="invoice-method" className="glass-input">
                <SelectValue placeholder="Select invoice method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="mail">Mail</SelectItem>
                <SelectItem value="portal">Client Portal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account-number">Account Number</Label>
            <Input
              id="account-number"
              value={formData.billingDetails.accountNumber}
              onChange={(e) => handleNestedChange('billingDetails', 'accountNumber', e.target.value)}
              className="glass-input"
            />
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Billing Lines</h3>
          {addBillingLine && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addBillingLine}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Billing Line
            </Button>
          )}
        </div>
        
        {formData.billingDetails.billingLines && formData.billingDetails.billingLines.length > 0 ? (
          <div className="space-y-4">
            {formData.billingDetails.billingLines.map((line, index) => (
              <Card key={index} className="border border-muted">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <CardTitle className="text-base font-medium">
                    Billing Line {index + 1}
                  </CardTitle>
                  {removeBillingLine && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeBillingLine(index)}
                      className="h-8 w-8 p-0 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`billing-line-description-${index}`}>Description</Label>
                      <Input
                        id={`billing-line-description-${index}`}
                        value={line.description}
                        onChange={(e) => updateBillingLine && updateBillingLine(index, 'description', e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`billing-line-amount-${index}`}>Amount ($)</Label>
                      <Input
                        id={`billing-line-amount-${index}`}
                        type="number"
                        step="0.01"
                        value={line.amount}
                        onChange={(e) => updateBillingLine && updateBillingLine(index, 'amount', parseFloat(e.target.value))}
                        className="glass-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`billing-line-frequency-${index}`}>Frequency</Label>
                      <Select 
                        value={line.frequency as string}
                        onValueChange={(value) => updateBillingLine && updateBillingLine(index, 'frequency', value as BillingFrequency)}
                      >
                        <SelectTrigger id={`billing-line-frequency-${index}`} className="glass-input">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox 
                        id={`billing-line-recurring-${index}`} 
                        checked={line.isRecurring}
                        onCheckedChange={(checked) => updateBillingLine && updateBillingLine(index, 'isRecurring', !!checked)}
                      />
                      <Label htmlFor={`billing-line-recurring-${index}`}>Recurring billing</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No billing lines added. Click "Add Billing Line" to create a new billing item.
          </div>
        )}
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Purchase Order Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="po-required" 
                checked={formData.billingDetails.purchaseOrderRequired}
                onCheckedChange={(checked) => handleNestedChange('billingDetails', 'purchaseOrderRequired', !!checked)}
              />
              <Label htmlFor="po-required">Purchase Order Required</Label>
            </div>
          </div>
          
          {formData.billingDetails.purchaseOrderRequired && (
            <div className="space-y-2">
              <Label htmlFor="po-number">Purchase Order Number</Label>
              <Input
                id="po-number"
                value={formData.billingDetails.purchaseOrderNumber}
                onChange={(e) => handleNestedChange('billingDetails', 'purchaseOrderNumber', e.target.value)}
                className="glass-input"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Billing Address</h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="use-site-address" 
            checked={formData.billingDetails.useSiteAddress}
            onCheckedChange={(checked) => toggleUseSiteAddress(!!checked)}
          />
          <Label htmlFor="use-site-address">Use site address for billing</Label>
        </div>
        
        {!formData.billingDetails.useSiteAddress && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing-address">Address</Label>
              <Input
                id="billing-address"
                value={formData.billingDetails.billingAddress}
                onChange={(e) => handleAddressChange('billingAddress', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing-city">City</Label>
              <Input
                id="billing-city"
                value={formData.billingDetails.billingCity}
                onChange={(e) => handleAddressChange('billingCity', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing-state">State</Label>
              <Input
                id="billing-state"
                value={formData.billingDetails.billingState}
                onChange={(e) => handleAddressChange('billingState', e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing-postcode">Postal Code</Label>
              <Input
                id="billing-postcode"
                value={formData.billingDetails.billingPostcode}
                onChange={(e) => handleAddressChange('billingPostcode', e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-medium">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="billing-email">Billing Email</Label>
            <Input
              id="billing-email"
              type="email"
              value={formData.billingDetails.billingEmail}
              onChange={(e) => handleNestedChange('billingDetails', 'billingEmail', e.target.value)}
              className="glass-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tax-id">Tax ID</Label>
            <Input
              id="tax-id"
              value={formData.billingDetails.taxId}
              onChange={(e) => handleNestedChange('billingDetails', 'taxId', e.target.value)}
              className="glass-input"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="billing-notes">Billing Notes</Label>
          <Textarea
            id="billing-notes"
            value={formData.billingDetails.notes}
            onChange={(e) => handleNestedChange('billingDetails', 'notes', e.target.value)}
            rows={3}
            className="glass-input resize-none"
          />
        </div>
      </div>
    </div>
  );
}
