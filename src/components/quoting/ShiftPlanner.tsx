
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ShiftScheduler } from './shift-planner/ShiftScheduler';
import { QuoteShift } from '@/types/models';
import { adaptDay, adaptQuoteShift } from '@/utils/typeAdapters';
import { Day } from '@/types/common';

const dayNames: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
  weekday: 'Weekday',
  public_holiday: 'Public Holiday'
};

interface ShiftPlannerProps {
  shifts: QuoteShift[];
  onAddShift: (shift: Partial<QuoteShift>) => void;
  onRemoveShift: (shiftId: string) => void;
  onUpdateShift?: (shift: QuoteShift) => void;
}

export function ShiftPlanner({ shifts, onAddShift, onRemoveShift, onUpdateShift }: ShiftPlannerProps) {
  const handleAddShift = (shiftData: Partial<QuoteShift>) => {
    // Convert day type using adapter to ensure consistency
    const adaptedShift = {
      ...shiftData,
      day: adaptDay(shiftData.day as string)
    };
    onAddShift(adaptedShift);
  };

  // Format time string (e.g., "09:00" to "9:00 AM")
  const formatTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (error) {
      return timeString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Labor Shifts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {shifts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Planned Shifts</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left">Day</th>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Hours</th>
                      <th className="px-4 py-2 text-left">Cleaners</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Level</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shifts.map((shift) => {
                      // Adapt shift to ensure consistent types
                      const adaptedShift = adaptQuoteShift<QuoteShift, QuoteShift>(shift);
                      
                      // Calculate shift duration
                      let durationHours = 0;
                      try {
                        const [startHour, startMin] = adaptedShift.startTime.split(':').map(Number);
                        const [endHour, endMin] = adaptedShift.endTime.split(':').map(Number);
                        const startDate = new Date(0, 0, 0, startHour, startMin);
                        const endDate = new Date(0, 0, 0, endHour, endMin);
                        const diffMs = endDate.getTime() - startDate.getTime();
                        durationHours = (diffMs / 3600000) - (adaptedShift.breakDuration / 60);
                      } catch (error) {
                        console.error('Error calculating shift duration:', error);
                      }
                      
                      return (
                        <tr key={adaptedShift.id} className="border-b hover:bg-muted/20">
                          <td className="px-4 py-2">{dayNames[adaptedShift.day] || adaptedShift.day}</td>
                          <td className="px-4 py-2">
                            {formatTime(adaptedShift.startTime)} - {formatTime(adaptedShift.endTime)}
                          </td>
                          <td className="px-4 py-2">{durationHours.toFixed(1)}</td>
                          <td className="px-4 py-2">{adaptedShift.numberOfCleaners}</td>
                          <td className="px-4 py-2">
                            {adaptedShift.employmentType === 'casual' ? 'Casual' : 
                             adaptedShift.employmentType === 'part_time' ? 'Part Time' : 'Full Time'}
                          </td>
                          <td className="px-4 py-2">Level {adaptedShift.level}</td>
                          <td className="px-4 py-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => onRemoveShift(adaptedShift.id)}
                              aria-label="Delete shift"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <ShiftScheduler onAddShift={handleAddShift} existingShifts={shifts} />
        </div>
      </CardContent>
    </Card>
  );
}
