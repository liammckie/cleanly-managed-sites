
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuoteShift } from '@/lib/types/quotes';
import { calculateHourDifference } from '@/lib/award/utils';
import { Clock, DollarSign, Calendar, Users } from 'lucide-react';

interface ShiftSummaryProps {
  shifts: QuoteShift[];
  totalCost: number;
}

export function ShiftSummary({ shifts, totalCost }: ShiftSummaryProps) {
  // Calculate total hours
  const totalHours = shifts.reduce((total, shift) => 
    total + calculateHourDifference(shift.start_time, shift.end_time, shift.break_duration) * shift.number_of_cleaners, 
    0
  );
  
  // Get unique days covered by shifts
  const uniqueDays = new Set(shifts.map(shift => shift.day));
  
  // Get total staff count
  const totalStaff = shifts.reduce((total, shift) => total + shift.number_of_cleaners, 0);
  
  if (shifts.length === 0) {
    return null;
  }
  
  return (
    <Card className="bg-muted/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Scheduling & Cost Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex items-center text-muted-foreground mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-xs">Scheduled Days</span>
            </div>
            <div className="text-2xl font-bold">{uniqueDays.size}</div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex items-center text-muted-foreground mb-1">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-xs">Total Hours</span>
            </div>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex items-center text-muted-foreground mb-1">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-xs">Total Staff</span>
            </div>
            <div className="text-2xl font-bold">{totalStaff}</div>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex items-center text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="text-xs">Weekly Labor Cost</span>
            </div>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between items-center text-sm text-muted-foreground">
          <div>
            Based on {shifts.length} shift{shifts.length !== 1 ? 's' : ''} with award-compliant rates
          </div>
          <div>
            Monthly: ${(totalCost * 4.33).toFixed(2)} | Annual: ${(totalCost * 52).toFixed(2)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
