
import { supabase } from '@/lib/supabase';
import { QuoteSubcontractor } from '@/types/models';
import { adaptQuoteSubcontractor, quoteSubcontractorToDb } from '@/utils/typeAdapters';

/**
 * Fetches all quote subcontractors
 */
export async function fetchQuoteSubcontractors(): Promise<QuoteSubcontractor[]> {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*');
    
  if (error) throw new Error(`Error fetching quote subcontractors: ${error.message}`);
  
  // Create a proper return array with default values for missing properties
  const subcontractors = data.map(item => {
    return {
      id: item.id,
      quoteId: item.quote_id,
      name: item.name,
      description: item.description || '',
      cost: item.cost,
      frequency: item.frequency,
      // The database might not have these fields yet, so we use defaults
      email: item.email || '',
      phone: item.phone || '',
      service: item.service || '',
      notes: item.notes || '',
      services: item.services || [],
      customServices: item.custom_services || '',
      monthlyCost: item.monthly_cost || 0,
      isFlatRate: item.is_flat_rate || false
    };
  });
  
  return subcontractors.map(adaptQuoteSubcontractor);
}

/**
 * Fetches quote subcontractors for a specific quote
 */
export async function fetchQuoteSubcontractorsByQuoteId(quoteId: string): Promise<QuoteSubcontractor[]> {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);
    
  if (error) throw new Error(`Error fetching quote subcontractors by quote ID: ${error.message}`);
  
  // Create a proper return array with default values for missing properties
  const subcontractors = data.map(item => {
    return {
      id: item.id,
      quoteId: item.quote_id,
      name: item.name,
      description: item.description || '',
      cost: item.cost,
      frequency: item.frequency,
      // The database might not have these fields yet, so we use defaults
      email: item.email || '',
      phone: item.phone || '',
      service: item.service || '',
      notes: item.notes || '',
      services: item.services || [],
      customServices: item.custom_services || '',
      monthlyCost: item.monthly_cost || 0,
      isFlatRate: item.is_flat_rate || false
    };
  });
  
  return subcontractors.map(adaptQuoteSubcontractor);
}

/**
 * Fetches a single quote subcontractor by ID
 */
export async function fetchQuoteSubcontractor(id: string): Promise<QuoteSubcontractor> {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw new Error(`Error fetching quote subcontractor: ${error.message}`);
  
  // Create a proper return object with default values for missing properties
  const subcontractor = {
    id: data.id,
    quoteId: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost,
    frequency: data.frequency,
    // The database might not have these fields yet, so we use defaults
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    notes: data.notes || '',
    services: data.services || [],
    customServices: data.custom_services || '',
    monthlyCost: data.monthly_cost || 0,
    isFlatRate: data.is_flat_rate || false
  };
  
  return adaptQuoteSubcontractor(subcontractor);
}

/**
 * Creates a new quote subcontractor
 */
export async function createQuoteSubcontractorMutation(subcontractor: Partial<QuoteSubcontractor>): Promise<QuoteSubcontractor> {
  const dbSubcontractor = quoteSubcontractorToDb({
    id: '',
    quoteId: subcontractor.quoteId || '',
    name: subcontractor.name || '',
    description: subcontractor.description || '',
    cost: subcontractor.cost || 0,
    frequency: subcontractor.frequency || 'monthly',
    email: subcontractor.email || '',
    phone: subcontractor.phone || '',
    service: subcontractor.service || '',
    notes: subcontractor.notes || '',
    services: subcontractor.services || [],
    customServices: subcontractor.customServices || '',
    monthlyCost: subcontractor.monthlyCost || 0,
    isFlatRate: subcontractor.isFlatRate || false
  } as QuoteSubcontractor);
  
  // Remove the ID field so Supabase will generate a new one
  delete (dbSubcontractor as any).id;
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .insert(dbSubcontractor)
    .select()
    .single();
    
  if (error) throw new Error(`Error creating quote subcontractor: ${error.message}`);
  
  // Create a proper return object with default values for missing properties
  const newSubcontractor = {
    id: data.id,
    quoteId: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost,
    frequency: data.frequency,
    // The database might not have these fields yet, so we use defaults
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    notes: data.notes || '',
    services: data.services || [],
    customServices: data.custom_services || '',
    monthlyCost: data.monthly_cost || 0,
    isFlatRate: data.is_flat_rate || false
  };
  
  return adaptQuoteSubcontractor(newSubcontractor);
}

/**
 * Updates an existing quote subcontractor
 */
export async function updateQuoteSubcontractorMutation(subcontractor: QuoteSubcontractor): Promise<QuoteSubcontractor> {
  const dbSubcontractor = quoteSubcontractorToDb(subcontractor);
  
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .update(dbSubcontractor)
    .eq('id', subcontractor.id)
    .select()
    .single();
    
  if (error) throw new Error(`Error updating quote subcontractor: ${error.message}`);
  
  // Create a proper return object with default values for missing properties
  const updatedSubcontractor = {
    id: data.id,
    quoteId: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost,
    frequency: data.frequency,
    // The database might not have these fields yet, so we use defaults
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    notes: data.notes || '',
    services: data.services || [],
    customServices: data.custom_services || '',
    monthlyCost: data.monthly_cost || 0,
    isFlatRate: data.is_flat_rate || false
  };
  
  return adaptQuoteSubcontractor(updatedSubcontractor);
}

/**
 * Deletes a quote subcontractor
 */
export async function deleteQuoteSubcontractorMutation(id: string): Promise<void> {
  const { error } = await supabase
    .from('quote_subcontractors')
    .delete()
    .eq('id', id);
    
  if (error) throw new Error(`Error deleting quote subcontractor: ${error.message}`);
}
