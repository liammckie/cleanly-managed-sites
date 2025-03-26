
import React, { useState, useEffect } from 'react';
import { QuoteShift, QuoteSubcontractor, Quote } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';
import { ShiftPlanner } from './ShiftPlanner';
import { SubcontractorSection } from './SubcontractorSection';
import { QuoteDetailsForm } from './QuoteDetailsForm';
import { QuoteDetails } from './QuoteDetails';
import { adaptQuoteShift } from '@/utils/typeAdapters';

interface QuoteBuilderProps {
  initialQuote?: Partial<Quote>;
  onSave: (quote: Quote) => void;
  isEditing?: boolean;
}

export function QuoteBuilder({ initialQuote, onSave, isEditing = false }: QuoteBuilderProps) {
  const [quote, setQuote] = useState<Quote>(() => {
    const defaultQuote: Quote = {
      id: uuidv4(),
      name: '',
      title: '',
      client_name: '',
      clientName: '',
      site_name: '',
      siteName: '',
      description: '',
      status: 'draft',
      overhead_percentage: 15,
      overheadPercentage: 15,
      margin_percentage: 20,
      marginPercentage: 20,
      total_price: 0,
      totalPrice: 0,
      labor_cost: 0,
      laborCost: 0,
      subcontractor_cost: 0,
      subcontractorCost: 0,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: '',
      shifts: [],
      subcontractors: []
    };
    
    return { ...defaultQuote, ...initialQuote };
  });
  
  // Function to update a field in the quote
  const updateQuoteField = (field: string, value: any) => {
    setQuote(prev => ({ ...prev, [field]: value }));
  };
  
  // Add a new shift to the quote
  const handleAddShift = (shiftData: Partial<QuoteShift>) => {
    const newShift: QuoteShift = {
      id: uuidv4(),
      quoteId: quote.id,
      day: shiftData.day!,
      startTime: shiftData.startTime || '09:00',
      endTime: shiftData.endTime || '17:00',
      breakDuration: shiftData.breakDuration || 30,
      numberOfCleaners: shiftData.numberOfCleaners || 1,
      employmentType: shiftData.employmentType || 'casual',
      level: shiftData.level || 1,
      allowances: shiftData.allowances || [],
      estimatedCost: 0, // Will be calculated later
      location: shiftData.location || '',
      notes: shiftData.notes || ''
    };
    
    // Add the new shift to the shifts array using adaptQuoteShift to ensure type compatibility
    setQuote(prev => ({
      ...prev,
      shifts: [...(prev.shifts || []), adaptQuoteShift(newShift, newShift)]
    }));
  };
  
  // Remove a shift from the quote
  const handleRemoveShift = (shiftId: string) => {
    setQuote(prev => ({
      ...prev,
      shifts: (prev.shifts || []).filter(shift => shift.id !== shiftId)
    }));
  };
  
  // Add a new subcontractor to the quote
  const handleAddSubcontractor = (subcontractor: Partial<QuoteSubcontractor>) => {
    const newSubcontractor: QuoteSubcontractor = {
      id: uuidv4(),
      quoteId: quote.id,
      name: subcontractor.name || '',
      cost: subcontractor.cost || 0,
      frequency: subcontractor.frequency || 'monthly',
      description: subcontractor.description || '',
      email: subcontractor.email || '',
      phone: subcontractor.phone || '',
      service: subcontractor.service || '',
      notes: subcontractor.notes || '',
      services: subcontractor.services || []
    };
    
    setQuote(prev => ({
      ...prev,
      subcontractors: [...(prev.subcontractors || []), newSubcontractor]
    }));
  };
  
  // Remove a subcontractor from the quote
  const handleRemoveSubcontractor = (subcontractorId: string) => {
    setQuote(prev => ({
      ...prev,
      subcontractors: (prev.subcontractors || []).filter(s => s.id !== subcontractorId)
    }));
  };
  
  // Handle showing the quote details for viewing/confirmation
  const handleShowDetails = () => {
    onSave(quote);
  };
  
  return (
    <div className="space-y-8">
      {/* Quote Details Form */}
      <QuoteDetailsForm quote={quote} onUpdate={updateQuoteField} />
      
      {/* Shift Planner */}
      <ShiftPlanner 
        shifts={quote.shifts || []} 
        onAddShift={handleAddShift} 
        onRemoveShift={handleRemoveShift} 
      />
      
      {/* Subcontractor Section */}
      <SubcontractorSection 
        subcontractors={quote.subcontractors || []} 
        onAddSubcontractor={handleAddSubcontractor} 
        onRemoveSubcontractor={handleRemoveSubcontractor} 
      />
      
      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onClick={handleShowDetails}
        >
          {isEditing ? 'Update Quote' : 'Create Quote'}
        </button>
      </div>
    </div>
  );
}
