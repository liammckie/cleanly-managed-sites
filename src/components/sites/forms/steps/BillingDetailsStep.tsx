import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, PauseCircle, AlertCircle } from 'lucide-react';
import { SiteFormData } from '../siteFormTypes';
import { Card } from '@/components/ui/card';
import { BillingLineItem } from '../BillingLineItem';
import { BillingDetailsSummary } from './BillingDetailsSummary';
import { calculateTotalBillingAmounts, isSiteBillingOnHold } from '@/lib/utils/billingCalculations';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { BillingLine } from '../types/billingTypes';

interface BillingDetailsStepProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
  handleDoubleNestedChange: (section: keyof SiteFormData, subsection: string, field: string, value: any) => void;
  addBillingLine?: () => void;
  removeBillingLine?: (id: string) => void;
  updateBillingLine?: (id: string, field: string, value: any) => void;
}

export function BillingDetailsStep({ 
  formData, 
  handleNestedChange, 
  handleDoubleNestedChange,
  addBillingLine,
  removeBillingLine,
  updateBillingLine
}: BillingDetailsStepProps) {
  // Calculate total amounts across all billing lines
  useEffect(() => {
    if (formData.billingDetails.billingLines && formData.billingDetails.billingLines.length > 0) {
      const { totalWeeklyAmount, totalMonthlyAmount, totalAnnualAmount } = calculateTotalBillingAmounts(
        formData.billingDetails.billingLines
      );
      
      handleNestedChange('billingDetails', 'totalWeeklyAmount', totalWeeklyAmount);
      handleNestedChange('billingDetails', 'totalMonthlyAmount', totalMonthlyAmount);
      handleNestedChange('billingDetails', 'totalAnnualAmount', totalAnnualAmount);
      handleNestedChange('billingDetails', 'annualForecast', totalAnnualAmount.toString());
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

  // Toggle billing hold for the entire site
  const toggleSiteHold = () => {
    const currentHoldState = formData.billingDetails.billingOnHold || false;
    
    // If turning on hold, set the start date to today
    if (!currentHoldState) {
      handleNestedChange('billingDetails', 'billingOnHold', true);
      handleNestedChange('billingDetails', 'billingHoldStartDate', format(new Date(), 'yyyy-MM-dd'));
    } else {
      handleNestedChange('billingDetails', 'billingOnHold', false);
    }
  };

  // Check if billing is currently on hold
  const isBillingOnHold = isSiteBillingOnHold(formData.billingDetails.billingOnHold);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <div className="space-y-6">
      {/* Billing Summary */}
      <BillingDetailsSummary billingDetails={formData.billingDetails} />
      
      <div className="glass-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Billing Details</h3>
          
          {/* Site-wide billing hold button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className={isBillingOnHold ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
              >
                <PauseCircle size={16} className="mr-1" />
                {isBillingOnHold ? "Billing On Hold" : "Place All Billing On Hold"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">
                  {isBillingOnHold ? "Resume All Billing" : "Place All Billing On Hold"}
                </h4>

                {!isBillingOnHold ? (
                  <>
                    <div className="space-y-2">
                      <Label>Hold Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            {formData.billingDetails.billingHoldStartDate ? 
                              formatDate(formData.billingDetails.billingHoldStartDate) : 
                              "Select start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.billingDetails.billingHoldStartDate ? 
                              new Date(formData.billingDetails.billingHoldStartDate) : 
                              undefined}
                            onSelect={(date) => handleNestedChange(
                              'billingDetails', 
                              'billingHoldStartDate', 
                              date ? format(date, 'yyyy-MM-dd') : undefined
                            )}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Hold End Date (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            {formData.billingDetails.billingHoldEndDate ? 
                              formatDate(formData.billingDetails.billingHoldEndDate) : 
                              "Select end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.billingDetails.billingHoldEndDate ? 
                              new Date(formData.billingDetails.billingHoldEndDate) : 
                              undefined}
                            onSelect={(date) => handleNestedChange(
                              'billingDetails', 
                              'billingHoldEndDate', 
                              date ? format(date, 'yyyy-MM-dd') : undefined
                            )}
                            initialFocus
                            disabled={(date) => {
                              if (!formData.billingDetails.billingHoldStartDate) return false;
                              return date < new Date(formData.billingDetails.billingHoldStartDate);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hold-reason">Reason for Hold</Label>
                      <Textarea
                        id="hold-reason"
                        placeholder="Enter reason for placing billing on hold"
                        value={formData.billingDetails.billingHoldReason || ''}
                        onChange={(e) => handleNestedChange('billingDetails', 'billingHoldReason', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-yellow-800 flex items-start">
                    <AlertCircle size={18} className="mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Billing is currently on hold</p>
                      <p className="text-sm mt-1">
                        {formData.billingDetails.billingHoldStartDate && 
                          `Started: ${formatDate(formData.billingDetails.billingHoldStartDate)}`}
                        {formData.billingDetails.billingHoldEndDate && 
                          ` - End: ${formatDate(formData.billingDetails.billingHoldEndDate)}`}
                      </p>
                      {formData.billingDetails.billingHoldReason && (
                        <p className="text-sm mt-1">
                          Reason: {formData.billingDetails.billingHoldReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => toggleSiteHold()}>
                    {isBillingOnHold ? "Resume All Billing" : "Confirm Hold"}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
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
          {formData.billingDetails.billingLines && formData.billingDetails.billingLines.map((line: BillingLine) => (
            <BillingLineItem
              key={line.id}
              line={line}
              updateLine={updateBillingLine!}
              removeLine={removeBillingLine!}
              isFirst={formData.billingDetails.billingLines.indexOf(line) === 0}
            />
          ))}
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
