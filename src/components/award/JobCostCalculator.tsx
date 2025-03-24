
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmploymentType, EmployeeLevel, JobCostingParams, JobCostBreakdown, PayCondition } from '@/lib/award/types';
import { calculateJobCost } from '@/lib/award/awardEngine';
import { useAwardSettings } from '@/hooks/useAwardSettings';
import { Loader2, Calculator } from 'lucide-react';

const payConditionLabels: Record<PayCondition, string> = {
  'base': 'Regular Hours (Mon-Fri, 6am-6pm)',
  'shift-early-late': 'Early/Late Shift (before 6am/after 6pm)',
  'saturday': 'Saturday',
  'sunday': 'Sunday',
  'public-holiday': 'Public Holiday',
  'overtime-first-2-hours': 'Overtime (First 2 Hours)',
  'overtime-after-2-hours': 'Overtime (After 2 Hours)',
  'overtime-sunday': 'Sunday Overtime',
  'overtime-public-holiday': 'Public Holiday Overtime'
};

export function JobCostCalculator() {
  const { settings, isLoading: isSettingsLoading } = useAwardSettings();
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full-time');
  const [level, setLevel] = useState<EmployeeLevel>(1);
  const [costBreakdown, setCostBreakdown] = useState<JobCostBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<JobCostingParams>({
    defaultValues: {
      employmentType: 'full-time',
      level: 1,
      hours: {
        'base': 38,
      },
      overheadPercentage: settings?.overheadPercentageDefault || 25,
      marginPercentage: settings?.marginPercentageDefault || 15
    }
  });
  
  // Update default values when settings load
  React.useEffect(() => {
    if (!isSettingsLoading && settings) {
      setValue('overheadPercentage', settings.overheadPercentageDefault);
      setValue('marginPercentage', settings.marginPercentageDefault);
    }
  }, [isSettingsLoading, settings, setValue]);
  
  const handleEmploymentTypeChange = (value: string) => {
    setEmploymentType(value as EmploymentType);
    setValue('employmentType', value as EmploymentType);
  };
  
  const handleLevelChange = (value: string) => {
    setLevel(parseInt(value) as EmployeeLevel);
    setValue('level', parseInt(value) as EmployeeLevel);
  };
  
  const onSubmit = (data: JobCostingParams) => {
    setIsCalculating(true);
    try {
      const result = calculateJobCost(data, settings.baseRateMultiplier);
      setCostBreakdown(result);
    } catch (error) {
      console.error('Error calculating job cost:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Labor Cost Calculator</CardTitle>
          <CardDescription>Calculate labor costs based on the Cleaning Services Award</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select 
                  value={employmentType} 
                  onValueChange={handleEmploymentTypeChange}
                >
                  <SelectTrigger id="employmentType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Employee Level</Label>
                <Select 
                  value={level.toString()} 
                  onValueChange={handleLevelChange}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="py-2">
              <h3 className="text-md font-medium mb-2">Hours Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(payConditionLabels).map(([condition, label]) => (
                  <div key={condition} className="flex items-center gap-2">
                    <Label htmlFor={`hours-${condition}`} className="flex-grow">{label}</Label>
                    <Input
                      id={`hours-${condition}`}
                      className="w-20"
                      type="number"
                      min="0"
                      step="0.5"
                      {...register(`hours.${condition as PayCondition}` as any, { 
                        valueAsNumber: true,
                        min: { value: 0, message: 'Must be at least 0' }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="overheadPercentage">Overhead Percentage (%)</Label>
                <Input
                  id="overheadPercentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  {...register('overheadPercentage', { 
                    required: 'Overhead percentage is required',
                    min: { value: 0, message: 'Minimum overhead is 0%' },
                    max: { value: 100, message: 'Maximum overhead is 100%' },
                    valueAsNumber: true
                  })}
                />
                {errors.overheadPercentage && (
                  <p className="text-sm text-destructive">{errors.overheadPercentage.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="marginPercentage">Margin Percentage (%)</Label>
                <Input
                  id="marginPercentage"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  {...register('marginPercentage', { 
                    required: 'Margin percentage is required',
                    min: { value: 0, message: 'Minimum margin is 0%' },
                    max: { value: 100, message: 'Maximum margin is 100%' },
                    valueAsNumber: true
                  })}
                />
                {errors.marginPercentage && (
                  <p className="text-sm text-destructive">{errors.marginPercentage.message}</p>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isCalculating || isSettingsLoading}
            >
              {isCalculating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calculator className="h-4 w-4 mr-2" />
              )}
              Calculate Cost
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {costBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>
              Based on {employmentType}, level {level} award rates
              {settings.baseRateMultiplier !== 1.0 && ` (adjusted by ${settings.baseRateMultiplier.toFixed(2)}x multiplier)`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="border rounded-md divide-y">
              <div className="p-3 bg-muted/30">
                <h3 className="font-medium">Labor Hours Breakdown</h3>
              </div>
              
              <div className="divide-y">
                {costBreakdown.hourlyBreakdown.map((item, index) => (
                  <div key={index} className="p-3 flex justify-between items-center">
                    <div>
                      <span className="font-medium">{payConditionLabels[item.condition]}</span>
                      <div className="text-sm text-muted-foreground">
                        {item.hours.toFixed(1)} hours @ ${item.rate.toFixed(2)}/hour
                      </div>
                    </div>
                    <div className="text-right font-medium">${item.cost.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border rounded-md divide-y">
              <div className="p-3 bg-muted/30">
                <h3 className="font-medium">Cost Summary</h3>
              </div>
              
              <div className="divide-y">
                <div className="p-3 flex justify-between">
                  <span>Direct Labor Cost</span>
                  <span className="font-medium">${costBreakdown.laborCost.toFixed(2)}</span>
                </div>
                
                <div className="p-3 flex justify-between">
                  <span>Overhead ({watch('overheadPercentage')}%)</span>
                  <span className="font-medium">${costBreakdown.overheadCost.toFixed(2)}</span>
                </div>
                
                <div className="p-3 flex justify-between">
                  <span>Cost Before Margin</span>
                  <span className="font-medium">${costBreakdown.totalCostBeforeMargin.toFixed(2)}</span>
                </div>
                
                <div className="p-3 flex justify-between">
                  <span>Margin ({watch('marginPercentage')}%)</span>
                  <span className="font-medium">${costBreakdown.margin.toFixed(2)}</span>
                </div>
                
                <div className="p-3 flex justify-between font-bold">
                  <span>Total Price</span>
                  <span>${costBreakdown.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
