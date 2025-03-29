
/**
 * Type mapping utilities for translating between different representations of the same data
 */
import { EmploymentType, QuoteStatus } from '@/types/common';

/**
 * Maps internal employment type values to external API values
 */
export const employmentTypeToApi: Record<EmploymentType, string> = {
  'full-time': 'full-time',
  'part-time': 'part-time',
  'casual': 'casual',
  'contract': 'contract',
  'intern': 'intern'
};

/**
 * Maps API employment type values to internal values
 */
export const apiToEmploymentType = (apiValue: string): EmploymentType => {
  switch (apiValue) {
    case 'full_time':
    case 'full-time':
      return 'full-time';
    case 'part_time':
    case 'part-time':
      return 'part-time';
    case 'casual':
      return 'casual';
    case 'contract':
      return 'contract';
    case 'intern':
      return 'intern';
    default:
      return 'casual'; // Default value
  }
};

/**
 * Validates if the provided level is a valid employee level
 */
export const validateEmployeeLevel = (level: number): boolean => {
  return level >= 1 && level <= 5;
};

/**
 * Maps internal quote status values to API values
 */
export const quoteStatusToApi: Record<QuoteStatus, string> = {
  'draft': 'draft',
  'submitted': 'submitted',
  'pending': 'pending',
  'approved': 'approved',
  'declined': 'declined',
  'expired': 'expired',
  'accepted': 'accepted',
  'sent': 'sent',
  'rejected': 'rejected'
};

/**
 * Maps API quote status values to internal values
 */
export const apiToQuoteStatus = (apiValue: string): QuoteStatus => {
  const validStatuses: Record<string, QuoteStatus> = {
    'draft': 'draft',
    'submitted': 'submitted',
    'pending': 'pending',
    'approved': 'approved',
    'declined': 'declined',
    'expired': 'expired',
    'rejected': 'rejected',
    'sent': 'sent',
    'accepted': 'accepted'
  };
  
  return validStatuses[apiValue] || 'draft';
};
