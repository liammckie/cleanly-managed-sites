
import { Day, QuoteStatus, EmployeeLevel, EmploymentType, Frequency } from '@/types/common';

// Convert string status to QuoteStatus enum
export function toQuoteStatus(status: string): QuoteStatus {
  switch (status) {
    case 'draft':
    case 'sent':
    case 'approved':
    case 'rejected':
    case 'expired':
    case 'pending':
    case 'accepted':
      return status as QuoteStatus;
    default:
      return 'draft';
  }
}

// Convert string day to Day enum
export function toDay(day: string): Day {
  switch (day) {
    case 'monday':
    case 'tuesday':
    case 'wednesday':
    case 'thursday':
    case 'friday':
    case 'saturday':
    case 'sunday':
      return day as Day;
    default:
      return 'monday';
  }
}

// Convert string employment type to EmploymentType enum
export function toEmploymentType(type: string): EmploymentType {
  switch (type) {
    case 'part_time':
    case 'full_time':
    case 'casual':
    case 'contractor':
      return type as EmploymentType;
    case 'partTime':
      return 'part_time';
    case 'fullTime':
      return 'full_time';
    default:
      return 'casual';
  }
}

// Convert string employee level to EmployeeLevel enum
export function toEmployeeLevel(level: string | number): EmployeeLevel {
  if (typeof level === 'number') {
    if (level >= 1 && level <= 5) {
      return level as EmployeeLevel;
    }
    return 1;
  }
  
  // If it's a string, try parsing as number
  const numLevel = parseInt(level, 10);
  if (!isNaN(numLevel) && numLevel >= 1 && numLevel <= 5) {
    return numLevel as EmployeeLevel;
  }
  
  return 1;
}

// Convert string frequency to Frequency enum
export function toFrequency(frequency: string): Frequency {
  switch (frequency) {
    case 'daily':
    case 'weekly':
    case 'fortnightly':
    case 'monthly':
    case 'quarterly':
    case 'yearly':
    case 'once':
      return frequency as Frequency;
    default:
      return 'monthly';
  }
}

// Convert contract length unit string to accepted values
export function toContractLengthUnit(unit: string): 'days' | 'weeks' | 'months' | 'years' {
  switch (unit) {
    case 'days':
    case 'weeks':
    case 'months':
    case 'years':
      return unit as 'days' | 'weeks' | 'months' | 'years';
    default:
      return 'months';
  }
}
