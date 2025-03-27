
/**
 * Type Mapping Utility
 * 
 * This file serves as a central reference for type mappings and conversions
 * across the application to ensure consistency between front-end and API types.
 */

import { QuoteStatus, SiteStatus, EmploymentType, EmployeeLevel, UserStatus } from '@/types/common';

// Map frontend employment types to database employment types
export const employmentTypeMap: Record<EmploymentType, string> = {
  'full-time': 'full_time',
  'part-time': 'part_time',
  'casual': 'casual',
  'contract': 'contract',
  'intern': 'intern'
};

// Map database employment types to frontend employment types
export const dbToFrontendEmploymentType = (dbType: string): EmploymentType => {
  if (dbType === 'full_time' || dbType === 'full-time') return 'full-time';
  if (dbType === 'part_time' || dbType === 'part-time') return 'part-time';
  if (dbType === 'casual') return 'casual';
  if (dbType === 'contract') return 'contract';
  if (dbType === 'intern') return 'intern';
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
export const quoteStatusMap: Record<string, string> = {
  'draft': 'draft',
  'pending': 'pending',
  'sent': 'sent',
  'approved': 'approved',
  'accepted': 'accepted',
  'rejected': 'rejected',
  'expired': 'expired',
  'submitted': 'submitted',
  'declined': 'declined'
};

// Ensure site status is valid
export const validateSiteStatus = (status: string): SiteStatus => {
  const validStatuses: SiteStatus[] = ['active', 'pending', 'inactive', 'on-hold', 'lost'];
  if (validStatuses.includes(status as SiteStatus)) {
    return status as SiteStatus;
  }
  return 'active'; // Default to active if invalid
};

// Ensure user status is valid
export const validateUserStatus = (status: string): UserStatus => {
  if (['active', 'pending', 'inactive'].includes(status)) {
    return status as UserStatus;
  }
  return 'active'; // Default to active if invalid
};

// Frontend to database field mapping for quotes
export const quoteFieldMapping: Record<string, string> = {
  'userId': 'user_id',
  'overheadProfile': 'overhead_profile',
  'created_by': 'created_by'
};

// Database to frontend field mapping for quotes
export const dbToFrontendQuoteField: Record<string, string> = {
  'user_id': 'userId',
  'overhead_profile': 'overheadProfile',
  'created_by': 'created_by'
};
