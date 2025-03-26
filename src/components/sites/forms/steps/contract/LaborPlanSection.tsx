
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

interface StaffingLevel {
  staffingLevel: string;
  headcount: number;
  hoursPerWeek: number;
  costPerHour: number;
}

interface LaborPlanSectionProps {
  onChange: (value: any) => void;
}

export const LaborPlanSection: React.FC<LaborPlanSectionProps> = ({ onChange }) => {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contract.laborPlan'
  });
  
  const handleAddLevel = () => {
    append({
      staffingLevel: '',
      headcount: 1,
      hoursPerWeek: 0,
      costPerHour: 0
    });
  };
  
  // Calculate totals
  const calculateTotals = () => {
    const laborPlan = form.getValues('contract.laborPlan') || [];
    
    let totalWeeklyHours = 0;
    let totalWeeklyCost = 0;
    let totalHeadcount = 0;
    
    laborPlan.forEach((level: StaffingLevel | string) => {
      if (typeof level !== 'string') {
        totalHeadcount += level.headcount || 0;
        totalWeeklyHours += (level.headcount || 0) * (level.hoursPerWeek || 0);
        totalWeeklyCost += (level.headcount || 0) * (level.hoursPerWeek || 0) * (level.costPerHour || 0);
      }
    });
    
    return {
      totalHeadcount,
      totalWeeklyHours,
      totalWeeklyCost,
      totalMonthlyCost: totalWeeklyCost * 4.33,
      totalAnnualCost: totalWeeklyCost * 52
    };
  };
  
  const totals = calculateTotals();
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Labor Plan</CardTitle>
      </CardHeader>
      
      <CardContent>
        {fields.length === 0 ? (
          <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
            No labor plan items added. Click the button below to add a staffing level.
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((field, index) => {
              const staffingLevel = field as unknown as StaffingLevel;
              return (
                <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start pb-4 border-b">
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name={`contract.laborPlan.${index}.staffingLevel`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Staff Level</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={staffingLevel.staffingLevel}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="supervisor">Supervisor</SelectItem>
                              <SelectItem value="team_lead">Team Lead</SelectItem>
                              <SelectItem value="cleaner">Cleaner</SelectItem>
                              <SelectItem value="specialist">Specialist</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name={`contract.laborPlan.${index}.headcount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Headcount</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseInt(e.target.value) || 1);
                                onChange(form.getValues('contract.laborPlan'));
                              }}
                              value={staffingLevel.headcount || 1}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="sm:col-span-3">
                    <FormField
                      control={form.control}
                      name={`contract.laborPlan.${index}.hoursPerWeek`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours/Week</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              step={0.5} 
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                                onChange(form.getValues('contract.laborPlan'));
                              }}
                              value={staffingLevel.hoursPerWeek || 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name={`contract.laborPlan.${index}.costPerHour`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost/Hour</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              step={0.01}
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                                onChange(form.getValues('contract.laborPlan'));
                              }}
                              value={staffingLevel.costPerHour || 0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="sm:col-span-1 pt-8">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        remove(index);
                        onChange(form.getValues('contract.laborPlan'));
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="sm:col-span-12">
                    <div className="text-sm text-muted-foreground">
                      Weekly Cost: ${((staffingLevel.headcount || 0) * (staffingLevel.hoursPerWeek || 0) * (staffingLevel.costPerHour || 0)).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={handleAddLevel}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Staffing Level
        </Button>
      </CardContent>
      
      <CardFooter className="flex-col items-start">
        <div className="w-full border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Total Headcount:</span>
            <span className="font-medium">{totals.totalHeadcount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total Weekly Hours:</span>
            <span className="font-medium">{totals.totalWeeklyHours.toFixed(1)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Weekly Labor Cost:</span>
            <span className="font-medium">${totals.totalWeeklyCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Monthly Labor Cost:</span>
            <span className="font-medium">${totals.totalMonthlyCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Annual Labor Cost:</span>
            <span>${totals.totalAnnualCost.toFixed(2)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
