
import React from 'react';
import { QuoteShift } from '@/lib/award/types';
import { ShiftList } from './ShiftList';
import { ShiftForm } from './ShiftForm';
import { ShiftCalendar } from './ShiftCalendar';
import { Card } from '@/components/ui/card';

interface ShiftSchedulerProps {
  activeView: 'calendar' | 'list' | 'add';
  shifts: QuoteShift[];
  newShift: Partial<QuoteShift>;
  allowances: Array<{
    id: string;
    name: string;
    amount: number;
    unit: string;
    description?: string;
  }>;
  isLoadingAllowances: boolean;
  onShiftChange: (field: string, value: any) => void;
  onAllowanceToggle: (allowanceId: string) => void;
  onAddShift: () => void;
  onDeleteShift: (shiftId: string) => void;
  onDuplicateShift: (shift: QuoteShift) => void;
  onUpdateShift: (updatedShift: QuoteShift) => void;
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
  if (activeView === 'list') {
    return (
      <ShiftList 
        shifts={shifts}
        onDeleteShift={onDeleteShift}
        onDuplicateShift={onDuplicateShift}
        onAddShiftClick={onAddShiftClick}
        allowances={allowances}
        onUpdateShift={onUpdateShift}
      />
    );
  }
  
  if (activeView === 'add') {
    return (
      <ShiftForm 
        newShift={newShift}
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
        onAddShiftClick={onAddShiftClick}
        onEditShift={onUpdateShift}
        onDuplicateShift={onDuplicateShift}
        onDeleteShift={onDeleteShift}
      />
    );
  }
  
  // Fallback
  return <Card className="p-6">View not available</Card>;
}
