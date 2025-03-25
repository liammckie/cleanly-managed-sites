
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteFormData } from '../../types/siteFormData';

interface LaborPlanSectionProps {
  formData: SiteFormData;
  updateFormField: (section: keyof SiteFormData, field: string, value: any) => void;
  errors: Record<string, string>;
}

export function LaborPlanSection({ 
  formData, 
  updateFormField,
  errors
}: LaborPlanSectionProps) {
  // Initialize laborPlan if it doesn't exist
  if (!formData.billingDetails) {
    updateFormField('billingDetails', 'laborPlan', {
      staffingLevel: 'direct_employees',
      headcount: 1,
      hoursPerWeek: 0,
      costPerHour: 0,
    });
  } else if (!formData.billingDetails.laborPlan) {
    const updatedBillingDetails = {
      ...formData.billingDetails,
      laborPlan: {
        staffingLevel: 'direct_employees',
        headcount: 1,
        hoursPerWeek: 0,
        costPerHour: 0,
      }
    };
    updateFormField('billingDetails', 'laborPlan', updatedBillingDetails.laborPlan);
  }

  const laborPlan = formData.billingDetails?.laborPlan || {
    staffingLevel: 'direct_employees',
    headcount: 1,
    hoursPerWeek: 0,
    costPerHour: 0,
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Labor Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="staffingLevel">Staffing Type</Label>
            <Select 
              value={laborPlan.staffingLevel || 'direct_employees'} 
              onValueChange={(value) => updateFormField('billingDetails', 'laborPlan.staffingLevel', value)}
            >
              <SelectTrigger id="staffingLevel">
                <SelectValue placeholder="Select staffing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct_employees">Direct Employees</SelectItem>
                <SelectItem value="labor_hire">Labor Hire</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="mixed">Mixed Model</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="headcount">Number of Staff</Label>
            <Input
              id="headcount"
              type="number"
              min="1"
              step="1"
              value={laborPlan.headcount || 1}
              onChange={(e) => updateFormField('billingDetails', 'laborPlan.headcount', parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hoursPerWeek">Hours Per Week</Label>
            <Input
              id="hoursPerWeek"
              type="number"
              min="0"
              step="0.5"
              value={laborPlan.hoursPerWeek || 0}
              onChange={(e) => updateFormField('billingDetails', 'laborPlan.hoursPerWeek', parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div>
            <Label htmlFor="costPerHour">Cost Per Hour</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <Input
                id="costPerHour"
                type="number"
                min="0"
                step="0.01"
                className="pl-8"
                value={laborPlan.costPerHour || 0}
                onChange={(e) => updateFormField('billingDetails', 'laborPlan.costPerHour', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 px-4 py-3 bg-muted rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Estimated Weekly Labor Cost</p>
              <p className="text-xs text-muted-foreground">
                {laborPlan.headcount || 0} staff × {laborPlan.hoursPerWeek || 0} hours × ${laborPlan.costPerHour || 0}
              </p>
            </div>
            <div className="text-xl font-bold">
              ${(((laborPlan.headcount || 1) * (laborPlan.hoursPerWeek || 0) * (laborPlan.costPerHour || 0))).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
