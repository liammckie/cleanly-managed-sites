
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface WarningSectionProps {
  overtimeHours: Record<string, number>;
  brokenShiftDays: Record<string, number>;
}

export function WarningSection({ overtimeHours, brokenShiftDays }: WarningSectionProps) {
  const hasOvertimeWarnings = Object.keys(overtimeHours).length > 0;
  const hasBrokenShiftWarnings = Object.keys(brokenShiftDays).length > 0;
  
  if (!hasOvertimeWarnings && !hasBrokenShiftWarnings) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Warnings</h3>
      
      {hasOvertimeWarnings && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Overtime Detected</AlertTitle>
          <AlertDescription>
            <div className="space-y-1 mt-2">
              {Object.entries(overtimeHours).map(([person, hours]) => (
                <div key={person} className="text-sm">
                  {person} has {hours.toFixed(1)} hours of overtime
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {hasBrokenShiftWarnings && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Broken Shifts Detected</AlertTitle>
          <AlertDescription>
            <div className="space-y-1 mt-2">
              {Object.entries(brokenShiftDays).map(([day, count]) => (
                <div key={day} className="text-sm">
                  {day.charAt(0).toUpperCase() + day.slice(1)} has {count} separate shifts
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
