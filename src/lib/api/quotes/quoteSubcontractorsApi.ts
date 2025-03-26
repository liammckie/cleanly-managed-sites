
import { supabase } from '@/integrations/supabase/client';
import { QuoteSubcontractor } from '@/types/models';
import { DbQuoteSubcontractor } from '@/types/api';
import { dbToQuoteSubcontractor, quoteSubcontractorToDb } from '@/utils/typeAdapters';

// Fetch subcontractors for a specific quote
export const fetchQuoteSubcontractors = async (quoteId: string): Promise<QuoteSubcontractor[]> => {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);
  
  if (error) {
    console.error('Error fetching quote subcontractors:', error);
    throw new Error(error.message);
  }
  
  return (data || []).map(subcontractor => {
    // Create a valid DbQuoteSubcontractor with all required fields
    const dbSub: DbQuoteSubcontractor = {
      id: subcontractor.id,
      quote_id: subcontractor.quote_id,
      name: subcontractor.name,
      description: subcontractor.description || '',
      cost: subcontractor.cost || 0,
      frequency: subcontractor.frequency || 'monthly',
      created_at: subcontractor.created_at,
      updated_at: subcontractor.updated_at,
      email: subcontractor.email || '',
      phone: subcontractor.phone || '',
      service: subcontractor.service || '',
      notes: subcontractor.notes || '',
      services: subcontractor.services || []
    };
    
    return dbToQuoteSubcontractor(dbSub);
  });
};

// Create a new subcontractor for a quote
export const createQuoteSubcontractor = async (
  subcontractor: Partial<QuoteSubcontractor>
): Promise<QuoteSubcontractor> => {
  if (!subcontractor.quoteId) {
    throw new Error('Quote ID is required to create a subcontractor');
  }
  
  if (!subcontractor.name) {
    throw new Error('Subcontractor name is required');
  }
  
  const dbSub = quoteSubcontractorToDb({
    id: crypto.randomUUID(),
    quoteId: subcontractor.quoteId,
    name: subcontractor.name,
    description: subcontractor.description || '',
    cost: subcontractor.cost || 0,
    frequency: subcontractor.frequency || 'monthly',
    email: subcontractor.email || '',
    phone: subcontractor.phone || '',
    service: subcontractor.service || '',
    notes: subcontractor.notes || '',
    services: subcontractor.services || []
  } as QuoteSubcontractor);
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .insert([dbSub])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating quote subcontractor:', error);
    throw new Error(error.message);
  }
  
  // Create a valid DbQuoteSubcontractor before converting
  const newDbSub: DbQuoteSubcontractor = {
    id: data.id,
    quote_id: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost || 0,
    frequency: data.frequency || 'monthly',
    created_at: data.created_at,
    updated_at: data.updated_at,
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    notes: data.notes || '',
    services: data.services || []
  };
  
  return dbToQuoteSubcontractor(newDbSub);
};

// Delete a subcontractor from a quote
export const deleteQuoteSubcontractor = async (subcontractorId: string): Promise<void> => {
  const { error } = await supabase
    .from('quote_subcontractors')
    .delete()
    .eq('id', subcontractorId);
  
  if (error) {
    console.error('Error deleting quote subcontractor:', error);
    throw new Error(error.message);
  }
};

// Update an existing subcontractor
export const updateQuoteSubcontractor = async (
  subcontractorId: string,
  subcontractor: Partial<QuoteSubcontractor>
): Promise<QuoteSubcontractor> => {
  // Create valid DB format for the update
  const updateData = {
    name: subcontractor.name,
    description: subcontractor.description,
    cost: subcontractor.cost,
    frequency: subcontractor.frequency,
    email: subcontractor.email,
    phone: subcontractor.phone,
    service: subcontractor.service,
    notes: subcontractor.notes,
    services: subcontractor.services,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .update(updateData)
    .eq('id', subcontractorId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating quote subcontractor:', error);
    throw new Error(error.message);
  }
  
  // Create a valid DbQuoteSubcontractor before converting
  const updatedDbSub: DbQuoteSubcontractor = {
    id: data.id,
    quote_id: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost || 0,
    frequency: data.frequency || 'monthly',
    created_at: data.created_at,
    updated_at: data.updated_at,
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    notes: data.notes || '',
    services: data.services || []
  };
  
  return dbToQuoteSubcontractor(updatedDbSub);
};
