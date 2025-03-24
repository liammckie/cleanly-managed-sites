
import React from 'react';
import { QuoteShift } from '@/lib/award/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus } from 'lucide-react';

interface ShiftCalendarProps {
  shifts: QuoteShift[];
  onAddShiftClick: () => void;
  onEditShift: (shift: QuoteShift) => void;
  onDuplicateShift: (shift: QuoteShift) => void;
  onDeleteShift: (shiftId: string) => void;
}

export function ShiftCalendar({
  shifts,
  onAddShiftClick,
  onEditShift,
  onDuplicateShift,
  onDeleteShift
}: ShiftCalendarProps) {
  // Helper to get the day order
  const getDayOrder = (day: string): number => {
    const dayOrder: Record<string, number> = {
      'monday': 0,
      'tuesday': 1,
      'wednesday': 2,
      'thursday': 3,
      'friday': 4,
      'saturday': 5,
      'sunday': 6,
      'public-holiday': 7
    };
    return dayOrder[day] ?? 0;
  };
  
  // Sort shifts by day and start time
  const sortedShifts = [...shifts].sort((a, b) => {
    const dayDiff = getDayOrder(a.day) - getDayOrder(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });
  
  // Group shifts by day
  const shiftsByDay: Record<string, QuoteShift[]> = {};
  sortedShifts.forEach(shift => {
    if (!shiftsByDay[shift.day]) {
      shiftsByDay[shift.day] = [];
    }
    shiftsByDay[shift.day].push(shift);
  });
  
  // Day labels
  const dayLabels: Record<string, string> = {
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday',
    'public-holiday': 'Public Holiday'
  };
  
  // Hours for the calendar (5am to 10pm)
  const hourLabels = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 5; // Starting from 5am
    return hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;
  });
  
  if (shifts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Shifts Scheduled</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding shifts to see them on the calendar view.
          </p>
          <Button onClick={onAddShiftClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Shift
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Weekly Schedule Calendar</CardTitle>
          <Button size="sm" onClick={onAddShiftClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[100px_repeat(17,_minmax(60px,_1fr))] gap-1 mb-2">
              <div className="text-sm font-medium"></div>
              {hourLabels.map((hour, idx) => (
                <div key={idx} className="text-sm text-center font-medium">
                  {hour}
                </div>
              ))}
            </div>
            
            {Object.entries(shiftsByDay)
              .sort(([dayA], [dayB]) => getDayOrder(dayA) - getDayOrder(dayB))
              .map(([day, dayShifts]) => (
                <div key={day} className="grid grid-cols-[100px_repeat(17,_minmax(60px,_1fr))] gap-1 mb-2">
                  <div className="text-sm font-medium py-2">{dayLabels[day]}</div>
                  
                  {/* This is a simplified version - a real implementation would position shifts precisely */}
                  <div className="col-span-17 relative h-12 bg-muted/30 rounded-md">
                    {dayShifts.map(shift => {
                      // Parse the time to get the hour
                      const startHour = parseInt(shift.startTime.split(':')[0]);
                      const endHour = parseInt(shift.endTime.split(':')[0]);
                      
                      // Calculate position (simplified)
                      const startPosition = Math.max(0, (startHour - 5) * (100 / 17)); // 5am is 0%
                      const width = Math.min(100 - startPosition, (endHour - startHour) * (100 / 17));
                      
                      // Determine color based on employee level
                      const levelColors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500'];
                      const bgColor = levelColors[(shift.level - 1) % levelColors.length];
                      
                      return (
                        <div
                          key={shift.id}
                          className={`absolute top-1 h-10 ${bgColor} text-white text-xs rounded-md px-2 py-1 overflow-hidden cursor-pointer`}
                          style={{
                            left: `${startPosition}%`,
                            width: `${width}%`,
                            minWidth: '60px'
                          }}
                          onClick={() => onEditShift(shift)}
                        >
                          <div className="font-medium truncate">
                            {shift.startTime}-{shift.endTime}
                          </div>
                          <div className="truncate">
                            {shift.numberOfCleaners} x Lvl{shift.level}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Note: This is a simplified calendar view. Click on a shift block to edit its details.
        </div>
      </CardContent>
    </Card>
  );
}
