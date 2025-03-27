
/**
 * Type Mapping Utility
 * 
 * This file serves as a central reference for type mappings and conversions
 * across the application to ensure consistency between front-end and API types.
 */

import { QuoteStatus, SiteStatus, EmploymentType, EmployeeLevel } from '@/types/common';

// Map frontend employment types to database employment types
export const employmentTypeMap: Record<string, EmploymentType> = {
  'full-time': 'full_time',
  'part-time': 'part_time',
  'casual': 'casual'
};

// Map database employment types to frontend employment types
export const dbToFrontendEmploymentType = (dbType: string): EmploymentType => {
  if (dbType === 'full_time' || dbType === 'full-time') return 'full_time';
  if (dbType === 'part_time' || dbType === 'part-time') return 'part_time';
  if (dbType === 'casual') return 'casual';
  // Default to casual if unknown type
  return 'casual';
};

// Employee level validation
export const validateEmployeeLevel = (level: number): EmployeeLevel => {
  if (level >= 1 && level <= 5) {
    return level as EmployeeLevel;
  }
  return 1; // Default to level 1 if invalid
};

// Map frontend quote status to database quote status
export const quoteStatusMap: Record<string, QuoteStatus> = {
  'draft': 'draft',
  'pending': 'pending',
  'sent': 'sent',
  'approved': 'approved',
  'accepted': 'accepted',
  'rejected': 'rejected',
  'expired': 'expired'
};

// Ensure site status is valid
export const validateSiteStatus = (status: string): SiteStatus => {
  if (['active', 'pending', 'inactive', 'on-hold', 'lost'].includes(status)) {
    return status as SiteStatus;
  }
  return 'active'; // Default to active if invalid
};
