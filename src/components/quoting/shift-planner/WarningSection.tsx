
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock } from 'lucide-react';
import { QuoteShift } from '@/lib/award/types';

interface WarningSectionProps {
  overtimeHours: Record<string, number>;
  brokenShiftDays: string[];
}

export function WarningSection({ overtimeHours, brokenShiftDays }: WarningSectionProps) {
  const hasOvertimeWarnings = Object.keys(overtimeHours).length > 0;
  const hasBrokenShifts = brokenShiftDays.length > 0;
  
  const getDayLabel = (day: string): string => {
    const DAYS_OF_WEEK = [
      { value: 'monday', label: 'Monday' },
      { value: 'tuesday', label: 'Tuesday' },
      { value: 'wednesday', label: 'Wednesday' },
      { value: 'thursday', label: 'Thursday' },
      { value: 'friday', label: 'Friday' },
      { value: 'saturday', label: 'Saturday' },
      { value: 'sunday', label: 'Sunday' },
      { value: 'public-holiday', label: 'Public Holiday' },
    ];
    
    const dayItem = DAYS_OF_WEEK.find(d => d.value === day);
    return dayItem ? dayItem.label : day;
  };

  if (!hasOvertimeWarnings && !hasBrokenShifts) {
    return null;
  }

  return (
    <div className="space-y-4">
      {hasOvertimeWarnings && (
        <Card className="bg-amber-50 border-amber-300">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Overtime Warning</h4>
                <p className="text-sm text-amber-700">
                  Some employees are scheduled for more than 38 hours per week, triggering overtime rates:
                </p>
                <ul className="mt-2 text-sm text-amber-700 list-disc pl-5">
                  {Object.entries(overtimeHours).map(([employeeKey, hours], index) => {
                    const [type, level, count] = employeeKey.split('-');
                    return (
                      <li key={index}>
                        {count} × Level {level} {type} employee: {hours.toFixed(1)} hours of overtime
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {hasBrokenShifts && (
        <Card className="bg-blue-50 border-blue-300">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Broken Shifts Detected</h4>
                <p className="text-sm text-blue-700">
                  Multiple shifts on the same day for the same employee type may qualify for broken shift allowances:
                </p>
                <ul className="mt-2 text-sm text-blue-700 list-disc pl-5">
                  {brokenShiftDays.map((day, index) => (
                    <li key={index}>{getDayLabel(day)}</li>
                  ))}
                </ul>
                <p className="text-sm text-blue-700 mt-2">
                  Consider adding the "broken-shift" allowance when finalizing your quote.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
