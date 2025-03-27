
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Day, EmployeeLevel, EmploymentType, UnifiedDay } from '@/types/common';
import { QuoteShift } from '@/types/models';
import { adaptEmploymentType } from '@/utils/typeAdapters';

interface ShiftSchedulerProps {
  onAddShift: (shift: Partial<QuoteShift>) => void;
  existingShifts?: QuoteShift[];
}

export function ShiftScheduler({ onAddShift, existingShifts = [] }: ShiftSchedulerProps) {
  // Default values for a new shift
  const [day, setDay] = useState<UnifiedDay>('monday');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('16:00');
  const [breakDuration, setBreakDuration] = useState(30);
  const [numberOfCleaners, setNumberOfCleaners] = useState(1);
  const [employmentType, setEmploymentType] = useState<EmploymentType>('casual');
  const [level, setLevel] = useState<EmployeeLevel>(1);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddShift = () => {
    // Create a new shift object with the current form values
    const newShift: Partial<QuoteShift> = {
      day: day as Day,
      employment_type: employmentType,
      start_time: startTime,
      end_time: endTime,
      break_duration: breakDuration,
      number_of_cleaners: numberOfCleaners,
      level,
      location,
      notes,
      allowances: [] // Empty allowances array by default
    };

    // Call the parent component's add function
    onAddShift(newShift);

    // Reset form values for the next shift
    setNotes('');
    setLocation('');
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">Schedule a New Shift</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Day</label>
          <Select value={day} onValueChange={(value) => setDay(value as UnifiedDay)}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monday">Monday</SelectItem>
              <SelectItem value="tuesday">Tuesday</SelectItem>
              <SelectItem value="wednesday">Wednesday</SelectItem>
              <SelectItem value="thursday">Thursday</SelectItem>
              <SelectItem value="friday">Friday</SelectItem>
              <SelectItem value="saturday">Saturday</SelectItem>
              <SelectItem value="sunday">Sunday</SelectItem>
              <SelectItem value="weekday">Weekday</SelectItem>
              <SelectItem value="public_holiday">Public Holiday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Employment Type</label>
          <Select value={employmentType} onValueChange={(value) => setEmploymentType(value as EmploymentType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="full_time">Full Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Break Duration (minutes)</label>
          <Input 
            type="number" 
            value={breakDuration} 
            onChange={(e) => setBreakDuration(parseInt(e.target.value))} 
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Number of Cleaners</label>
          <Input 
            type="number" 
            value={numberOfCleaners} 
            onChange={(e) => setNumberOfCleaners(parseInt(e.target.value))} 
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Employee Level</label>
          <Select 
            value={level.toString()} 
            onValueChange={(value) => setLevel(parseInt(value) as EmployeeLevel)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
              <SelectItem value="5">Level 5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location (optional)</label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes (optional)</label>
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <Button onClick={handleAddShift} className="w-full">Add Shift</Button>
    </div>
  );
}
