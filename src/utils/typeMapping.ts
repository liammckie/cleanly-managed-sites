
import { EmployeeLevel, QuoteStatus } from '@/types/common';

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
