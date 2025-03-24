
import React, { useState } from 'react';
import { EmploymentType, PayCondition } from '@/lib/award/types';
import { cleaningServicesAward } from '@/lib/award/awardData';

// Display names for the pay conditions
const payConditionDisplayNames: Record<PayCondition, string> = {
  'base': 'Base Rate',
  'standard': 'Standard',
  'weekday': 'Weekday',
  'shift-early-late': 'Early/Late Shift',
  'saturday': 'Saturday',
  'sunday': 'Sunday',
  'public_holiday': 'Public Holiday',
  'early_morning': 'Early Morning',
  'evening': 'Evening',
  'night': 'Night',
  'overnight': 'Overnight',
  'overtime-first-2-hours': 'Overtime (First 2 Hours)',
  'overtime-after-2-hours': 'Overtime (After 2 Hours)',
  'overtime-sunday': 'Overtime (Sunday)',
  'overtime-public-holiday': 'Overtime (Public Holiday)'
};

export function JobCostCalculator() {
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [level, setLevel] = useState<number>(1);
  const [hours, setHours] = useState<Record<PayCondition, number>>({
    'base': 0,
    'standard': 0,
    'weekday': 0,
    'saturday': 0,
    'sunday': 0,
    'public_holiday': 0,
    'early_morning': 0,
    'evening': 0,
    'night': 0,
    'overnight': 0,
    'shift-early-late': 0,
    'overtime-first-2-hours': 0,
    'overtime-after-2-hours': 0,
    'overtime-sunday': 0,
    'overtime-public-holiday': 0
  });
  
  // Get the selected level's rates
  const selectedLevel = cleaningServicesAward.levels.find(
    l => l.level === level && l.employmentType === employmentType
  );
  
  // Calculate the total cost
  const totalCost = selectedLevel 
    ? Object.entries(hours).reduce((total, [condition, hours]) => {
        return total + (selectedLevel.rates[condition as PayCondition].rate * hours);
      }, 0)
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
          <select 
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="casual">Casual</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select 
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value))}
          >
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </select>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Hours by Pay Condition</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(payConditionDisplayNames).map(([condition, displayName]) => (
            <div key={condition}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{displayName}</label>
              <input 
                type="number" 
                min="0"
                step="0.5"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={hours[condition as PayCondition] || 0}
                onChange={(e) => setHours(prev => ({
                  ...prev,
                  [condition]: parseFloat(e.target.value) || 0
                }))}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium mb-2">Cost Calculation</h3>
        <div className="space-y-2">
          {Object.entries(hours).map(([condition, hours]) => {
            if (hours <= 0) return null;
            
            const rate = selectedLevel?.rates[condition as PayCondition].rate || 0;
            const cost = rate * hours;
            
            return (
              <div key={condition} className="flex justify-between">
                <span>{payConditionDisplayNames[condition as PayCondition]} ({hours} hours)</span>
                <span>${cost.toFixed(2)}</span>
              </div>
            );
          })}
          
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total Cost</span>
            <span>${totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
