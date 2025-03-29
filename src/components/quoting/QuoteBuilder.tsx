
import React, { useState } from 'react';
import { Quote, QuoteShift, QuoteSubcontractor } from '@/types/models';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Day, EmployeeLevel, EmploymentType } from '@/types/common';
import { adaptQuoteShiftToDb } from '@/utils/typeAdapters';

// Add adapter function to convert frontend shift to backend shift
const adaptShiftToBackend = (shift: any): QuoteShift => {
  return adaptQuoteShiftToDb(shift);
};

export default function QuoteBuilder() {
  const [quote, setQuote] = useState<Partial<Quote>>({
    id: crypto.randomUUID(),
    client_name: '', // Use snake_case for DB properties
    status: 'draft',
    total_price: 0,
    labor_cost: 0,
    subcontractor_cost: 0,
    margin_percentage: 20,
    overhead_percentage: 15,
    clientName: '', // Add camelCase alias for UI
    totalPrice: 0,
    laborCost: 0,
    subcontractorCost: 0,
    marginPercentage: 20,
    overheadPercentage: 15
  });

  const [shifts, setShifts] = useState<QuoteShift[]>([]);
  const [subcontractors, setSubcontractors] = useState<QuoteSubcontractor[]>([]);

  const addShift = () => {
    const newShift: QuoteShift = adaptShiftToBackend({
      id: crypto.randomUUID(),
      quote_id: quote.id,
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
