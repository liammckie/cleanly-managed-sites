
import React from 'react';
import { QuoteShift } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calculator, Clock, Copy, Edit, Plus, Trash2, User } from 'lucide-react';

interface ShiftListProps {
  shifts: QuoteShift[];
  onDeleteShift: (shiftId: string) => void;
  onDuplicateShift: (shift: QuoteShift) => void;
  onUpdateShift: (shift: QuoteShift) => void;
  onAddClick: () => void;
}

export function ShiftList({
  shifts,
  onDeleteShift,
  onDuplicateShift,
  onUpdateShift,
  onAddClick
}: ShiftListProps) {
  // Helper function to format time for display
  const formatTime = (timeString: string) => {
    // Parse the time string
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Format with am/pm
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12am
    return `${displayHours}:${minutes.toString().padStart(2, '0')}${period}`;
  };
  
  // Format day for display (capitalize first letter)
  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };
  
  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case 'full_time':
        return 'Full-time';
      case 'part_time':
        return 'Part-time';
      case 'casual':
        return 'Casual';
      default:
        return type;
    }
  };
  
  // Calculate hours for display
  const calculateHours = (startTime: string, endTime: string, breakDuration: number) => {
    // Convert the time strings to Date objects for comparison
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    // If end time is before start time, assume it's the next day
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    // Calculate the difference in milliseconds
    const diff = end.getTime() - start.getTime();
    
    // Convert to hours and subtract break
    const hours = diff / (1000 * 60 * 60);
    const workHours = hours - (breakDuration / 60);
    
    return workHours.toFixed(2);
  };
  
  if (shifts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No Shifts Added</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start by adding labor shifts for this quote
            </p>
            <Button onClick={onAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Shift
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.map(shift => (
            <TableRow key={shift.id}>
              <TableCell>
                <Badge variant="outline">{formatDay(shift.day)}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>{formatTime(shift.start_time || shift.startTime || '')} - {formatTime(shift.end_time || shift.endTime || '')}</span>
                </div>
              </TableCell>
              <TableCell>
                {calculateHours(
                  shift.start_time || shift.startTime || '', 
                  shift.end_time || shift.endTime || '', 
                  shift.break_duration || shift.breakDuration || 0
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">Level {shift.level}</Badge>
              </TableCell>
              <TableCell>
                {getEmploymentTypeLabel(shift.employment_type || shift.employmentType || '')}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>×{shift.number_of_cleaners || shift.numberOfCleaners}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calculator className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>${(shift.estimated_cost || shift.estimatedCost || 0).toFixed(2)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex justify-end">
        <Button onClick={onAddClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Another Shift
        </Button>
      </div>
    </div>
  );
}
