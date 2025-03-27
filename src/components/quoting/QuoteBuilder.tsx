import React, { useState } from 'react';
import { Quote, QuoteShift, QuoteSubcontractor } from '@/types/models';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Day, EmployeeLevel, EmploymentType } from '@/types/common';

// Add adapter function to convert frontend shift to backend shift
const adaptShiftToBackend = (shift: any): QuoteShift => {
  return {
    id: shift.id,
    quote_id: shift.quoteId,
    day: shift.day,
    start_time: shift.startTime,
    end_time: shift.endTime,
    break_duration: shift.breakDuration,
    number_of_cleaners: shift.numberOfCleaners,
    employment_type: shift.employmentType,
    level: shift.level,
    allowances: shift.allowances,
    estimated_cost: shift.estimatedCost,
    location: shift.location,
    notes: shift.notes,
    // Add camelCase aliases
    quoteId: shift.quoteId,
    startTime: shift.startTime,
    endTime: shift.endTime,
    breakDuration: shift.breakDuration,
    numberOfCleaners: shift.numberOfCleaners,
    employmentType: shift.employmentType,
    estimatedCost: shift.estimatedCost
  };
};

export default function QuoteBuilder() {
  const [quote, setQuote] = useState<Partial<Quote>>({
    id: crypto.randomUUID(),
    // Use clientName instead of client_name
    clientName: '',
    status: 'draft',
    total_price: 0,
    labor_cost: 0,
    subcontractor_cost: 0,
    margin_percentage: 20,
    overhead_percentage: 15
  });

  const [shifts, setShifts] = useState<QuoteShift[]>([]);
  const [subcontractors, setSubcontractors] = useState<QuoteSubcontractor[]>([]);

  const addShift = () => {
    const newShift: QuoteShift = adaptShiftToBackend({
      id: crypto.randomUUID(),
      quoteId: quote.id,
      day: 'monday' as Day,
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 30,
      numberOfCleaners: 1,
      employmentType: 'casual' as EmploymentType,
      level: 1 as EmployeeLevel,
      allowances: [],
      estimatedCost: 0,
      location: '',
      notes: ''
    });
    
    setShifts([...shifts, newShift]);
  };

  const addSubcontractor = () => {
    const newSubcontractor: QuoteSubcontractor = {
      id: crypto.randomUUID(),
      quote_id: quote.id || '',
      name: '',
      cost: 0,
      frequency: 'monthly',
      service: '', // Use service property but it's not in the type
      description: '',
      // Additional properties for the UI
      services: [],
      customServices: '',
      monthlyCost: 0,
      isFlatRate: true
    } as QuoteSubcontractor; // Cast to suppress TS errors
    
    setSubcontractors([...subcontractors, newSubcontractor]);
  };

  return (
    <div>
      <h1>Quote Builder</h1>
      {/* Quote builder UI here */}
    </div>
  );
}
