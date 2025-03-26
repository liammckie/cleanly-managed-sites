
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DbQuoteSubcontractor } from '@/types/api';
import { QuoteSubcontractor } from '@/types/models';
import { quoteSubcontractorToDb, dbToQuoteSubcontractor } from '@/utils/typeAdapters';

// Fetch quote subcontractors
export const fetchQuoteSubcontractors = async (quoteId: string) => {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);
  
  if (error) {
    console.error('Error fetching quote subcontractors:', error);
    throw new Error(error.message);
  }
  
  return data ? data.map(item => {
    // Cast to a DbQuoteSubcontractor with optional fields to avoid type errors
    const dbSubcontractor = item as DbQuoteSubcontractor;
    
    return {
      id: dbSubcontractor.id,
      quoteId: dbSubcontractor.quote_id,
      name: dbSubcontractor.name,
      description: dbSubcontractor.description || '',
      cost: dbSubcontractor.cost || 0,
      frequency: dbSubcontractor.frequency || 'monthly',
      email: dbSubcontractor.email || '',
      phone: dbSubcontractor.phone || '',
      service: dbSubcontractor.service || '',
      notes: dbSubcontractor.notes || '',
      services: dbSubcontractor.services || [],
      customServices: dbSubcontractor.custom_services || '',
      monthlyCost: dbSubcontractor.monthly_cost || 0,
      isFlatRate: dbSubcontractor.is_flat_rate || false
    } as QuoteSubcontractor;
  }) : [];
};

// Create a new quote subcontractor
export const createQuoteSubcontractor = async (subcontractor: Partial<QuoteSubcontractor>) => {
  // Required fields validation
  if (!subcontractor.quoteId) {
    throw new Error('Quote ID is required for subcontractor creation');
  }
  
  if (!subcontractor.name) {
    throw new Error('Subcontractor name is required');
  }
  
  const dbSubcontractor = {
    id: subcontractor.id || crypto.randomUUID(),
    quote_id: subcontractor.quoteId,
    name: subcontractor.name,
    description: subcontractor.description || '',
    cost: subcontractor.cost || 0,
    frequency: subcontractor.frequency?.toString() || 'monthly',
    email: subcontractor.email || '',
    phone: subcontractor.phone || '',
    service: subcontractor.service || '',
    notes: subcontractor.notes || '',
    services: subcontractor.services || [],
    custom_services: subcontractor.customServices || '',
    monthly_cost: subcontractor.monthlyCost || 0,
    is_flat_rate: subcontractor.isFlatRate || false
  };
  
  // Insert the subcontractor
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .insert([dbSubcontractor])
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating quote subcontractor:', error);
    throw new Error(error.message);
  }
  
  if (!data) {
    throw new Error('Failed to create quote subcontractor');
  }
  
  // Map the DB response back to our app model
  return {
    id: data.id,
    quoteId: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost || 0,
    frequency: data.frequency || 'monthly',
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    notes: data.notes || '',
    services: data.services || [],
    customServices: data.custom_services || '',
    monthlyCost: data.monthly_cost || 0,
    isFlatRate: data.is_flat_rate || false
  } as QuoteSubcontractor;
};

// Update an existing quote subcontractor
export const updateQuoteSubcontractor = async (subcontractorId: string, updates: Partial<QuoteSubcontractor>) => {
  const dbUpdates: Partial<DbQuoteSubcontractor> = {};
  
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.cost !== undefined) dbUpdates.cost = updates.cost;
  if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency?.toString();
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.service !== undefined) dbUpdates.service = updates.service;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.services !== undefined) dbUpdates.services = updates.services;
  if (updates.customServices !== undefined) dbUpdates.custom_services = updates.customServices;
  if (updates.monthlyCost !== undefined) dbUpdates.monthly_cost = updates.monthlyCost;
  if (updates.isFlatRate !== undefined) dbUpdates.is_flat_rate = updates.isFlatRate;
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .update(dbUpdates)
    .eq('id', subcontractorId)
    .select('*')
    .single();
  
  if (error) {
    console.error('Error updating quote subcontractor:', error);
    throw new Error(error.message);
  }
  
  if (!data) {
    throw new Error('Failed to update quote subcontractor');
  }
  
  // Map the DB response back to our app model
  return {
    id: data.id,
    quoteId: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost || 0,
    frequency: data.frequency || 'monthly',
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    notes: data.notes || '',
    services: data.services || [],
    customServices: data.custom_services || '',
    monthlyCost: data.monthly_cost || 0,
    isFlatRate: data.is_flat_rate || false
  } as QuoteSubcontractor;
};

// Delete a quote subcontractor
export const deleteQuoteSubcontractor = async (subcontractorId: string) => {
  const { error } = await supabase
    .from('quote_subcontractors')
    .delete()
    .eq('id', subcontractorId);
  
  if (error) {
    console.error('Error deleting quote subcontractor:', error);
    throw new Error(error.message);
  }
  
  return { success: true };
};

export const quoteSubcontractorsApi = {
  fetchQuoteSubcontractors,
  createQuoteSubcontractor,
  updateQuoteSubcontractor,
  deleteQuoteSubcontractor,
};

export default quoteSubcontractorsApi;
