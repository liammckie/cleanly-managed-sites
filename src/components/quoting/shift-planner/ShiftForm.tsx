
import React, { useState, useEffect } from 'react';
import { QuoteShift, Day, EmploymentType, EmployeeLevel } from '@/lib/types/award/types';
import { Button } from '@/components/ui/button';
import { calculateShiftCost } from '@/lib/utils/calculationUtils';

export interface ShiftFormProps {
  shift: QuoteShift;
  onUpdate: (shift: QuoteShift) => void;
  onDelete: (shift: QuoteShift) => void;
}

export function ShiftForm({ shift, onUpdate, onDelete }: ShiftFormProps) {
  const [localShift, setLocalShift] = useState<QuoteShift>({ ...shift });
  
  useEffect(() => {
    setLocalShift({ ...shift });
  }, [shift]);
  
  const handleInputChange = (field: keyof QuoteShift, value: any) => {
    setLocalShift(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calculate cost when relevant fields change
      if (['startTime', 'endTime', 'breakDuration', 'numberOfCleaners', 'employmentType', 'level'].includes(field)) {
        // Add a dummy second parameter to calculateShiftCost call to match expected type
        const cost = calculateShiftCost(updated, {});
        updated.estimatedCost = cost;
      }
      
      return updated;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(localShift);
  };
  
  // Calculation with dummy parameter
  const shiftCost = calculateShiftCost(localShift, {});
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Day</label>
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={localShift.day}
            onChange={(e) => handleInputChange('day', e.target.value as Day)}
          >
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 p-2"
            value={localShift.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter location..."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Start Time</label>
          <input
            type="time"
            className="w-full rounded-md border border-gray-300 p-2"
            value={localShift.startTime || ''}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">End Time</label>
          <input
            type="time"
            className="w-full rounded-md border border-gray-300 p-2"
            value={localShift.endTime || ''}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Break (minutes)</label>
          <input
            type="number"
            className="w-full rounded-md border border-gray-300 p-2"
            value={localShift.breakDuration || 0}
            onChange={(e) => handleInputChange('breakDuration', parseInt(e.target.value))}
            min="0"
            max="120"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Number of Cleaners</label>
          <input
            type="number"
            className="w-full rounded-md border border-gray-300 p-2"
            value={localShift.numberOfCleaners || 1}
            onChange={(e) => handleInputChange('numberOfCleaners', parseInt(e.target.value))}
            min="1"
            max="20"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Employment Type</label>
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={localShift.employmentType}
            onChange={(e) => handleInputChange('employmentType', e.target.value as EmploymentType)}
          >
            <option value="casual">Casual</option>
            <option value="part_time">Part Time</option>
            <option value="full_time">Full Time</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Level</label>
          <select
            className="w-full rounded-md border border-gray-300 p-2"
            value={localShift.level || 1}
            onChange={(e) => handleInputChange('level', parseInt(e.target.value) as EmployeeLevel)}
          >
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
          </select>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Estimated Cost:</p>
            <p className="text-lg font-bold">${shiftCost.toFixed(2)}</p>
          </div>
          
          <div className="space-x-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDelete(localShift)}
            >
              Delete
            </Button>
            
            <Button
              type="submit"
              variant="default"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
