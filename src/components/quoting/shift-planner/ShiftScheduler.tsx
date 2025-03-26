import React from 'react';
import { ShiftForm } from './ShiftForm';
import { ShiftList } from './ShiftList';
import { ShiftCalendar } from './ShiftCalendar';
import { QuoteShift } from '@/lib/types/award/types';

interface ShiftCalendarProps {
  shifts: QuoteShift[];
  onDeleteShift: (shiftId: string) => void;
  onDuplicateShift: (shift: QuoteShift) => void;
  onUpdateShift: (shift: QuoteShift) => void;
}

interface ShiftListProps extends ShiftCalendarProps {
  onAddClick: () => void;
}

interface ShiftSchedulerProps {
  activeView: 'calendar' | 'list' | 'add';
  shifts: QuoteShift[];
  newShift: Partial<QuoteShift>;
  allowances: Array<{ id: string; name: string; description?: string }>;
  isLoadingAllowances: boolean;
  onShiftChange: (field: string, value: any) => void;
  onAllowanceToggle: (allowanceId: string) => void;
  onAddShift: () => void;
  onDeleteShift: (shiftId: string) => void;
  onDuplicateShift: (shift: QuoteShift) => void;
  onUpdateShift: (shift: QuoteShift) => void;
  onCancel: () => void;
  onAddShiftClick: () => void;
}

export function ShiftScheduler({
  activeView,
  shifts,
  newShift,
  allowances,
  isLoadingAllowances,
  onShiftChange,
  onAllowanceToggle,
  onAddShift,
  onDeleteShift,
  onDuplicateShift,
  onUpdateShift,
  onCancel,
  onAddShiftClick
}: ShiftSchedulerProps) {
  // Render the appropriate view based on activeView prop
  if (activeView === 'add') {
    return (
      <ShiftForm 
        shift={newShift}
        onShiftChange={onShiftChange}
        onAllowanceToggle={onAllowanceToggle}
        onAddShift={onAddShift}
        onCancel={onCancel}
        allowances={allowances}
        isLoadingAllowances={isLoadingAllowances}
      />
    );
  }
  
  if (activeView === 'calendar') {
    return (
      <ShiftCalendar 
        shifts={shifts}
        onDeleteShift={onDeleteShift}
        onDuplicateShift={onDuplicateShift}
        onUpdateShift={onUpdateShift}
      />
    );
  }
  
  // Default to list view
  return (
    <ShiftList 
      shifts={shifts}
      onDeleteShift={onDeleteShift}
      onDuplicateShift={onDuplicateShift}
      onUpdateShift={onUpdateShift}
      onAddClick={onAddShiftClick}
    />
  );
}
