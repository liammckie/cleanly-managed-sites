
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteShift } from '@/lib/types/award/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ScenarioComparerProps {
  scenarios: Array<{
    name: string;
    shifts: QuoteShift[];
    totalCost: number;
  }>;
  onApplyScenario: (scenarioIndex: number) => void;
}

export function ScenarioComparer({ scenarios, onApplyScenario }: ScenarioComparerProps) {
  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Function to generate a summary of shifts
  const getShiftSummary = (shifts: QuoteShift[]) => {
    const daysCount: Record<string, number> = {};
    let totalHours = 0;
    let totalCleaners = 0;
    
    shifts.forEach(shift => {
      // Count shifts per day
      daysCount[shift.day] = (daysCount[shift.day] || 0) + 1;
      
      // Calculate hours
      const startParts = shift.startTime.split(':').map(Number);
      const endParts = shift.endTime.split(':').map(Number);
      
      const startMinutes = startParts[0] * 60 + startParts[1];
      const endMinutes = endParts[0] * 60 + endParts[1];
      
      // Handle overnight shifts
      let durationMinutes = endMinutes - startMinutes;
      if (durationMinutes < 0) {
        durationMinutes += 24 * 60; // Add a full day in minutes
      }
      
      // Subtract break duration
      durationMinutes -= shift.breakDuration;
      
      const hours = durationMinutes / 60;
      totalHours += hours * shift.numberOfCleaners;
      totalCleaners += shift.numberOfCleaners;
    });
    
    const daysWithShifts = Object.keys(daysCount).length;
    
    return {
      daysWithShifts,
      totalHours: Number(totalHours.toFixed(2)),
      totalCleaners,
      averageHoursPerDay: daysWithShifts > 0 ? Number((totalHours / daysWithShifts).toFixed(2)) : 0,
      shiftsPerDay: Object.entries(daysCount).map(([day, count]) => ({ day, count }))
    };
  };

  if (scenarios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Scenarios Available</CardTitle>
          <CardDescription>Create or load scenarios to compare</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scenarios.map((scenario, index) => {
        const summary = getShiftSummary(scenario.shifts);
        
        return (
          <Card key={index} className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {scenario.name}
                <Badge>{formatCurrency(scenario.totalCost)}</Badge>
              </CardTitle>
              <CardDescription>
                {summary.daysWithShifts} days, {summary.totalHours} hours total
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Schedule</Label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    {summary.shiftsPerDay.map(({ day, count }) => (
                      <Badge key={day} variant="outline" className="text-xs">
                        {day.charAt(0).toUpperCase() + day.slice(1)}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Total Cleaners</Label>
                    <p className="text-sm font-medium">{summary.totalCleaners}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Avg Hours/Day</Label>
                    <p className="text-sm font-medium">{summary.averageHoursPerDay}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-4 mt-auto">
              <Button 
                onClick={() => onApplyScenario(index)} 
                variant="secondary" 
                className="w-full"
              >
                Apply Scenario
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
