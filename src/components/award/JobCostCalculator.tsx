
import React, { useState } from 'react';
import { calculateJobCost } from '@/lib/award/awardEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PayCondition, EmploymentType, EmployeeLevel } from '@/lib/award/types';
import { awardData } from '@/lib/award/awardData';

const payConditionLabels: Record<string, string> = {
  base: 'Base Rate',
  saturday: 'Saturday',
  sunday: 'Sunday',
  publicHoliday: 'Public Holiday',
  earlyMorning: 'Early Morning',
  evening: 'Evening',
  overnight: 'Night Shift',
  overtime1: 'Overtime (1.5x)',
  overtime2: 'Overtime (2x)',
  overtime3: 'Overtime (Public Holiday)'
};

export function JobCostCalculator() {
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [level, setLevel] = useState<EmployeeLevel>(1);
  const [hours, setHours] = useState<Partial<Record<PayCondition, number>>>({
    base: 38,
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
  
  const handleChangeHours = (condition: PayCondition, value: number) => {
    setHours(prev => ({
      ...prev,
      [condition]: value
    }));
  };
  
  const result = calculateJobCost({
    employmentType,
    level,
    hours: Object.values(hours).reduce((sum, val) => sum + (val || 0), 0),
    conditions: hours,
    overheadPercentage,
    marginPercentage
  });
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Cost Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Employee Details</h3>
              <div className="mb-4">
                <label className="block mb-1">Employment Type</label>
                <select 
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1">Employee Level</label>
                <select 
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value) as EmployeeLevel)}
                  className="w-full px-3 py-2 border rounded"
                >
                  {Object.keys(awardData.employeeLevelRates).map(lvl => (
                    <option key={lvl} value={lvl}>Level {lvl}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Hours by Condition</h3>
              {Object.keys(hours).map(condition => (
                <div key={condition} className="flex items-center justify-between mb-2">
                  <label>{payConditionLabels[condition]}</label>
                  <input
                    type="number"
                    min="0"
                    value={hours[condition as PayCondition] || 0}
                    onChange={(e) => handleChangeHours(
                      condition as PayCondition, 
                      parseFloat(e.target.value) || 0
                    )}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Cost Settings</h3>
            <div className="flex items-center justify-between mb-2">
              <label>Overhead Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                value={overheadPercentage}
                onChange={(e) => setOverheadPercentage(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 border rounded"
              />
            </div>
            <div className="flex items-center justify-between mb-2">
              <label>Margin Percentage</label>
              <input
                type="number"
                min="0"
                max="100"
                value={marginPercentage}
                onChange={(e) => setMarginPercentage(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 border rounded"
              />
            </div>
          </div>
          
          <div className="mt-4 border-t pt-4">
            <h3 className="font-medium mb-2">Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Base Rate</p>
                <p className="font-medium">${result.baseRate.toFixed(2)}/hr</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Labor Cost</p>
                <p className="font-medium">${result.laborCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overhead</p>
                <p className="font-medium">${result.overheadCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margin</p>
                <p className="font-medium">${result.margin.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="font-medium">{result.totalHours}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="font-medium">${result.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
