
import { Day, EmploymentType, Frequency } from '@/types/common';

// Adapter for employment type conversion between database and frontend
export const dbToFrontendEmploymentType = (dbType: string): EmploymentType => {
  switch (dbType) {
    case 'casual':
      return 'casual';
    case 'part_time':
    case 'part-time':
      return 'part-time';
    case 'full_time':  
    case 'full-time':  
      return 'full-time';
    default:
      return 'casual'; // Default fallback
  }
};

// Adapter for employment type conversion between frontend and database
export const frontendToDbEmploymentType = (frontendType: EmploymentType): string => {
  switch (frontendType) {
    case 'casual':
      return 'casual';
    case 'part-time':
      return 'part_time';
    case 'full-time':
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
    'one-time'
  ].includes(normalizedFrequency)) {
    return normalizedFrequency as Frequency;
  }
  
  return 'monthly'; // Default fallback
};
