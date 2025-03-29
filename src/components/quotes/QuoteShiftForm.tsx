
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface QuoteShiftFormProps {
  quoteId: string;
  onSubmit?: (shiftData: any) => void;
}

/**
 * A form component for managing quote shifts.
 */
const QuoteShiftForm: React.FC<QuoteShiftFormProps> = ({ quoteId, onSubmit }) => {
  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    numberOfCleaners: 1,
    breakDuration: 30,
    level: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ ...formData, quoteId });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Quote Shift</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Day</label>
            <Input 
              name="day"
              value={formData.day}
              onChange={handleChange}
              placeholder="Monday, Tuesday, etc."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <Input 
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              placeholder="09:00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <Input 
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              placeholder="17:00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Number of Cleaners</label>
            <Input 
              type="number"
              name="numberOfCleaners"
              value={formData.numberOfCleaners}
              onChange={handleChange}
              min={1}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Break Duration (minutes)</label>
            <Input 
              type="number"
              name="breakDuration"
              value={formData.breakDuration}
              onChange={handleChange}
              min={0}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Level</label>
            <Input 
              type="number"
              name="level"
              value={formData.level}
              onChange={handleChange}
              min={1}
              max={5}
            />
          </div>
        </div>
        
        <Button type="submit" className="mt-4">Save Shift</Button>
      </div>
    </Form>
  );
};

export default QuoteShiftForm;
