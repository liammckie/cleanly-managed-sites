
import { supabase } from '@/lib/supabase';
import { QuoteSubcontractor } from '@/types/models';

// Fetch all subcontractors for a quote
export const fetchQuoteSubcontractors = async (quoteId: string): Promise<QuoteSubcontractor[]> => {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);

  if (error) {
    throw new Error(`Error fetching subcontractors: ${error.message}`);
  }

  return data.map(subcontractor => ({
    id: subcontractor.id,
    quoteId: subcontractor.quote_id,
    name: subcontractor.name,
    description: subcontractor.description || '',
    cost: subcontractor.cost,
    frequency: subcontractor.frequency || 'monthly',
    email: subcontractor.email || '',
    phone: subcontractor.phone || '',
    service: subcontractor.service || '',
    notes: subcontractor.notes || '',
    services: subcontractor.services || [],
    customServices: subcontractor.custom_services || '',
    monthlyCost: subcontractor.monthly_cost || 0,
    isFlatRate: subcontractor.is_flat_rate || false,
  }));
};

// Create a new subcontractor for a quote
export const createQuoteSubcontractor = async (quoteId: string, subcontractorData: Partial<QuoteSubcontractor>): Promise<QuoteSubcontractor> => {
  // Convert camelCase to snake_case for database storage
  const dbSubcontractor = {
    quote_id: quoteId,
    name: subcontractorData.name,
    description: subcontractorData.description || '',
    cost: subcontractorData.cost || 0,
    frequency: subcontractorData.frequency || 'monthly',
    email: subcontractorData.email || '',
    phone: subcontractorData.phone || '',
    service: subcontractorData.service || '',
    notes: subcontractorData.notes || '',
    services: subcontractorData.services || [],
    custom_services: subcontractorData.customServices || '',
    monthly_cost: subcontractorData.monthlyCost || 0,
    is_flat_rate: subcontractorData.isFlatRate || true
  };

  // Insert the subcontractor into the database
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .insert(dbSubcontractor)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating subcontractor: ${error.message}`);
  }

  // Convert the database record to the client-side format
  return {
    id: data.id,
    quoteId: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost,
    frequency: data.frequency,
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    notes: data.notes || '',
    services: data.services || [],
    customServices: data.custom_services || '',
    monthlyCost: data.monthly_cost || 0,
    isFlatRate: data.is_flat_rate || false
  };
};

// Update an existing subcontractor
export const updateQuoteSubcontractor = async (subcontractorId: string, subcontractorData: Partial<QuoteSubcontractor>): Promise<QuoteSubcontractor> => {
  // Convert camelCase to snake_case for database storage
  const dbSubcontractor = {
    name: subcontractorData.name,
    description: subcontractorData.description || '',
    cost: subcontractorData.cost || 0,
    frequency: subcontractorData.frequency || 'monthly',
    email: subcontractorData.email || '',
    phone: subcontractorData.phone || '',
    service: subcontractorData.service || '',
    notes: subcontractorData.notes || '',
    services: subcontractorData.services || [],
    custom_services: subcontractorData.customServices || '',
    monthly_cost: subcontractorData.monthlyCost || 0,
    is_flat_rate: subcontractorData.isFlatRate || true
  };

  // Update the subcontractor in the database
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .update(dbSubcontractor)
    .eq('id', subcontractorId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating subcontractor: ${error.message}`);
  }

  // Convert the database record to the client-side format
  return {
    id: data.id,
    quoteId: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost,
    frequency: data.frequency,
    email: data.email || '',
    phone: data.phone || '',
    service: data.service || '',
    notes: data.notes || '',
    services: data.services || [],
    customServices: data.custom_services || '',
    monthlyCost: data.monthly_cost || 0,
    isFlatRate: data.is_flat_rate || false
  };
};

// Delete a subcontractor
export const deleteQuoteSubcontractor = async (subcontractorId: string): Promise<void> => {
  const { error } = await supabase
    .from('quote_subcontractors')
    .delete()
    .eq('id', subcontractorId);

  if (error) {
    throw new Error(`Error deleting subcontractor: ${error.message}`);
  }
};
