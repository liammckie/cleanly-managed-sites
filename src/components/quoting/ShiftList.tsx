
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FrontendQuoteShift } from '@/lib/api/quotes/utils/shiftAdapter';

export interface ShiftListProps {
  shifts: FrontendQuoteShift[];
  onRemoveShift?: (shiftId: string) => void;
}

export const ShiftList: React.FC<ShiftListProps> = ({ shifts, onRemoveShift }) => {
  // Helper to format day
  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  // Helper to format employment type
  const formatEmploymentType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Estimated Cost</TableHead>
            {onRemoveShift && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={onRemoveShift ? 6 : 5} className="text-center py-6 text-muted-foreground">
                No shifts added yet
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{formatDay(shift.day)}</TableCell>
                <TableCell>
                  {shift.startTime} - {shift.endTime}
                  <div className="text-xs text-muted-foreground mt-1">
                    {shift.breakDuration} min break
                  </div>
                </TableCell>
                <TableCell>
                  {shift.numberOfCleaners} × Level {shift.level}
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatEmploymentType(shift.employmentType)}
                  </div>
                </TableCell>
                <TableCell>{shift.location}</TableCell>
                <TableCell className="text-right">${shift.estimatedCost.toFixed(2)}</TableCell>
                {onRemoveShift && (
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onRemoveShift(shift.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
