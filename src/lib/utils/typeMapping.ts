
import type { EmployeeLevel, EmploymentType, QuoteStatus } from '@/types/common';

export const employmentTypeMapping: Record<EmploymentType, string> = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  casual: 'Casual',
  contract: 'Contract',
  intern: 'Intern'
};

/**
 * Validates and returns a valid EmployeeLevel (1-4)
 * Returns 1 as default if the input is invalid
 */
export function validateEmployeeLevel(level: number): EmployeeLevel {
  if (level >= 1 && level <= 4) {
    return level as EmployeeLevel;
  }
  return 1;
}

export function apiToQuoteStatus(status: string): QuoteStatus {
  switch (status) {
    case 'draft': return 'draft';
    case 'sent': return 'sent';
    case 'accepted': return 'accepted';
    case 'rejected': return 'rejected';
    case 'expired': return 'expired';
    case 'in_progress': return 'in-progress';
    case 'completed': return 'completed';
    default: return 'draft';
  }
}

export function quoteStatusToApi(status: QuoteStatus): string {
  switch (status) {
    case 'in-progress': return 'in_progress';
    default: return status;
  }
}
