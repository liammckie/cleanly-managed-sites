
import React, { useState } from 'react';
import { QuoteShift } from '@/lib/award/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Calculator, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { ScenarioComparer } from './ScenarioComparer';

interface ShiftListProps {
  shifts: QuoteShift[];
  onDeleteShift: (shiftId: string) => void;
  onDuplicateShift: (shift: QuoteShift) => void;
  onAddShiftClick: () => void;
  allowances: Array<{
    id: string;
    name: string;
  }>;
  onUpdateShift?: (updatedShift: QuoteShift) => void;
}

export function ShiftList({
  shifts,
  onDeleteShift,
  onDuplicateShift,
  onAddShiftClick,
  allowances,
  onUpdateShift
}: ShiftListProps) {
  const [scenarioShiftId, setScenarioShiftId] = useState<string | null>(null);
  
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

  const formatAllowances = (shift: QuoteShift): string => {
    if (!shift.allowances || shift.allowances.length === 0) return 'None';
    
    return shift.allowances.map(id => {
      const allowance = allowances.find(a => a.id === id);
      return allowance ? allowance.name : id;
    }).join(', ');
  };
  
  const handleOpenScenario = (shiftId: string) => {
    setScenarioShiftId(shiftId);
  };
  
  const handleCloseScenario = () => {
    setScenarioShiftId(null);
  };
  
  const handleApplyScenario = (updatedShift: QuoteShift) => {
    if (onUpdateShift) {
      onUpdateShift(updatedShift);
      setScenarioShiftId(null);
    }
  };

  if (shifts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="mx-auto h-12 w-12 text-muted-foreground mb-4 flex items-center justify-center">
            <Calculator className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Shifts Added Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding shifts to your quote. Each shift will automatically calculate costs based on the award rates.
          </p>
          <Button onClick={onAddShiftClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Shift
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // If we're in scenario mode for a shift
  if (scenarioShiftId) {
    const shift = shifts.find(s => s.id === scenarioShiftId);
    if (!shift) {
      return null;
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">What-If Scenario for {getDayLabel(shift.day)} Shift</h3>
          <Button variant="outline" size="sm" onClick={handleCloseScenario}>
            Back to Shift List
          </Button>
        </div>
        
        <ScenarioComparer 
          shift={shift} 
          onApplyScenario={handleApplyScenario} 
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Scheduled Shifts</CardTitle>
          <Button size="sm" onClick={onAddShiftClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
        </div>
        <CardDescription>
          {shifts.length} shift{shifts.length !== 1 ? 's' : ''} scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map(shift => (
                <TableRow key={shift.id}>
                  <TableCell>
                    <Badge variant={shift.day === 'saturday' || shift.day === 'sunday' || shift.day === 'public-holiday' ? "destructive" : "secondary"}>
                      {getDayLabel(shift.day)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {shift.startTime} - {shift.endTime}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {shift.breakDuration} min break
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>
                        {shift.numberOfCleaners} × Level {shift.level}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {shift.employmentType.replace('-', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-xs">
                            {shift.allowances && shift.allowances.length > 0 
                              ? `${shift.allowances.length} allowance${shift.allowances.length !== 1 ? 's' : ''}`
                              : 'No allowances'}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{formatAllowances(shift)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${shift.estimatedCost.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenScenario(shift.id)} title="What-If Analysis">
                        <Calculator className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDuplicateShift(shift)} title="Duplicate Shift">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteShift(shift.id)} title="Delete Shift">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
