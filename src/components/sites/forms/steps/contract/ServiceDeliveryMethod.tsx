
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SiteFormData } from '../../types/siteFormData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface ServiceDeliveryMethodProps {
  formData: SiteFormData;
  updateFormField: (section: keyof SiteFormData, field: string, value: any) => void;
  errors: Record<string, string>;
}

export function ServiceDeliveryMethod({ 
  formData, 
  updateFormField,
  errors
}: ServiceDeliveryMethodProps) {
  // Initialize if contractorCostFrequency doesn't exist
  if (formData.billingDetails && !formData.billingDetails.contractorCostFrequency) {
    updateFormField('billingDetails', 'contractorCostFrequency', 'weekly');
  }

  // Handle frequency changes and automatic calculations
  const handleFrequencyChange = (value: string) => {
    updateFormField('billingDetails', 'contractorCostFrequency', value);
    recalculateContractorCosts(value);
  };

  const recalculateContractorCosts = (frequency: string) => {
    const billingDetails = formData.billingDetails;
    if (!billingDetails) return;

    let weeklyAmount = 0;
    let monthlyAmount = 0;

    if (frequency === 'weekly' && billingDetails.weeklyContractorCost) {
      weeklyAmount = billingDetails.weeklyContractorCost;
      monthlyAmount = weeklyAmount * 4.33; // 52 weeks / 12 months
    } else if (frequency === 'monthly' && billingDetails.monthlyContractorCost) {
      monthlyAmount = billingDetails.monthlyContractorCost;
      weeklyAmount = monthlyAmount / 4.33;
    } else if (frequency === 'annually' && billingDetails.monthlyContractorCost) {
      const annualAmount = billingDetails.monthlyContractorCost * 12;
      weeklyAmount = annualAmount / 52;
      monthlyAmount = annualAmount / 12;
    }

    updateFormField('billingDetails', 'weeklyContractorCost', parseFloat(weeklyAmount.toFixed(2)));
    updateFormField('billingDetails', 'monthlyContractorCost', parseFloat(monthlyAmount.toFixed(2)));
  };

  const handleWeeklyAmountChange = (value: number) => {
    updateFormField('billingDetails', 'weeklyContractorCost', value);
    updateFormField('billingDetails', 'monthlyContractorCost', parseFloat((value * 4.33).toFixed(2)));
  };

  const handleMonthlyAmountChange = (value: number) => {
    updateFormField('billingDetails', 'monthlyContractorCost', value);
    updateFormField('billingDetails', 'weeklyContractorCost', parseFloat((value / 4.33).toFixed(2)));
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Service Delivery Method</CardTitle>
          <CardDescription>How the service is delivered and billed</CardDescription>
        </div>
        <Popover>
          <PopoverTrigger>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent className="w-80 text-sm">
            <p>Configure how the service is delivered and how contractors are paid.</p>
            <p className="mt-2">
              For contractor payment frequency, select how often you pay the contractor. The system will 
              automatically calculate the equivalent weekly, monthly, and annual costs.
            </p>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Select 
              value={formData.billingDetails?.serviceType || 'cleaning'} 
              onValueChange={(value) => updateFormField('billingDetails', 'serviceType', value)}
            >
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="landscaping">Landscaping</SelectItem>
                <SelectItem value="waste_management">Waste Management</SelectItem>
                <SelectItem value="pest_control">Pest Control</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="deliveryMethod">Delivery Method</Label>
            <Select 
              value={formData.billingDetails?.deliveryMethod || 'direct'} 
              onValueChange={(value) => updateFormField('billingDetails', 'deliveryMethod', value)}
            >
              <SelectTrigger id="deliveryMethod">
                <SelectValue placeholder="Select delivery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct Service</SelectItem>
                <SelectItem value="subcontractor">Subcontractor</SelectItem>
                <SelectItem value="mixed">Mixed Model</SelectItem>
                <SelectItem value="self_performed">Self-Performed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">Contractor Payment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contractorCostFrequency">Payment Frequency</Label>
              <Select 
                value={formData.billingDetails?.contractorCostFrequency || 'weekly'} 
                onValueChange={handleFrequencyChange}
              >
                <SelectTrigger id="contractorCostFrequency">
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
            
            <div>
              <Label htmlFor="weeklyContractorCost">Weekly Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <Input
                  id="weeklyContractorCost"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-8"
                  value={formData.billingDetails?.weeklyContractorCost || ''}
                  onChange={(e) => handleWeeklyAmountChange(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="monthlyContractorCost">Monthly Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <Input
                  id="monthlyContractorCost"
                  type="number"
                  min="0"
                  step="0.01"
                  className="pl-8"
                  value={formData.billingDetails?.monthlyContractorCost || ''}
                  onChange={(e) => handleMonthlyAmountChange(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="contractorInvoiceFrequency">Contractor Invoice Frequency</Label>
            <Select 
              value={formData.billingDetails?.contractorInvoiceFrequency || 'monthly'} 
              onValueChange={(value) => updateFormField('billingDetails', 'contractorInvoiceFrequency', value)}
            >
              <SelectTrigger id="contractorInvoiceFrequency">
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
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">Cost Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">Weekly Cost</p>
              <p className="text-lg font-bold">${(formData.billingDetails?.weeklyContractorCost || 0).toFixed(2)}</p>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">Monthly Cost</p>
              <p className="text-lg font-bold">${(formData.billingDetails?.monthlyContractorCost || 0).toFixed(2)}</p>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">Annual Cost</p>
              <p className="text-lg font-bold">${((formData.billingDetails?.monthlyContractorCost || 0) * 12).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
