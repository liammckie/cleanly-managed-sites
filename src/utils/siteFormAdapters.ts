
import { mapToDb, mapFromDb } from '@/lib/mappers';

/**
 * Adapt billing lines from DB format to frontend format
 */
export function adaptBillingLines(lines: any[] = []) {
  if (!lines || !Array.isArray(lines)) return [];
  
  return lines.map(line => ({
    id: line.id,
    description: line.description,
    amount: line.amount,
    frequency: line.frequency,
    isRecurring: line.is_recurring,
    onHold: line.on_hold,
    notes: line.notes,
    weeklyAmount: line.weekly_amount,
    monthlyAmount: line.monthly_amount,
    annualAmount: line.annual_amount
  }));
}

/**
 * Adapt billing lines from frontend format to DB format
 */
export function adaptBillingLinesToDb(lines: any[] = []) {
  if (!lines || !Array.isArray(lines)) return [];
  
  return lines.map(line => ({
    id: line.id,
    description: line.description,
    amount: line.amount,
    frequency: line.frequency,
    is_recurring: line.isRecurring,
    on_hold: line.onHold,
    notes: line.notes,
    weekly_amount: line.weeklyAmount,
    monthly_amount: line.monthlyAmount,
    annual_amount: line.annualAmount
  }));
}

/**
 * Adapt site form data from frontend to DB format
 */
export function adaptSiteFormToDb(formData: any) {
  const dbData = {
    id: formData.id,
    name: formData.name,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postcode: formData.postalCode || formData.postcode,
    country: formData.country,
    client_id: formData.client_id || formData.clientId,
    client_name: formData.client_name,
    status: formData.status,
    email: formData.email,
    phone: formData.phone,
    custom_id: formData.customId,
    contract_details: mapToDb(formData.contractDetails || formData.contract_details || {}),
    billing_details: mapToDb(formData.billingDetails || {}),
    job_specifications: mapToDb(formData.jobSpecifications || {}),
    security_details: mapToDb(formData.securityDetails || {}),
    periodicals: mapToDb(formData.periodicals || {}),
    ad_hoc_work_authorization: mapToDb(formData.adHocWorkAuthorization || {}),
    notes: formData.notes,
    weekly_revenue: formData.weeklyRevenue,
    monthly_revenue: formData.monthlyRevenue,
    annual_revenue: formData.annualRevenue,
    monthly_cost: formData.monthlyCost,
  };
  
  return dbData;
}
