
import React from 'react';
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

interface AwardRatesTableProps {
  employmentType?: EmploymentType;
}

export function AwardRatesTable({ employmentType = 'full_time' }: AwardRatesTableProps) {
  // Filter the award data based on employment type
  const employmentTypeRates = cleaningServicesAward.levels.filter(
    level => level.employmentType === employmentType
  );
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pay Condition
            </th>
            {employmentTypeRates.map(level => (
              <th key={level.level} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level {level.level} Rate
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(payConditionDisplayNames).map(([condition, displayName]) => (
            <tr key={condition}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {displayName}
              </td>
              {employmentTypeRates.map(level => (
                <td key={level.level} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${level.rates[condition as PayCondition].rate.toFixed(2)} 
                  <span className="text-gray-400 ml-1">
                    ({level.rates[condition as PayCondition].multiplier.toFixed(2)}x)
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
