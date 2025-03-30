import { 
  adaptBillingLinesToDb, 
  adaptBillingLinesFromDb, 
  adaptContractDetailsToDb, 
  adaptContractDetailsFromDb 
} from '@/lib/types/adapters';
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
  return adaptContractDetailsToDb(contractDetails as ContractDetails);
}

/**
 * Map contract details from database format to frontend format
 */
export function mapContractDetailsFromDb(dbContractDetails: Record<string, any> = {}): Partial<ContractDetails> {
  return adaptContractDetailsFromDb(dbContractDetails);
}

/**
 * Map billing lines from frontend format to DB format
 */
export function mapBillingLinesToDb(billingLines: Partial<BillingLine>[] = []): any[] {
  return adaptBillingLinesToDb(billingLines as BillingLine[]);
}

/**
 * Map billing lines from DB format to frontend format
 */
export function mapBillingLinesFromDb(dbLines: any[] = []): Partial<BillingLine>[] {
  return adaptBillingLinesFromDb(dbLines);
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
