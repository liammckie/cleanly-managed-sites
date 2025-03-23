
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteFormData } from '../../siteFormTypes';

interface LaborPlanSectionProps {
  formData: SiteFormData;
  handleNestedChange: (section: keyof SiteFormData, field: string, value: any) => void;
}

export function LaborPlanSection({ formData, handleNestedChange }: LaborPlanSectionProps) {
  return (
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
  );
}
