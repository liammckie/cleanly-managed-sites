
import { EmploymentType } from '@/types/common';

// Define the DB and frontend types for OverheadProfile
export interface DbOverheadProfile {
  id: string;
  name: string;
  description?: string;
  labor_percentage: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface OverheadProfile {
  id: string;
  name: string;
  description?: string;
  laborPercentage: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

// Type definitions for contract related operations
export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  contractLength?: number;
  contractLengthUnit?: string;
  contractType?: string;
  renewalPeriod?: string;
  renewalNoticeDays?: number;
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  value?: number;
  billingCycle?: string;
  notes?: string;
}

// BillingLine interface for consistent usage
export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  isRecurring: boolean;
  onHold: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
}

// Type adapters to convert database models to frontend models and vice versa
export function dbToOverheadProfile(dbProfile: DbOverheadProfile): OverheadProfile {
  return {
    id: dbProfile.id,
    name: dbProfile.name,
    description: dbProfile.description,
    laborPercentage: dbProfile.labor_percentage,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
    userId: dbProfile.user_id
  };
}

export function overheadProfileToDb(profile: OverheadProfile): DbOverheadProfile {
  return {
    id: profile.id,
    name: profile.name,
    description: profile.description,
    labor_percentage: profile.laborPercentage,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
    user_id: profile.userId
  };
}

// Convert employment type format
export function adaptEmploymentType(dbType: string): EmploymentType {
  const mapping: Record<string, EmploymentType> = {
    'full_time': 'full-time',
    'part_time': 'part-time',
    'casual': 'casual',
    'contract': 'contract',
    'intern': 'intern'
  };
  
  return (mapping[dbType] || dbType) as EmploymentType;
}

// UserRole adapters
export function adaptUserRole(dbRole: any): Record<string, boolean> {
  if (typeof dbRole.permissions === 'object' && dbRole.permissions !== null) {
    return dbRole.permissions as Record<string, boolean>;
  }
  
  // If permissions is a string (JSON), try to parse it
  if (typeof dbRole.permissions === 'string') {
    try {
      return JSON.parse(dbRole.permissions);
    } catch (e) {
      console.error('Failed to parse permissions string', e);
      return {};
    }
  }
  
  return {};
}

// Contract adapters
export function adaptContractDetailsToJson(details: ContractDetails): { [key: string]: any } {
  return {
    ...details,
    // Convert any specific fields if needed
  };
}

export function adaptContractDetailsToApi(details: ContractDetails): { [key: string]: any } {
  return {
    ...details,
    // Make sure to format dates or other fields as needed for the API
  };
}

// BillingLine adapter
export function adaptBillingLine(modelLine: any): BillingLine {
  // Ensure modelLine has the required properties or set defaults
  const formattedLine: BillingLine = {
    id: modelLine.id || crypto.randomUUID(),
    description: modelLine.description || '',
    amount: modelLine.amount || 0,
    frequency: modelLine.frequency === 'weekly' || modelLine.frequency === 'monthly' || 
               modelLine.frequency === 'quarterly' || modelLine.frequency === 'annually' ? 
               modelLine.frequency : 'monthly',
    isRecurring: modelLine.isRecurring !== undefined ? modelLine.isRecurring : true,
    onHold: modelLine.onHold !== undefined ? modelLine.onHold : false,
    weeklyAmount: modelLine.weeklyAmount,
    monthlyAmount: modelLine.monthlyAmount,
    annualAmount: modelLine.annualAmount
  };
  
  return formattedLine;
}
