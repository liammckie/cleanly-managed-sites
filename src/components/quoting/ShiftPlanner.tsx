
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QuoteShift } from '@/lib/award/types';
import useShiftManagement from '@/hooks/useShiftManagement';
import { ShiftScheduler } from './shift-planner/ShiftScheduler';
import { useAllowances } from '@/hooks/useQuotes';
import { calculateShiftCost } from '@/lib/award/shiftCalculations';
import { fetchQuoteShifts, updateQuoteShifts } from '@/lib/api/quotes';
import { toast } from 'sonner';

interface ShiftPlannerProps {
  quoteId?: string | null;
  shifts?: QuoteShift[];
  onShiftsChange?: (shifts: QuoteShift[]) => void;
}

export function ShiftPlanner({ quoteId, shifts: externalShifts, onShiftsChange }: ShiftPlannerProps) {
  const [activeView, setActiveView] = useState<'calendar' | 'list' | 'add'>('list');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get allowances for shift costing
  const { data: allowances, isLoading: isLoadingAllowances } = useAllowances();
  
  // Initialize with external shifts if provided, otherwise empty array
  const { 
    shifts, 
    addShift: addShiftToState, 
    updateShift, 
    deleteShift, 
    setShifts 
  } = useShiftManagement(externalShifts || [], quoteId || undefined);
  
  // State for the new shift being added
  const [newShift, setNewShift] = useState<Partial<QuoteShift>>({
    day: 'monday',
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 30,
    level: 1,
    employmentType: 'full-time',
    numberOfCleaners: 1,
    location: '',
    allowances: []
  });
  
  // Load shifts for the quote if quoteId is provided but no external shifts
  useEffect(() => {
    if (quoteId && !externalShifts) {
      setIsLoading(true);
      fetchQuoteShifts(quoteId)
        .then(fetchedShifts => {
          setShifts(fetchedShifts);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading shifts:', error);
          toast.error('Failed to load shifts');
          setIsLoading(false);
        });
    }
  }, [quoteId, externalShifts, setShifts]);
  
  // Update parent component if shifts change
  useEffect(() => {
    if (onShiftsChange) {
      onShiftsChange(shifts);
    }
  }, [shifts, onShiftsChange]);
  
  // Save shifts to database if quoteId is provided and local state changes
  const saveShifts = async () => {
    if (!quoteId) return;
    
    setIsLoading(true);
    try {
      await updateQuoteShifts(quoteId, shifts);
      toast.success('Shifts saved successfully');
    } catch (error) {
      console.error('Error saving shifts:', error);
      toast.error('Failed to save shifts');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding a new shift
  const handleAddShift = () => {
    // Calculate estimated cost for the shift
    const costEstimate = calculateShiftCost(newShift);
    
    // Add the shift to state
    addShiftToState();
    
    // Reset the newShift form
    setNewShift({
      day: 'monday',
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 30,
      level: 1,
      employmentType: 'full-time',
      numberOfCleaners: 1,
      location: '',
      allowances: []
    });
    
    // Switch back to list view
    setActiveView('list');
    
    // Save to database if quoteId is provided
    if (quoteId) {
      saveShifts();
    }
  };
  
  // Handle form field changes for new shift
  const handleShiftChange = (field: string, value: any) => {
    setNewShift(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate cost if relevant fields change
      if (['day', 'startTime', 'endTime', 'breakDuration', 'level', 'employmentType', 'numberOfCleaners'].includes(field)) {
        return {
          ...updated,
          estimatedCost: calculateShiftCost(updated)
        };
      }
      
      return updated;
    });
  };
  
  // Handle toggling allowances for the new shift
  const handleAllowanceToggle = (allowanceId: string) => {
    setNewShift(prev => {
      const currentAllowances = prev.allowances || [];
      const allowanceIndex = currentAllowances.indexOf(allowanceId);
      
      let updatedAllowances;
      if (allowanceIndex >= 0) {
        // Remove allowance if it exists
        updatedAllowances = [
          ...currentAllowances.slice(0, allowanceIndex),
          ...currentAllowances.slice(allowanceIndex + 1)
        ];
      } else {
        // Add allowance if it doesn't exist
        updatedAllowances = [...currentAllowances, allowanceId];
      }
      
      return {
        ...prev,
        allowances: updatedAllowances,
        estimatedCost: calculateShiftCost({
          ...prev,
          allowances: updatedAllowances
        })
      };
    });
  };
  
  // Handle deleting a shift
  const handleDeleteShift = (shiftId: string) => {
    deleteShift(shiftId);
    
    // Save to database if quoteId is provided
    if (quoteId) {
      saveShifts();
    }
  };
  
  // Handle duplicating a shift
  const handleDuplicateShift = (shift: QuoteShift) => {
    const duplicatedShift: QuoteShift = {
      ...shift,
      id: crypto.randomUUID(), // Generate a new ID
    };
    
    setShifts([...shifts, duplicatedShift]);
    
    // Save to database if quoteId is provided
    if (quoteId) {
      saveShifts();
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Shift List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <ShiftScheduler
            activeView={activeView}
            shifts={shifts}
            newShift={newShift}
            allowances={allowances || []}
            isLoadingAllowances={isLoadingAllowances}
            onShiftChange={handleShiftChange}
            onAllowanceToggle={handleAllowanceToggle}
            onAddShift={handleAddShift}
            onDeleteShift={handleDeleteShift}
            onDuplicateShift={handleDuplicateShift}
            onUpdateShift={(updatedShift) => {
              updateShift(updatedShift.id, updatedShift);
              if (quoteId) saveShifts();
            }}
            onCancel={() => setActiveView('list')}
            onAddShiftClick={() => setActiveView('add')}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
}
