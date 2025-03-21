
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SiteFormData } from '../siteFormTypes';

interface BillingDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function BillingDetailsStep({ formData, handleNestedChange }: BillingDetailsStepProps) {
  return (
    <div className="glass-card p-6 space-y-6">
      <h3 className="text-lg font-medium">Billing Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rate">Rate</Label>
          <Input
            id="rate"
            placeholder="e.g., $250 per week"
            value={formData.billingDetails.rate}
            onChange={(e) => handleNestedChange('billingDetails', 'rate', e.target.value)}
            className="glass-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="billing-frequency">Billing Frequency</Label>
          <Select 
            value={formData.billingDetails.billingFrequency} 
            onValueChange={(value) => handleNestedChange('billingDetails', 'billingFrequency', value)}
          >
            <SelectTrigger id="billing-frequency" className="glass-input">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="fortnightly">Fortnightly</SelectItem>
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
            <SelectContent className="glass">
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
            <SelectContent className="glass">
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
            placeholder="Client account number"
            value={formData.billingDetails.accountNumber}
            onChange={(e) => handleNestedChange('billingDetails', 'accountNumber', e.target.value)}
            className="glass-input"
          />
        </div>
      </div>
    </div>
  );
}
