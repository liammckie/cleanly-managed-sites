
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { QuoteShift } from '@/lib/award/types';
import { AlertTriangle, Clock } from 'lucide-react';

interface WarningSectionProps {
  overtimeHours: Record<string, number>;
  brokenShiftDays: QuoteShift[][];
}

export function WarningSection({ overtimeHours, brokenShiftDays }: WarningSectionProps) {
  if (overtimeHours.total === 0 && brokenShiftDays.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {overtimeHours.total > 0 && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Potential Overtime Required</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>
                The current schedule requires approximately {overtimeHours.total.toFixed(1)} hours of overtime.
              </p>
              {overtimeHours.fullTime > 0 && (
                <p className="text-sm">
                  • Full-time staff: {overtimeHours.fullTime.toFixed(1)} hours over standard 38-hour week
                </p>
              )}
              {overtimeHours.partTime > 0 && (
                <p className="text-sm">
                  • Part-time staff: {overtimeHours.partTime.toFixed(1)} hours over contracted hours
                </p>
              )}
              {overtimeHours.casual > 0 && (
                <p className="text-sm">
                  • Casual staff: {overtimeHours.casual.toFixed(1)} hours over standard limits
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {brokenShiftDays.length > 0 && (
          <Alert variant="warning">
            <Clock className="h-4 w-4" />
            <AlertTitle>Broken Shifts Detected</AlertTitle>
            <AlertDescription>
              <p>
                Broken shifts (multiple shifts for the same employee in one day) found on {brokenShiftDays.length} days.
                This may require additional allowances as per the award.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
