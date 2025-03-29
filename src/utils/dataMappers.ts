
import { mapToDb, mapFromDb } from '@/lib/utils/mappers';
import { 
  BillingLine, 
  ContractDetails, 
  QuoteShift, 
  QuoteSubcontractor, 
  SystemUser 
} from '@/types/standardTypes';

/**
 * Utility for mapping contract details to/from database format
 */
export function mapContractDetailsToDb(contractDetails: Partial<ContractDetails> = {}): Record<string, any> {
  return mapToDb({
    id: contractDetails.id,
    contractNumber: contractDetails.contractNumber,
    startDate: contractDetails.startDate,
    endDate: contractDetails.endDate,
    autoRenewal: contractDetails.autoRenewal,
    renewalPeriod: contractDetails.renewalPeriod,
    renewalNoticeDays: contractDetails.renewalNoticeDays,
    terminationPeriod: contractDetails.terminationPeriod,
    billingCycle: contractDetails.billingCycle,
    serviceFrequency: contractDetails.serviceFrequency,
    serviceDeliveryMethod: contractDetails.serviceDeliveryMethod,
    contractType: contractDetails.contractType || contractDetails.type,
    value: contractDetails.value,
    annualValue: contractDetails.annualValue,
    notes: contractDetails.notes,
    status: contractDetails.status,
    terms: contractDetails.terms,
    reviewDate: contractDetails.reviewDate,
    noticePeriodDays: contractDetails.noticePeriodDays,
    nextIncreaseDate: contractDetails.nextIncreaseDate,
    specialTerms: contractDetails.specialTerms,
    terminationClause: contractDetails.terminationClause,
    renewalLengthMonths: contractDetails.renewalLengthMonths,
  });
}

/**
 * Map contract details from database format to frontend format
 */
export function mapContractDetailsFromDb(dbContractDetails: Record<string, any> = {}): Partial<ContractDetails> {
  return mapFromDb(dbContractDetails) as Partial<ContractDetails>;
}

/**
 * Map billing lines from frontend format to DB format
 */
export function mapBillingLinesToDb(billingLines: Partial<BillingLine>[] = []): any[] {
  if (!billingLines || !Array.isArray(billingLines)) return [];
  
  return billingLines.map(line => ({
    id: line.id,
    description: line.description,
    amount: line.amount,
    frequency: line.frequency,
    is_recurring: line.isRecurring || line.is_recurring,
    on_hold: line.onHold || line.on_hold,
    notes: line.notes,
    weekly_amount: line.weeklyAmount || line.weekly_amount,
    monthly_amount: line.monthlyAmount || line.monthly_amount,
    annual_amount: line.annualAmount || line.annual_amount
  }));
}

/**
 * Map billing lines from DB format to frontend format
 */
export function mapBillingLinesFromDb(dbLines: any[] = []): Partial<BillingLine>[] {
  if (!dbLines || !Array.isArray(dbLines)) return [];
  
  return dbLines.map(line => ({
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
 * Map user from DB format to frontend format
 */
export function mapUserFromDb(dbUser: any): SystemUser {
  if (!dbUser) return {} as SystemUser;
  
  return {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    fullName: dbUser.full_name || `${dbUser.first_name || ''} ${dbUser.last_name || ''}`.trim(),
    avatarUrl: dbUser.avatar_url,
    role: dbUser.role,
    roleId: dbUser.role_id,
    status: dbUser.status || 'active',
    lastLogin: dbUser.last_login,
    phone: dbUser.phone,
    title: dbUser.title,
    customId: dbUser.custom_id,
    territories: dbUser.territories,
    notes: dbUser.notes,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at
  } as SystemUser;
}

/**
 * Map quote shifts from DB format to frontend format
 */
export function mapQuoteShiftsFromDb(dbShifts: any[] = []): QuoteShift[] {
  if (!dbShifts || !Array.isArray(dbShifts)) return [];
  
  return dbShifts.map(shift => ({
    id: shift.id,
    quoteId: shift.quote_id,
    day: shift.day,
    startTime: shift.start_time,
    endTime: shift.end_time,
    breakDuration: shift.break_duration,
    numberOfCleaners: shift.number_of_cleaners,
    employmentType: shift.employment_type,
    level: shift.level,
    allowances: Array.isArray(shift.allowances) ? shift.allowances : [],
    estimatedCost: shift.estimated_cost,
    location: shift.location,
    notes: shift.notes
  }));
}

/**
 * Map quote shifts from frontend format to DB format
 */
export function mapQuoteShiftsToDb(shifts: QuoteShift[] = []): any[] {
  if (!shifts || !Array.isArray(shifts)) return [];
  
  return shifts.map(shift => ({
    id: shift.id,
    quote_id: shift.quoteId || shift.quote_id,
    day: shift.day,
    start_time: shift.startTime || shift.start_time,
    end_time: shift.endTime || shift.end_time,
    break_duration: shift.breakDuration || shift.break_duration,
    number_of_cleaners: shift.numberOfCleaners || shift.number_of_cleaners,
    employment_type: shift.employmentType || shift.employment_type,
    level: shift.level,
    allowances: shift.allowances,
    estimated_cost: shift.estimatedCost || shift.estimated_cost,
    location: shift.location,
    notes: shift.notes
  }));
}
