
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SiteFormData } from '@/components/sites/forms/types/siteFormData';
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';
import { v4 as uuidv4 } from 'uuid';
import BillingLineItem from './billing/BillingLineItem';

interface BillingDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  addBillingLine: () => void;
  updateBillingLine: (id: string, field: string, value: any) => void;
  removeBillingLine: (id: string) => void;
}

export const BillingDetailsStep: React.FC<BillingDetailsStepProps> = ({
  formData,
  handleNestedChange,
  handleDoubleNestedChange,
  addBillingLine,
  updateBillingLine,
  removeBillingLine
}) => {
  const form = useForm();

  const handleAddBillingLine = () => {
    addBillingLine();
  };

  const billingDetails = formData.billingDetails || {};
  const billingLines = billingDetails.billingLines || [];

  return (
    <div className="space-y-4">
      {/* Use Client's Billing Info */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="useClientInfo" 
          checked={billingDetails.useClientInfo || false}
          onCheckedChange={(checked) => handleNestedChange('billingDetails', 'useClientInfo', checked)}
        />
        <Label htmlFor="useClientInfo">Use client billing information</Label>
      </div>

      {/* Billing Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billingMethod">Billing Method</Label>
          <Select 
            value={billingDetails.billingMethod || ''}
            onValueChange={(value) => handleNestedChange('billingDetails', 'billingMethod', value)}
          >
            <SelectTrigger id="billingMethod">
              <SelectValue placeholder="Select billing method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Fee</SelectItem>
              <SelectItem value="hourly">Hourly Rate</SelectItem>
              <SelectItem value="project">Project Based</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Select 
            value={billingDetails.paymentTerms || ''}
            onValueChange={(value) => handleNestedChange('billingDetails', 'paymentTerms', value)}
          >
            <SelectTrigger id="paymentTerms">
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="14days">14 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="cod">Cash on Delivery</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Billing Email */}
      <div className="space-y-2">
        <Label htmlFor="billingEmail">Billing Email</Label>
        <Input 
          id="billingEmail"
          value={billingDetails.billingEmail || ''}
          onChange={(e) => handleNestedChange('billingDetails', 'billingEmail', e.target.value)}
          placeholder="Email for billing communications"
        />
      </div>

      {/* Billing Address */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Billing Address</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingAddress.street">Street Address</Label>
                <Input 
                  id="billingAddress.street"
                  value={(billingDetails.billingAddress?.street || '')}
                  onChange={(e) => handleDoubleNestedChange('billingDetails', 'billingAddress', 'street', e.target.value)}
                  placeholder="123 Main St"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billingAddress.city">City</Label>
                <Input 
                  id="billingAddress.city"
                  value={(billingDetails.billingAddress?.city || '')}
                  onChange={(e) => handleDoubleNestedChange('billingDetails', 'billingAddress', 'city', e.target.value)}
                  placeholder="City"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingAddress.state">State</Label>
                <Input 
                  id="billingAddress.state"
                  value={(billingDetails.billingAddress?.state || '')}
                  onChange={(e) => handleDoubleNestedChange('billingDetails', 'billingAddress', 'state', e.target.value)}
                  placeholder="State"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billingAddress.postalCode">Postal Code</Label>
                <Input 
                  id="billingAddress.postalCode"
                  value={(billingDetails.billingAddress?.postalCode || '')}
                  onChange={(e) => handleDoubleNestedChange('billingDetails', 'billingAddress', 'postalCode', e.target.value)}
                  placeholder="Postal Code"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billingAddress.country">Country</Label>
                <Input 
                  id="billingAddress.country"
                  value={(billingDetails.billingAddress?.country || '')}
                  onChange={(e) => handleDoubleNestedChange('billingDetails', 'billingAddress', 'country', e.target.value)}
                  placeholder="Country"
                  defaultValue="Australia"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Lines */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Billing Lines</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddBillingLine}
            >
              Add Line Item
            </Button>
          </div>
          
          {billingLines.length === 0 ? (
            <p className="text-muted-foreground text-sm">No billing lines added. Click "Add Line Item" to add your first billing line.</p>
          ) : (
            <div>
              {billingLines.map((line) => (
                <BillingLineItem 
                  key={line.id} 
                  billingLine={line} 
                  onUpdate={updateBillingLine} 
                  onRemove={removeBillingLine} 
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
