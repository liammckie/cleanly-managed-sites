import { Day, EmploymentType, Frequency } from '@/types/common';

// Adapter for employment type conversion between database and frontend
export const dbToFrontendEmploymentType = (dbType: string): EmploymentType => {
  switch (dbType) {
    case 'casual':
      return 'casual';
    case 'part_time':
    case 'part-time':
      return 'part_time';
    case 'full_time':  
    case 'full-time':  
      return 'full_time';
    default:
      return 'casual'; // Default fallback
  }
};

// Adapter for employment type conversion between frontend and database
export const frontendToDbEmploymentType = (frontendType: EmploymentType): string => {
  switch (frontendType) {
    case 'casual':
      return 'casual';
    case 'part_time':
      return 'part_time';
    case 'full_time':
      return 'full_time';
    default:
      return 'casual'; // Default fallback
  }
};

// Adapter for day conversion
export const dbToFrontendDay = (dbDay: string): Day => {
  // Convert db day format to frontend enum format
  if (dbDay.toLowerCase() === 'public_holiday' || 
      dbDay.toLowerCase() === 'weekday' || 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(dbDay.toLowerCase())) {
    return dbDay.toLowerCase() as Day;
  }
  
  return 'monday'; // Default fallback
};

// Adapter for frequency conversion
export const dbToFrontendFrequency = (dbFrequency: string): Frequency => {
  const normalizedFrequency = dbFrequency.toLowerCase();
  
  if ([
    'weekly', 
    'fortnightly', 
    'monthly', 
    'quarterly', 
    'annually', 
    'once'
  ].includes(normalizedFrequency)) {
    return normalizedFrequency as Frequency;
  }
  
  return 'monthly'; // Default fallback
};

// Convert frontend quote model to database model
export const mapToDbQuote = (quoteData: any) => {
  return {
    name: quoteData.name,
    client_name: quoteData.clientName || quoteData.client_name,
    site_name: quoteData.siteName || quoteData.site_name,
    status: quoteData.status || 'draft',
    total_price: quoteData.totalPrice || quoteData.total_price || 0,
    labor_cost: quoteData.laborCost || quoteData.labor_cost || 0,
    overhead_percentage: quoteData.overheadPercentage || quoteData.overhead_percentage || 15,
    margin_percentage: quoteData.marginPercentage || quoteData.margin_percentage || 20,
    subcontractor_cost: quoteData.subcontractorCost || quoteData.subcontractor_cost || 0,
    overhead_cost: quoteData.overheadCost || quoteData.overhead_cost || 0,
    margin_amount: quoteData.marginAmount || quoteData.margin_amount || 0,
    total_cost: quoteData.totalCost || quoteData.total_cost || 0,
    start_date: quoteData.startDate || quoteData.start_date,
    end_date: quoteData.endDate || quoteData.end_date,
    expiry_date: quoteData.expiryDate || quoteData.expiry_date,
    notes: quoteData.notes,
    created_by: quoteData.created_by,
    user_id: quoteData.user_id,
    contract_length: quoteData.contractLength || quoteData.contract_length,
    contract_length_unit: quoteData.contractLengthUnit || quoteData.contract_length_unit,
  };
};

// Convert database quote model to frontend model
export const mapFromDbQuote = (dbQuote: any) => {
  if (!dbQuote) return null;
  
  return {
    id: dbQuote.id,
    name: dbQuote.name,
    clientName: dbQuote.client_name,
    siteName: dbQuote.site_name,
    status: dbQuote.status,
    totalPrice: dbQuote.total_price || 0,
    laborCost: dbQuote.labor_cost || 0,
    overheadPercentage: dbQuote.overhead_percentage || 15,
    marginPercentage: dbQuote.margin_percentage || 20,
    subcontractorCost: dbQuote.subcontractor_cost || 0,
    overheadCost: dbQuote.overhead_cost || 0,
    marginAmount: dbQuote.margin_amount || 0,
    totalCost: dbQuote.total_cost || 0,
    startDate: dbQuote.start_date,
    endDate: dbQuote.end_date,
    expiryDate: dbQuote.expiry_date,
    notes: dbQuote.notes,
    created_by: dbQuote.created_by,
    createdAt: dbQuote.created_at,
    updatedAt: dbQuote.updated_at,
    contractLength: dbQuote.contract_length,
    contractLengthUnit: dbQuote.contract_length_unit,
  };
};

// Convert database shift to frontend shift
export const mapDbShiftToFrontend = (dbShift: any) => {
  if (!dbShift) return null;
  
  return {
    id: dbShift.id,
    quoteId: dbShift.quote_id,
    day: dbToFrontendDay(dbShift.day),
    startTime: dbShift.start_time,
    endTime: dbShift.end_time,
    breakDuration: dbShift.break_duration,
    numberOfCleaners: dbShift.number_of_cleaners,
    employmentType: dbToFrontendEmploymentType(dbShift.employment_type),
    level: dbShift.level,
    allowances: dbShift.allowances || [],
    estimatedCost: dbShift.estimated_cost || 0,
    location: dbShift.location || '',
    notes: dbShift.notes || '',
  };
};

// Convert frontend shift to database shift
export const mapFrontendShiftToDb = (shift: any) => {
  return {
    quote_id: shift.quoteId || shift.quote_id,
    day: shift.day,
    start_time: shift.startTime || shift.start_time,
    end_time: shift.endTime || shift.end_time,
    break_duration: shift.breakDuration || shift.break_duration,
    number_of_cleaners: shift.numberOfCleaners || shift.number_of_cleaners,
    employment_type: frontendToDbEmploymentType(shift.employmentType || shift.employment_type),
    level: shift.level,
    allowances: shift.allowances || [],
    estimated_cost: shift.estimatedCost || shift.estimated_cost || 0,
    location: shift.location || '',
    notes: shift.notes || '',
  };
};
