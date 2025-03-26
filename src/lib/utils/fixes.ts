
/**
 * This file contains temporary type fixes and utility functions
 * to resolve TypeScript errors without major refactoring
 */

import { QuoteShift, QuoteSubcontractor } from '@/types/models';
import { Subcontractor } from '@/components/sites/forms/types/subcontractorTypes';
import { ContractHistoryEntry } from '@/components/sites/forms/types/contractTypes';

/**
 * Utility to add 'id' property to Partial<ContractHistoryEntry> objects
 * to make them compatible with ContractHistoryEntry[]
 */
export function ensureContractHistoryIds(entries: Partial<ContractHistoryEntry>[]): ContractHistoryEntry[] {
  return entries.map(entry => ({
    id: entry.id || crypto.randomUUID(),
    site_id: entry.site_id || '',
    contractor_id: (entry as any).contractor_id || '',
    contract_details: entry.contract_details || {},
    version_number: entry.version_number || 0,
    notes: entry.notes || '',
    created_by: entry.created_by || '',
    created_at: entry.created_at || new Date().toISOString()
  }));
}

/**
 * Utility to adapt Subcontractor array to QuoteSubcontractor array
 */
export function adaptSubcontractorsToQuoteFormat(subcontractors: Subcontractor[]): QuoteSubcontractor[] {
  return subcontractors.map(sub => ({
    id: sub.id || '',
    quoteId: sub.id || '', // Use sub.id as quoteId if not provided
    name: sub.business_name || '',
    description: sub.customServices || '',
    cost: typeof sub.monthly_cost === 'number' ? sub.monthly_cost : 0,
    frequency: 'monthly', // Default frequency
    email: sub.email || '',
    phone: sub.phone || '',
    notes: '',
    services: sub.services as string[] || []
  }));
}

/**
 * Utility to handle the mismatch between string enum types
 */
export function adaptFrequencyType(frequency: string): 'daily' | 'weekly' | 'monthly' {
  if (frequency === 'annually' || frequency === 'quarterly') {
    return 'monthly'; // Default to monthly for incompatible values
  }
  
  return frequency as 'daily' | 'weekly' | 'monthly';
}

/**
 * Utility to safely adapt object access for contract details
 */
export function safeContractDetailAccess<T>(details: any, property: string, defaultValue: T): T {
  if (!details) return defaultValue;
  return (details[property] as T) || defaultValue;
}

/**
 * Safely parse JSON contract details
 */
export function parseContractDetails(details: any): any {
  if (!details) return {};
  if (typeof details === 'string') {
    try {
      return JSON.parse(details);
    } catch (e) {
      return {};
    }
  }
  return details;
}
