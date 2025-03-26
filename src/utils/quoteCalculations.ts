
/**
 * Calculate the total cost for quotes
 */
export function calculateTotalCosts(laborCost: number, subcontractorCost: number, suppliesCost: number = 0, equipmentCost: number = 0, overheadPercentage: number = 15) {
  const overheadCost = (laborCost * overheadPercentage) / 100;
  const totalCost = laborCost + subcontractorCost + suppliesCost + equipmentCost + overheadCost;
  
  return {
    laborCost,
    subcontractorCost,
    suppliesCost,
    equipmentCost,
    overheadCost,
    totalCost
  };
}

/**
 * Calculate the totals including profit margin
 */
export function calculateWithMargin(totalCost: number, marginPercentage: number = 20) {
  const marginAmount = (totalCost * marginPercentage) / 100;
  const totalPrice = totalCost + marginAmount;
  
  return {
    marginAmount,
    totalPrice
  };
}

/**
 * Helper function to convert frequency to annual factor
 */
export function getAnnualFactor(frequency: string): number {
  switch (frequency.toLowerCase()) {
    case 'daily':
      return 260; // 5 days a week * 52 weeks
    case 'weekly':
      return 52;
    case 'fortnightly':
      return 26;
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'annually':
    case 'yearly':
      return 1;
    case 'once':
    case 'one-time':
      return 1;
    default:
      return 1;
  }
}

/**
 * Convert an amount to an annual amount based on frequency
 */
export function getAnnualAmount(amount: number, frequency: string): number {
  return amount * getAnnualFactor(frequency);
}

/**
 * Converting quote data between camelCase and snake_case
 */
export function convertQuoteToSnakeCase(quote: any) {
  return {
    ...quote,
    client_name: quote.clientName,
    site_name: quote.siteName,
    overhead_percentage: quote.overheadPercentage,
    margin_percentage: quote.marginPercentage,
    labor_cost: quote.laborCost,
    total_price: quote.totalPrice,
    subcontractor_cost: quote.subcontractorCost,
    overhead_cost: quote.overheadCost,
    total_cost: quote.totalCost,
    margin_amount: quote.marginAmount,
    supplies_cost: quote.suppliesCost,
    equipment_cost: quote.equipmentCost,
    quote_number: quote.quoteNumber,
    valid_until: quote.validUntil,
    client_id: quote.clientId,
    site_id: quote.siteId,
    client_contact: quote.clientContact,
    client_email: quote.clientEmail,
    client_phone: quote.clientPhone,
    site_address: quote.siteAddress,
    start_date: quote.startDate,
    end_date: quote.endDate,
    expiry_date: quote.expiryDate,
    contract_length: quote.contractLength,
    contract_length_unit: quote.contractLengthUnit,
    created_by: quote.createdBy
  };
}

export function convertQuoteToCamelCase(quote: any) {
  return {
    ...quote,
    clientName: quote.client_name,
    siteName: quote.site_name,
    overheadPercentage: quote.overhead_percentage,
    marginPercentage: quote.margin_percentage,
    laborCost: quote.labor_cost,
    totalPrice: quote.total_price,
    subcontractorCost: quote.subcontractor_cost,
    overheadCost: quote.overhead_cost,
    totalCost: quote.total_cost,
    marginAmount: quote.margin_amount,
    suppliesCost: quote.supplies_cost,
    equipmentCost: quote.equipment_cost,
    quoteNumber: quote.quote_number,
    validUntil: quote.valid_until,
    clientId: quote.client_id,
    siteId: quote.site_id,
    clientContact: quote.client_contact,
    clientEmail: quote.client_email,
    clientPhone: quote.client_phone,
    siteAddress: quote.site_address,
    startDate: quote.start_date,
    endDate: quote.end_date,
    expiryDate: quote.expiry_date,
    contractLength: quote.contract_length,
    contractLengthUnit: quote.contract_length_unit,
    createdBy: quote.created_by
  };
}
