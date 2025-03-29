
import { EmploymentType } from '@/types/common';

export function mapEmploymentType(type: string): EmploymentType {
  switch (type.toLowerCase()) {
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
      return 'casual'; // Default fallback
  }
}

// Map employment type to database format
export const employmentTypeToDatabaseFormat: Record<EmploymentType, string> = {
  'full-time': 'full_time',
  'part-time': 'part_time',
  'casual': 'casual',
  'contract': 'contract',
  'intern': 'intern'
};
