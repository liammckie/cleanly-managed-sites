
import React, { useState } from 'react';
import { EmploymentType, PayCondition, EmployeeLevel } from '@/lib/award/types';
import { calculateJobCost } from '@/lib/award/awardEngine';
import { useAwardSettings } from '@/hooks/useAwardSettings';

// Display names for conditions
const conditionDisplayNames: Record<PayCondition, string> = {
  'base': 'Base Rate',
  'standard': 'Standard',
  'weekday': 'Weekday',
  'shift-early-late': 'Early/Late Shift',
  'saturday': 'Saturday',
  'sunday': 'Sunday',
  'public-holiday': 'Public Holiday',
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
  const { settings } = useAwardSettings();
  
  // Form state
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [level, setLevel] = useState<EmployeeLevel>(1);
  const [hours, setHours] = useState<Record<PayCondition, number>>({
    'base': 0,
    'standard': 0,
    'weekday': 0,
    'shift-early-late': 0,
    'saturday': 0,
    'sunday': 0,
    'public-holiday': 0,
    'early_morning': 0,
    'evening': 0,
    'night': 0,
    'overnight': 0,
    'overtime-first-2-hours': 0,
    'overtime-after-2-hours': 0,
    'overtime-sunday': 0,
    'overtime-public-holiday': 0
  });
  const [overheadPercentage, setOverheadPercentage] = useState(15);
  const [marginPercentage, setMarginPercentage] = useState(20);
  
  // Calculate results
  const results = calculateJobCost({
    employmentType,
    level,
    hours,
    overheadPercentage,
    marginPercentage,
  });
  
  // Handle hour changes
  const handleHoursChange = (condition: PayCondition, value: string) => {
    setHours(prev => ({
      ...prev,
      [condition]: parseFloat(value) || 0
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Employment Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Employment Type</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="casual">Casual</option>
          </select>
        </div>
        
        {/* Level Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Level</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value) as EmployeeLevel)}
          >
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
        </div>
        
        {/* Percentage Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Overhead %</label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded"
              value={overheadPercentage}
              onChange={(e) => setOverheadPercentage(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Margin %</label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded"
              value={marginPercentage}
              onChange={(e) => setMarginPercentage(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
      
      {/* Hours Inputs */}
      <div>
        <h3 className="text-lg font-medium mb-2">Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(conditionDisplayNames).map(([condition, label]) => (
            <div key={condition}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input 
                type="number" 
                min="0"
                step="0.5"
                className="w-full p-2 border border-gray-300 rounded"
                value={hours[condition as PayCondition]}
                onChange={(e) => handleHoursChange(condition as PayCondition, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Results */}
      <div>
        <h3 className="text-lg font-medium mb-2">Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Base Rate</div>
            <div className="text-xl font-bold">${results.baseRate.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Total Hours</div>
            <div className="text-xl font-bold">{results.totalHours.toFixed(1)}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Labor Cost</div>
            <div className="text-xl font-bold">${results.laborCost.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Overhead Cost</div>
            <div className="text-xl font-bold">${results.overheadCost.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Total Cost</div>
            <div className="text-xl font-bold">${results.totalCost.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Margin</div>
            <div className="text-xl font-bold">${results.margin.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-blue-50 rounded col-span-2">
            <div className="text-sm text-blue-500">Total Price</div>
            <div className="text-2xl font-bold text-blue-700">${results.price.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Breakdown */}
      <div>
        <h3 className="text-lg font-medium mb-2">Breakdown</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {conditionDisplayNames[item.condition]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.hours.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${item.rate.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${item.cost.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
