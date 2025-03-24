
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { QuoteShift } from '@/lib/award/types';
import { calculateShiftCost } from '@/lib/award/shiftCalculations';
import { calculateHourDifference, hasEarlyLateHours } from '@/lib/award/utils';
import { Calculator, ArrowRightLeft, Lightbulb } from 'lucide-react';

interface ScenarioComparerProps {
  shift: QuoteShift;
  onApplyScenario: (updatedShift: QuoteShift) => void;
}

export function ScenarioComparer({ shift, onApplyScenario }: ScenarioComparerProps) {
  const [scenario, setScenario] = useState<QuoteShift>({...shift});
  const [originalCost, setOriginalCost] = useState<number>(shift.estimatedCost);
  const [scenarioCost, setScenarioCost] = useState<number>(shift.estimatedCost);
  const [savings, setSavings] = useState<number>(0);
  const [savingsPercentage, setSavingsPercentage] = useState<number>(0);
  
  useEffect(() => {
    // Recalculate costs when scenario changes
    const newCost = calculateShiftCost(scenario);
    setScenarioCost(newCost);
    
    // Calculate savings
    const diff = originalCost - newCost;
    setSavings(diff);
    
    // Calculate savings percentage
    if (originalCost > 0) {
      setSavingsPercentage((diff / originalCost) * 100);
    }
  }, [scenario, originalCost]);
  
  const handleScenarioChange = (field: keyof QuoteShift, value: any) => {
    setScenario(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const applyScenario = () => {
    onApplyScenario(scenario);
  };
  
  const optimizeForCost = () => {
    // Simple optimization strategy: avoid early/late hours
    let optimizedShift = {...scenario};
    
    // If current shift has early/late penalties
    if (hasEarlyLateHours(scenario.startTime, scenario.endTime)) {
      // Try to move to regular hours (9am-5pm) while maintaining shift duration
      const currentHours = calculateHourDifference(scenario.startTime, scenario.endTime, scenario.breakDuration);
      
      // Adjusted start time (not too early)
      optimizedShift.startTime = "09:00";
      
      // Calculate new end time based on current duration
      const [startHour, startMinute] = optimizedShift.startTime.split(':').map(Number);
      let endHour = startHour + Math.floor(currentHours);
      let endMinute = startMinute + Math.round((currentHours % 1) * 60);
      
      if (endMinute >= 60) {
        endHour += 1;
        endMinute -= 60;
      }
      
      // Format the end time
      optimizedShift.endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      setScenario(optimizedShift);
    }
    
    // If shift is on weekend, we could suggest moving to weekday
    if (scenario.day === 'saturday' || scenario.day === 'sunday') {
      // Suggest changing to a weekday
      optimizedShift.day = 'monday';
      setScenario(optimizedShift);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          What-If Scenario Builder
        </CardTitle>
        <CardDescription>
          Adjust shift parameters to see how they affect costs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Original Cost</Label>
            <div className="text-2xl font-bold">${originalCost.toFixed(2)}</div>
          </div>
          <div>
            <Label>Scenario Cost</Label>
            <div className="text-2xl font-bold flex items-center gap-2">
              ${scenarioCost.toFixed(2)}
              {savings !== 0 && (
                <span className={`text-sm ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {savings > 0 ? '↓' : '↑'} {Math.abs(savingsPercentage).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scenario-day">Day</Label>
            <Select 
              value={scenario.day} 
              onValueChange={(value) => handleScenarioChange('day', value)}
            >
              <SelectTrigger id="scenario-day">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="public-holiday">Public Holiday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scenario-employment-type">Employment Type</Label>
            <Select 
              value={scenario.employmentType} 
              onValueChange={(value) => handleScenarioChange('employmentType', value)}
            >
              <SelectTrigger id="scenario-employment-type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scenario-start-time">Start Time</Label>
            <Input
              id="scenario-start-time"
              type="time"
              value={scenario.startTime}
              onChange={(e) => handleScenarioChange('startTime', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scenario-end-time">End Time</Label>
            <Input
              id="scenario-end-time"
              type="time"
              value={scenario.endTime}
              onChange={(e) => handleScenarioChange('endTime', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scenario-break-duration">Break Duration: {scenario.breakDuration} minutes</Label>
          <Slider
            id="scenario-break-duration"
            defaultValue={[scenario.breakDuration]}
            max={60}
            step={5}
            onValueChange={(value) => handleScenarioChange('breakDuration', value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scenario-number-of-cleaners">Number of Cleaners: {scenario.numberOfCleaners}</Label>
          <Slider
            id="scenario-number-of-cleaners"
            defaultValue={[scenario.numberOfCleaners]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => handleScenarioChange('numberOfCleaners', value[0])}
          />
        </div>
        
        {hasEarlyLateHours(scenario.startTime, scenario.endTime) && (
          <div className="bg-amber-50 p-3 rounded-md text-sm border border-amber-200">
            <div className="flex items-start gap-2">
              <ArrowRightLeft className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <span className="font-medium">Early/Late Hours Detected</span>
                <p className="text-xs text-amber-700 mt-1">
                  Moving start time to after 6:00 AM and end time to before 6:00 PM could reduce costs.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {savings > 0 && (
          <div className="bg-green-50 p-3 rounded-md text-sm border border-green-200">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <span className="font-medium">Cost Savings Found</span>
                <p className="text-xs text-green-700 mt-1">
                  This scenario saves ${savings.toFixed(2)} ({savingsPercentage.toFixed(1)}%) compared to the original shift.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={optimizeForCost}>
          <Lightbulb className="h-4 w-4 mr-2" />
          Optimize for Cost
        </Button>
        <Button onClick={applyScenario}>
          Apply Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
