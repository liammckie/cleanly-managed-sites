
import { supabase } from '@/lib/supabase';
import { QuoteSubcontractor, Subcontractor } from '@/types/models';

// Fetch subcontractors for a specific quote
export const fetchQuoteSubcontractorsByQuoteId = async (quoteId: string): Promise<QuoteSubcontractor[]> => {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .select('*')
    .eq('quote_id', quoteId);

  if (error) {
    console.error('Error fetching quote subcontractors:', error);
    throw new Error(`Failed to fetch quote subcontractors: ${error.message}`);
  }

  return data.map(subcontractor => ({
    id: subcontractor.id,
    quoteId: subcontractor.quote_id,
    name: subcontractor.name,
    description: subcontractor.description || '',
    cost: subcontractor.cost,
    frequency: subcontractor.frequency as any,
    email: subcontractor.email,
    phone: subcontractor.phone,
    service: subcontractor.service,
    notes: subcontractor.notes,
    services: subcontractor.services,
    customServices: subcontractor.custom_services,
    monthlyCost: subcontractor.monthly_cost,
    isFlatRate: subcontractor.is_flat_rate,
    custom_services: subcontractor.custom_services,
    monthly_cost: subcontractor.monthly_cost,
    is_flat_rate: subcontractor.is_flat_rate
  }));
};

// Create a new subcontractor for a quote
export const createQuoteSubcontractor = async (subcontractorData: Partial<Subcontractor>): Promise<QuoteSubcontractor> => {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .insert([{
      quote_id: subcontractorData.quoteId,
      name: subcontractorData.name,
      description: subcontractorData.description,
      cost: subcontractorData.cost,
      frequency: subcontractorData.frequency,
      email: subcontractorData.email,
      phone: subcontractorData.phone,
      service: subcontractorData.service,
      notes: subcontractorData.notes,
      services: subcontractorData.services,
      custom_services: subcontractorData.customServices,
      monthly_cost: subcontractorData.monthlyCost,
      is_flat_rate: subcontractorData.isFlatRate
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating quote subcontractor:', error);
    throw new Error(`Failed to create quote subcontractor: ${error.message}`);
  }

  return {
    id: data.id,
    quoteId: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost,
    frequency: data.frequency as any,
    email: data.email,
    phone: data.phone,
    service: data.service,
    notes: data.notes,
    services: data.services,
    customServices: data.custom_services,
    monthlyCost: data.monthly_cost,
    isFlatRate: data.is_flat_rate,
    custom_services: data.custom_services,
    monthly_cost: data.monthly_cost,
    is_flat_rate: data.is_flat_rate
  };
};

// Update an existing quote subcontractor
export const updateQuoteSubcontractor = async (subcontractorData: QuoteSubcontractor): Promise<QuoteSubcontractor> => {
  const { data, error } = await supabase
    .from('quote_subcontractors')
    .update({
      name: subcontractorData.name,
      description: subcontractorData.description,
      cost: subcontractorData.cost,
      frequency: subcontractorData.frequency,
      email: subcontractorData.email,
      phone: subcontractorData.phone,
      service: subcontractorData.service,
      notes: subcontractorData.notes,
      services: subcontractorData.services,
      custom_services: subcontractorData.customServices,
      monthly_cost: subcontractorData.monthlyCost,
      is_flat_rate: subcontractorData.isFlatRate
    })
    .eq('id', subcontractorData.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating quote subcontractor:', error);
    throw new Error(`Failed to update quote subcontractor: ${error.message}`);
  }

  return {
    id: data.id,
    quoteId: data.quote_id,
    name: data.name,
    description: data.description || '',
    cost: data.cost,
    frequency: data.frequency as any,
    email: data.email,
    phone: data.phone,
    service: data.service,
    notes: data.notes,
    services: data.services,
    customServices: data.custom_services,
    monthlyCost: data.monthly_cost,
    isFlatRate: data.is_flat_rate,
    custom_services: data.custom_services,
    monthly_cost: data.monthly_cost,
    is_flat_rate: data.is_flat_rate
  };
};

// Delete a quote subcontractor
export const deleteQuoteSubcontractor = async (subcontractorId: string): Promise<void> => {
  const { error } = await supabase
    .from('quote_subcontractors')
    .delete()
    .eq('id', subcontractorId);

  if (error) {
    console.error('Error deleting quote subcontractor:', error);
    throw new Error(`Failed to delete quote subcontractor: ${error.message}`);
  }
};
