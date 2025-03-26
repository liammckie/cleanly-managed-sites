
import React from 'react';
import { QuoteShift } from '@/lib/types/quotes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Copy, Edit, Trash2, User, DollarSign } from 'lucide-react';

interface ShiftCalendarProps {
  shifts: QuoteShift[];
  onDeleteShift: (shiftId: string) => void;
  onDuplicateShift: (shift: QuoteShift) => void;
  onUpdateShift: (shift: QuoteShift) => void;
}

export function ShiftCalendar({
  shifts,
  onDeleteShift,
  onDuplicateShift,
  onUpdateShift
}: ShiftCalendarProps) {
  // Helper function to format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
  };
  
  // Group shifts by day
  const shiftsByDay: Record<string, QuoteShift[]> = shifts.reduce((acc, shift) => {
    const day = shift.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(shift);
    return acc;
  }, {} as Record<string, QuoteShift[]>);
  
  // Order of days for display
  const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'public_holiday'];
  
  // Format day for display (capitalize first letter)
  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };
  
  if (shifts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No Shifts Added</h3>
            <p className="text-sm text-muted-foreground">
              Start by adding labor shifts for this quote
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {daysOrder.map(day => {
        const dayShifts = shiftsByDay[day] || [];
        if (dayShifts.length === 0) return null;
        
        return (
          <Card key={day} className="overflow-hidden">
            <div className="bg-muted py-2 px-4 border-b">
              <h3 className="font-medium">{formatDay(day)}</h3>
            </div>
            <CardContent className="p-0">
              {dayShifts.map(shift => (
                <div key={shift.id} className="border-b last:border-0 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center mb-1">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-sm">
                          {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">Level {shift.level}</Badge>
                        <Badge variant="outline">{shift.employmentType}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onUpdateShift(shift)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDuplicateShift(shift)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDeleteShift(shift.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-sm">×{shift.numberOfCleaners} staff</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-sm">${shift.estimatedCost.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {shift.location && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Location: {shift.location}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
