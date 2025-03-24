import React, { useState } from 'react';
import { QuoteShift } from '@/lib/award/types';
import { useAllowances } from '@/hooks/quotes/useAllowances';
import { useShiftManagement } from '@/hooks/useShiftManagement';
import { calculateOvertimeHours } from '@/lib/award/utils';
import { checkForBrokenShifts } from '@/lib/award/shiftCalculations';
import { ShiftScheduler } from './shift-planner/ShiftScheduler';
import { ShiftSummary } from './shift-planner/ShiftSummary';
import { ShiftWarnings } from './shift-planner/ShiftWarnings';
import { ShiftTemplates } from './shift-planner/ShiftTemplates';
import { Button } from '@/components/ui/button';
import { Plus, List, Calendar } from 'lucide-react';

interface ShiftPlannerProps {
  quoteId: string | null;
  shifts: QuoteShift[];
  onShiftsChange: (shifts: QuoteShift[]) => void;
}

export function ShiftPlanner({ quoteId, shifts, onShiftsChange }: ShiftPlannerProps) {
  const [activeView, setActiveView] = useState<'calendar' | 'list' | 'add'>('list');
  const { data: allowances = [], isLoading: isLoadingAllowances } = useAllowances();

  const {
    newShift,
    handleShiftChange,
    handleAllowanceToggle,
    handleAddShift,
    handleDeleteShift,
    handleDuplicateShift,
    handleUpdateShift,
    applyShiftTemplate,
    resetNewShift
  } = useShiftManagement(shifts, onShiftsChange);

  const overtimeHours = calculateOvertimeHours(shifts);
  
  const brokenShiftDays = checkForBrokenShifts(shifts);
  
  const totalEstimatedCost = shifts.reduce((total, shift) => total + shift.estimatedCost, 0);

  const handleAddShiftSubmit = () => {
    const success = handleAddShift();
    if (success) {
      setActiveView('list');
      resetNewShift();
    }
  };

  const handleAddShiftClick = () => {
    resetNewShift();
    setActiveView('add');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shift Planner</h2>
          <p className="text-sm text-muted-foreground">
            Plan shifts and calculate costs based on the Cleaning Services Award
          </p>
        </div>
        
        <div className="flex space-x-3">
          <div className="bg-secondary rounded-md p-1 flex">
            <button 
              onClick={() => {
                resetNewShift();
                setActiveView('list');
              }}
              className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 ${activeView === 'list' 
                ? 'bg-primary text-white shadow-sm' 
                : 'hover:bg-secondary/80'}`}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </button>
            <button 
              onClick={() => {
                resetNewShift();
                setActiveView('calendar');
              }}
              className={`px-3 py-1.5 rounded-sm flex items-center gap-1.5 ${activeView === 'calendar' 
                ? 'bg-primary text-white shadow-sm' 
                : 'hover:bg-secondary/80'}`}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </button>
          </div>
          
          <Button onClick={handleAddShiftClick} variant="default">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Shift
          </Button>
        </div>
      </div>
      
      <ShiftWarnings 
        overtimeHours={overtimeHours} 
        brokenShiftDays={brokenShiftDays} 
      />
      
      <ShiftTemplates 
        onApplyTemplate={applyShiftTemplate} 
        disabled={activeView !== 'add'}
      />
      
      <ShiftScheduler 
        activeView={activeView}
        shifts={shifts}
        newShift={newShift}
        allowances={allowances}
        isLoadingAllowances={isLoadingAllowances}
        onShiftChange={handleShiftChange}
        onAllowanceToggle={handleAllowanceToggle}
        onAddShift={handleAddShiftSubmit}
        onDeleteShift={handleDeleteShift}
        onDuplicateShift={handleDuplicateShift}
        onUpdateShift={handleUpdateShift}
        onCancel={() => {
          resetNewShift();
          setActiveView('list');
        }}
        onAddShiftClick={handleAddShiftClick}
      />
      
      <ShiftSummary
        shifts={shifts} 
        totalCost={totalEstimatedCost}
      />
    </div>
  );
}
