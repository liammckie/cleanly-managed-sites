
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAwardEngine } from '@/hooks/useAwardEngine';
import { EmployeeLevel, PayCondition, JobCostCalculationInput } from '@/lib/award/types';
import { cleaningServicesAward } from '@/lib/award/awardData';

export function JobCostCalculator() {
  const { calculateShiftCost } = useAwardEngine();
  const [activeTab, setActiveTab] = useState('simple');

  const [level, setLevel] = useState<EmployeeLevel>(3);
  const [hours, setHours] = useState(8);
  const [employmentType, setEmploymentType] = useState<'casual' | 'permanent'>('permanent');
  const [conditions, setConditions] = useState<Record<PayCondition, number>>({
    base: 8,
    saturday: 0,
    sunday: 0,
    publicHoliday: 0,
    earlyMorning: 0,
    evening: 0,
    overnight: 0,
    overtime1: 0,
    overtime2: 0,
    overtime3: 0
  });
  const [overheadPercentage, setOverheadPercentage] = useState(15);
  const [marginPercentage, setMarginPercentage] = useState(20);
  
  const [result, setResult] = useState<any>(null);
  
  const handleCalculate = () => {
    const input: JobCostCalculationInput = {
      level,
      hours,
      employmentType,
      conditions,
      overheadPercentage,
      marginPercentage
    };
    
    const calculationResult = calculateShiftCost(input);
    setResult(calculationResult);
  };
  
  const handleConditionChange = (condition: PayCondition, value: number) => {
    setConditions(prev => ({
      ...prev,
      [condition]: value
    }));
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="simple">Simple Calculator</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Job Cost Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Employee Level</Label>
                  <Select 
                    value={String(level)} 
                    onValueChange={(value) => setLevel(Number(value) as EmployeeLevel)}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {cleaningServicesAward.levels.map(level => (
                        <SelectItem key={level.id} value={String(level.id)}>
                          Level {level.id} (${level.baseRate.toFixed(2)}/hr)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employment-type">Employment Type</Label>
                  <Select 
                    value={employmentType} 
                    onValueChange={(value) => setEmploymentType(value as 'casual' | 'permanent')}
                  >
                    <SelectTrigger id="employment-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </div>
              
              <Button onClick={handleCalculate}>Calculate Cost</Button>
            </CardContent>
          </Card>
          
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Calculation Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Base Rate:</p>
                    <p className="font-medium">${result.baseRate.toFixed(2)}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Hours:</p>
                    <p className="font-medium">{result.totalHours}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Labor Cost:</p>
                    <p className="font-medium">${result.laborCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overhead:</p>
                    <p className="font-medium">${result.overheadCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Margin:</p>
                    <p className="font-medium">${result.margin.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Final Price:</p>
                    <p className="font-medium text-lg">${result.finalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Job Cost Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adv-level">Employee Level</Label>
                  <Select 
                    value={String(level)} 
                    onValueChange={(value) => setLevel(Number(value) as EmployeeLevel)}
                  >
                    <SelectTrigger id="adv-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {cleaningServicesAward.levels.map(level => (
                        <SelectItem key={level.id} value={String(level.id)}>
                          Level {level.id} (${level.baseRate.toFixed(2)}/hr)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adv-employment-type">Employment Type</Label>
                  <Select 
                    value={employmentType} 
                    onValueChange={(value) => setEmploymentType(value as 'casual' | 'permanent')}
                  >
                    <SelectTrigger id="adv-employment-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Hours Breakdown</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="base-hours">Regular Hours</Label>
                      <Input
                        id="base-hours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={conditions.base}
                        onChange={(e) => handleConditionChange('base', Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="saturday-hours">Saturday Hours</Label>
                      <Input
                        id="saturday-hours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={conditions.saturday}
                        onChange={(e) => handleConditionChange('saturday', Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sunday-hours">Sunday Hours</Label>
                      <Input
                        id="sunday-hours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={conditions.sunday}
                        onChange={(e) => handleConditionChange('sunday', Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="publicHoliday-hours">Public Holiday Hours</Label>
                      <Input
                        id="publicHoliday-hours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={conditions.publicHoliday}
                        onChange={(e) => handleConditionChange('publicHoliday', Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="evening-hours">Evening Hours</Label>
                      <Input
                        id="evening-hours"
                        type="number"
                        min="0"
                        step="0.5"
                        value={conditions.evening}
                        onChange={(e) => handleConditionChange('evening', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overhead">Overhead Percentage (%)</Label>
                  <Input
                    id="overhead"
                    type="number"
                    min="0"
                    step="0.5"
                    value={overheadPercentage}
                    onChange={(e) => setOverheadPercentage(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="margin">Margin Percentage (%)</Label>
                  <Input
                    id="margin"
                    type="number"
                    min="0"
                    step="0.5"
                    value={marginPercentage}
                    onChange={(e) => setMarginPercentage(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <Button onClick={handleCalculate}>Calculate Cost</Button>
            </CardContent>
          </Card>
          
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Cost Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Base Rate:</p>
                    <p className="font-medium">${result.baseRate.toFixed(2)}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Hours:</p>
                    <p className="font-medium">{result.totalHours}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Labor Cost:</p>
                    <p className="font-medium">${result.laborCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overhead:</p>
                    <p className="font-medium">${result.overheadCost.toFixed(2)} ({overheadPercentage}%)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost:</p>
                    <p className="font-medium">${result.totalCostBeforeMargin.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Margin:</p>
                    <p className="font-medium">${result.margin.toFixed(2)} ({marginPercentage}%)</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Final Price:</p>
                    <p className="font-medium text-lg">${result.finalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
