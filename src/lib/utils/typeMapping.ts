
import type { EmploymentType } from '@/types/common';

export const employmentTypeMapping: Record<EmploymentType, string> = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  casual: 'Casual',
  contract: 'Contract',
  intern: 'Intern'
};
