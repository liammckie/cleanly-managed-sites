
import { Quote, QuoteShift, QuoteSubcontractor } from '@/types/models';
import { adaptDay, adaptFrequency } from './typeAdapters';

/**
 * Adapt a quote from one format to another
 */
export function adaptQuoteData(quote: any): Quote {
  // Create a base quote object
  const adaptedQuote: Quote = {
    id: quote.id || crypto.randomUUID(),
    name: quote.name || '',
    title: quote.title || '',
    client_name: quote.client_name || quote.clientName || '',
    clientName: quote.clientName || quote.client_name || '',
    site_name: quote.site_name || quote.siteName || '',
    siteName: quote.siteName || quote.site_name || '',
    description: quote.description || '',
    status: adaptQuoteStatus(quote.status || 'draft'),
    overhead_percentage: Number(quote.overhead_percentage || quote.overheadPercentage || 15),
    overheadPercentage: Number(quote.overheadPercentage || quote.overhead_percentage || 15),
    margin_percentage: Number(quote.margin_percentage || quote.marginPercentage || 20),
    marginPercentage: Number(quote.marginPercentage || quote.margin_percentage || 20),
    total_price: Number(quote.total_price || quote.totalPrice || 0),
    totalPrice: Number(quote.totalPrice || quote.total_price || 0),
    labor_cost: Number(quote.labor_cost || quote.laborCost || 0),
    laborCost: Number(quote.laborCost || quote.labor_cost || 0),
    supplies_cost: Number(quote.supplies_cost || quote.suppliesCost || 0),
    equipment_cost: Number(quote.equipment_cost || quote.equipmentCost || 0),
    subcontractor_cost: Number(quote.subcontractor_cost || quote.subcontractorCost || 0),
    subcontractorCost: Number(quote.subcontractorCost || quote.subcontractor_cost || 0),
    created_at: quote.created_at || quote.createdAt || new Date().toISOString(),
    createdAt: quote.createdAt || quote.created_at || new Date().toISOString(),
    updated_at: quote.updated_at || quote.updatedAt || new Date().toISOString(),
    updatedAt: quote.updatedAt || quote.updated_at || new Date().toISOString(),
    quote_number: quote.quote_number || quote.quoteNumber || '',
    quoteNumber: quote.quoteNumber || quote.quote_number || '',
    valid_until: quote.valid_until || quote.validUntil || '',
    validUntil: quote.validUntil || quote.valid_until || '',
    client_id: quote.client_id || quote.clientId || '',
    clientId: quote.clientId || quote.client_id || '',
    site_id: quote.site_id || quote.siteId || '',
    siteId: quote.siteId || quote.site_id || '',
    notes: quote.notes || '',
    frequency: quote.frequency || 'weekly',
    scope: quote.scope || '',
    terms: quote.terms || '',
    clientContact: quote.clientContact || '',
    clientEmail: quote.clientEmail || '',
    clientPhone: quote.clientPhone || '',
    siteAddress: quote.siteAddress || ''
  };

  // Adapt shifts if available
  if (quote.shifts && Array.isArray(quote.shifts)) {
    adaptedQuote.shifts = quote.shifts.map((shift: any) => adaptQuoteShift(shift));
  }

  // Adapt subcontractors if available
  if (quote.subcontractors && Array.isArray(quote.subcontractors)) {
    adaptedQuote.subcontractors = quote.subcontractors.map((sub: any) => adaptQuoteSubcontractor(sub));
  }

  return adaptedQuote;
}

/**
 * Adapt a quote status string to the QuoteStatus enum
 */
function adaptQuoteStatus(status: string): any {
  const validStatuses = ['draft', 'sent', 'approved', 'rejected', 'expired', 'pending', 'accepted'];
  return validStatuses.includes(status) ? status : 'draft';
}

/**
 * Adapt a shift object to the QuoteShift type
 */
function adaptQuoteShift(shift: any): QuoteShift {
  return {
    id: shift.id || crypto.randomUUID(),
    quoteId: shift.quoteId || shift.quote_id || '',
    day: adaptDay(shift.day || 'monday') as any,
    startTime: shift.startTime || shift.start_time || '09:00',
    endTime: shift.endTime || shift.end_time || '17:00',
    breakDuration: Number(shift.breakDuration || shift.break_duration || 30),
    numberOfCleaners: Number(shift.numberOfCleaners || shift.number_of_cleaners || 1),
    employmentType: (shift.employmentType || shift.employment_type || 'casual') as any,
    level: Number(shift.level || 1),
    allowances: Array.isArray(shift.allowances) ? shift.allowances : [],
    estimatedCost: Number(shift.estimatedCost || shift.estimated_cost || 0),
    location: shift.location || '',
    notes: shift.notes || ''
  };
}

/**
 * Adapt a subcontractor object to the QuoteSubcontractor type
 */
function adaptQuoteSubcontractor(sub: any): QuoteSubcontractor {
  return {
    id: sub.id || crypto.randomUUID(),
    quoteId: sub.quoteId || sub.quote_id || '',
    name: sub.name || sub.business_name || '',
    description: sub.description || sub.custom_services || '',
    cost: Number(sub.cost || sub.monthly_cost || 0),
    frequency: adaptFrequency(sub.frequency || 'monthly') as any,
    email: sub.email || '',
    phone: sub.phone || '',
    service: sub.service || '',
    notes: sub.notes || '',
    services: Array.isArray(sub.services) ? sub.services : [],
    customServices: sub.customServices || sub.custom_services || '',
    monthlyCost: Number(sub.monthlyCost || sub.monthly_cost || 0),
    monthly_cost: Number(sub.monthly_cost || sub.monthlyCost || 0),
    isFlatRate: Boolean(sub.isFlatRate || sub.is_flat_rate || true),
    is_flat_rate: Boolean(sub.is_flat_rate || sub.isFlatRate || true),
    business_name: sub.business_name || sub.name || '',
    contact_name: sub.contact_name || ''
  };
}
