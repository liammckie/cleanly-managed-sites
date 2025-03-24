
import React, { useState } from 'react';
import { QuoteShift } from '@/lib/award/types';
import { useAllowances } from '@/hooks/useQuotes';
import { useShiftManagement } from '@/hooks/useShiftManagement';
import { calculateOvertimeHours } from '@/lib/award/utils';
import { checkForBrokenShifts } from '@/lib/award/shiftCalculations';
import { ShiftScheduler } from './shift-planner/ShiftScheduler';
import { ShiftSummary } from './shift-planner/ShiftSummary';
import { ShiftWarnings } from './shift-planner/ShiftWarnings';
import { ShiftTemplates } from './shift-planner/ShiftTemplates';

interface ShiftPlannerProps {
  quoteId: string | null;
  shifts: QuoteShift[];
  onShiftsChange: (shifts: QuoteShift[]) => void;
}

export function ShiftPlanner({ quoteId, shifts, onShiftsChange }: ShiftPlannerProps) {
  const [activeView, setActiveView] = useState<'calendar' | 'list' | 'add'>('list');
  const { data: allowances = [], isLoading: isLoadingAllowances } = useAllowances();

  // Use the shift management hook
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

  // Calculate overtime warnings
  const overtimeHours = calculateOvertimeHours(shifts);
  
  // Check for broken shifts
  const brokenShiftDays = checkForBrokenShifts(shifts);
  
  // Total estimated cost
  const totalEstimatedCost = shifts.reduce((total, shift) => total + shift.estimatedCost, 0);

  // Handle adding a new shift
  const handleAddShiftSubmit = () => {
    const success = handleAddShift();
    if (success) {
      setActiveView('list'); // Switch to list view after successful add
      resetNewShift(); // Reset the form
    }
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
        
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              resetNewShift();
              setActiveView('list');
            }}
            className={`px-4 py-2 rounded-md ${activeView === 'list' 
              ? 'bg-primary text-white' 
              : 'bg-secondary hover:bg-secondary/80'}`}
          >
            Shift List
          </button>
          <button 
            onClick={() => {
              resetNewShift();
              setActiveView('add');
            }}
            className={`px-4 py-2 rounded-md ${activeView === 'add' 
              ? 'bg-primary text-white' 
              : 'bg-secondary hover:bg-secondary/80'}`}
          >
            Add Shift
          </button>
          <button 
            onClick={() => {
              resetNewShift();
              setActiveView('calendar');
            }}
            className={`px-4 py-2 rounded-md ${activeView === 'calendar' 
              ? 'bg-primary text-white' 
              : 'bg-secondary hover:bg-secondary/80'}`}
          >
            Calendar View
          </button>
        </div>
      </div>
      
      {/* Warnings section */}
      <ShiftWarnings 
        overtimeHours={overtimeHours} 
        brokenShiftDays={brokenShiftDays} 
      />
      
      {/* Pre-built shift templates */}
      <ShiftTemplates 
        onApplyTemplate={applyShiftTemplate} 
        disabled={activeView !== 'add'}
      />
      
      {/* Shift scheduler component - handles list, add, and calendar views */}
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
        onAddShiftClick={() => {
          resetNewShift();
          setActiveView('add');
        }}
      />
      
      {/* Summary component */}
      <ShiftSummary
        shifts={shifts} 
        totalCost={totalEstimatedCost}
      />
    </div>
  );
}
