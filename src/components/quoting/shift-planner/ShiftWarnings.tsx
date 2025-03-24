
import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ShiftWarningsProps {
  overtimeHours: Record<string, number>;
  brokenShiftDays: string[];
}

export function ShiftWarnings({ overtimeHours, brokenShiftDays }: ShiftWarningsProps) {
  const hasOvertimeWarnings = Object.keys(overtimeHours).length > 0;
  const hasBrokenShiftWarnings = brokenShiftDays.length > 0;
  
  if (!hasOvertimeWarnings && !hasBrokenShiftWarnings) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      {hasOvertimeWarnings && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Overtime Detected</AlertTitle>
          <AlertDescription>
            <div className="mt-1">
              {Object.entries(overtimeHours).map(([employeeKey, hours], idx) => {
                const [type, level, count] = employeeKey.split('-');
                return (
                  <div key={idx} className="text-sm">
                    {count} x Level {level} {type} employee{count !== '1' ? 's' : ''}: {hours.toFixed(1)} hours of overtime
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-sm font-medium">
              Overtime hours will be charged at higher rates. Consider adjusting shifts to minimize overtime.
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {hasBrokenShiftWarnings && (
        <Alert variant="warning">
          <Clock className="h-4 w-4" />
          <AlertTitle>Broken Shifts Detected</AlertTitle>
          <AlertDescription>
            <div className="mt-1">
              Broken shifts were detected on: {brokenShiftDays.join(', ')}
            </div>
            <div className="mt-2 text-sm font-medium">
              Broken shift allowances will apply. Employees must be compensated for the inconvenience of working non-continuous hours.
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
