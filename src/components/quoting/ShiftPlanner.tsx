
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, List, PlusCircle } from 'lucide-react';
import { QuoteShift, Subcontractor } from '@/lib/types/quotes';
import { calculateTotalCosts, detectOvertimeHours } from '@/lib/award/utils';
import useShiftManagement from '@/hooks/useShiftManagement';
import { useAllowances } from '@/hooks/quotes/useAllowances';
import { ShiftScheduler } from './shift-planner/ShiftScheduler';
import { ShiftSummary } from './shift-planner/ShiftSummary';
import { ShiftWarnings } from './shift-planner/ShiftWarnings';
import { ShiftTemplates } from './shift-planner/ShiftTemplates';
import { WarningSection } from './shift-planner/WarningSection';
import { Day } from '@/lib/award/types';

// Custom function to detect broken shifts (multiple shifts in same day)
const detectBrokenShifts = (shifts: QuoteShift[]): Record<string, number> => {
  const daysWithMultipleShifts: Record<string, number> = {};
  
  // Count shifts per day
  shifts.forEach(shift => {
    if (!daysWithMultipleShifts[shift.day]) {
      daysWithMultipleShifts[shift.day] = 1;
    } else {
      daysWithMultipleShifts[shift.day]++;
    }
  });
  
  // Filter to only days with multiple shifts
  Object.keys(daysWithMultipleShifts).forEach(day => {
    if (daysWithMultipleShifts[day] <= 1) {
      delete daysWithMultipleShifts[day];
    }
  });
  
  return daysWithMultipleShifts;
};

interface ShiftPlannerProps {
  quoteId: string | null;
  shifts: QuoteShift[];
  onShiftsChange: (shifts: QuoteShift[]) => void;
}

export function ShiftPlanner({ quoteId, shifts, onShiftsChange }: ShiftPlannerProps) {
  const [activeView, setActiveView] = useState<'calendar' | 'list' | 'add'>('list');
  const { data: allowances = [], isLoading: isLoadingAllowances } = useAllowances();
  
  const initialShift: Partial<QuoteShift> = {
    id: uuidv4(),
    quoteId: quoteId || '',
    day: 'monday' as Day,
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 30,
    level: 1,
    employmentType: 'full_time',
    numberOfCleaners: 1,
    allowances: [],
    estimatedCost: 0,
    location: '',
    notes: ''
  };
  
  const [newShift, setNewShift] = useState(initialShift);
  
  // Calculate total cost
  const totalCost = calculateTotalCosts(shifts);
  
  // Detect overtime hours
  const overtimeHours = detectOvertimeHours(shifts);
  
  // Detect broken shifts
  const brokenShiftDays = detectBrokenShifts(shifts);
  
  const handleShiftChange = (field: string, value: any) => {
    setNewShift(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAllowanceToggle = (allowanceId: string) => {
    setNewShift(prev => {
      const currentAllowances = prev.allowances || [];
      
      if (currentAllowances.includes(allowanceId)) {
        return {
          ...prev,
          allowances: currentAllowances.filter(id => id !== allowanceId)
        };
      } else {
        return {
          ...prev,
          allowances: [...currentAllowances, allowanceId]
        };
      }
    });
  };
  
  const handleAddShift = () => {
    // Basic validation
    if (!newShift.startTime || !newShift.endTime || !newShift.day || !newShift.employmentType) {
      return;
    }
    
    const fullShift = {
      ...newShift,
      id: newShift.id || uuidv4(),
      quoteId: quoteId || '',
      employmentType: newShift.employmentType || 'full_time'
    } as QuoteShift;
    
    onShiftsChange([...shifts, fullShift]);
    setActiveView('list');
    setNewShift(initialShift); // Reset form
  };
  
  const handleDeleteShift = (shiftId: string) => {
    onShiftsChange(shifts.filter(shift => shift.id !== shiftId));
  };
  
  const handleDuplicateShift = (shift: QuoteShift) => {
    const duplicatedShift = {
      ...shift,
      id: uuidv4()
    };
    
    onShiftsChange([...shifts, duplicatedShift]);
  };
  
  const handleUpdateShift = (updatedShift: QuoteShift) => {
    onShiftsChange(shifts.map(shift => 
      shift.id === updatedShift.id ? updatedShift : shift
    ));
  };
  
  const handleCancel = () => {
    setActiveView('list');
    setNewShift(initialShift);
  };
  
  const handleAddShiftClick = () => {
    setActiveView('add');
  };
  
  const handleApplyTemplate = (template: any) => {
    setNewShift(prev => ({
      ...prev,
      startTime: template.startTime,
      endTime: template.endTime,
      breakDuration: template.breakDuration
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeView === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List View
          </Button>
          <Button
            variant={activeView === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('calendar')}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>
        
        {activeView !== 'add' && (
          <Button onClick={handleAddShiftClick} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        )}
      </div>
      
      {activeView === 'add' && (
        <ShiftTemplates 
          onApplyTemplate={handleApplyTemplate}
        />
      )}
      
      <ShiftScheduler 
        activeView={activeView}
        shifts={shifts}
        newShift={newShift}
        allowances={allowances}
        isLoadingAllowances={isLoadingAllowances}
        onShiftChange={handleShiftChange}
        onAllowanceToggle={handleAllowanceToggle}
        onAddShift={handleAddShift}
        onDeleteShift={handleDeleteShift}
        onDuplicateShift={handleDuplicateShift}
        onUpdateShift={handleUpdateShift}
        onCancel={handleCancel}
        onAddShiftClick={handleAddShiftClick}
      />
      
      {shifts.length > 0 && (
        <>
          <ShiftSummary 
            shifts={shifts}
            totalCost={totalCost}
          />
          
          <WarningSection 
            overtimeHours={overtimeHours}
            brokenShiftDays={brokenShiftDays}
          />
        </>
      )}
    </div>
  );
}
