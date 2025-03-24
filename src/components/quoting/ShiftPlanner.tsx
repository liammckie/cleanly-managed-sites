
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QuoteShift } from '@/lib/award/types';
import { useAllowances } from '@/hooks/useQuotes';
import { useShiftManagement } from '@/hooks/useShiftManagement';
import { ShiftList } from './shift-planner/ShiftList';
import { ShiftForm } from './shift-planner/ShiftForm';
import { WarningSection } from './shift-planner/WarningSection';
import { calculateOvertimeHours } from '@/lib/award/utils';
import { checkForBrokenShifts } from '@/lib/award/shiftCalculations';
import { Plus } from 'lucide-react';

interface ShiftPlannerProps {
  quoteId: string | null;
  shifts: QuoteShift[];
  onShiftsChange: (shifts: QuoteShift[]) => void;
}

export function ShiftPlanner({ quoteId, shifts, onShiftsChange }: ShiftPlannerProps) {
  const [activeTab, setActiveTab] = useState('list');
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

  const handleAddShiftSubmit = () => {
    const success = handleAddShift();
    if (success) {
      setActiveTab('list'); // Switch to list view after successful add
      resetNewShift(); // Reset the form
    }
  };

  const handleAddShiftClick = () => {
    resetNewShift(); // Reset the form when switching to add tab
    setActiveTab('add');
  };

  const handleCancelAdd = () => {
    resetNewShift(); // Reset the form when canceling
    setActiveTab('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Shift Planner</h3>
          <p className="text-sm text-muted-foreground">
            Plan shifts and calculate costs based on the Cleaning Services Award
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Shift List</TabsTrigger>
            <TabsTrigger value="add">Add Shift</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Warnings section */}
      <WarningSection 
        overtimeHours={overtimeHours} 
        brokenShiftDays={brokenShiftDays} 
      />
      
      <TabsContent value="list" className="m-0">
        <ShiftList 
          shifts={shifts}
          onDeleteShift={handleDeleteShift}
          onDuplicateShift={handleDuplicateShift}
          onAddShiftClick={handleAddShiftClick}
          allowances={allowances}
          onUpdateShift={handleUpdateShift}
        />
      </TabsContent>
      
      <TabsContent value="add" className="m-0">
        <ShiftForm 
          newShift={newShift}
          onShiftChange={handleShiftChange}
          onAllowanceToggle={handleAllowanceToggle}
          onApplyTemplate={applyShiftTemplate}
          onAddShift={handleAddShiftSubmit}
          onCancel={handleCancelAdd}
          allowances={allowances}
          isLoadingAllowances={isLoadingAllowances}
        />
      </TabsContent>
    </div>
  );
}
