
/**
 * Billing Type Adapter
 * Provides consistent mapping between frontend and database billing formats
 */
import { typeRegistry } from './typeRegistry';
import { BillingDetails, BillingLine } from '@/lib/types/billingTypes';
import { Json } from '@/lib/types/common';

// Register billing details type mapping
typeRegistry.register<BillingDetails, Json>({
  name: 'BillingDetails',
  fields: [
    { frontend: 'cycle', database: 'cycle' },
    { frontend: 'method', database: 'method' },
    { frontend: 'notes', database: 'notes' },
    { frontend: 'contact', database: 'contact' },
    { frontend: 'email', database: 'email' },
    { frontend: 'phone', database: 'phone' },
    { frontend: 'poRequired', database: 'po_required' },
    { frontend: 'onHold', database: 'on_hold' },
    { frontend: 'holdStartDate', database: 'hold_start_date' },
    { frontend: 'holdEndDate', database: 'hold_end_date' },
    { 
      frontend: 'billingLines', 
      database: 'billing_lines',
      transform: (value, direction) => {
        if (direction === 'toDb' && Array.isArray(value)) {
          return value.map(line => billingLineAdapter.toDb(line));
        } else if (direction === 'fromDb' && Array.isArray(value)) {
          return value.map(line => billingLineAdapter.fromDb(line));
        }
        return value;
      }
    }
  ]
});

// Register billing line type mapping
typeRegistry.register<BillingLine, any>({
  name: 'BillingLine',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'description', database: 'description' },
    { frontend: 'amount', database: 'amount' },
    { frontend: 'frequency', database: 'frequency' },
    { frontend: 'isRecurring', database: 'is_recurring' },
    { frontend: 'onHold', database: 'on_hold' },
    { frontend: 'weeklyAmount', database: 'weekly_amount' },
    { frontend: 'monthlyAmount', database: 'monthly_amount' },
    { frontend: 'annualAmount', database: 'annual_amount' }
  ]
});

// Create and export billing adapters
export const billingDetailsAdapter = typeRegistry.createAdapter<BillingDetails, Json>('BillingDetails');
export const billingLineAdapter = typeRegistry.createAdapter<BillingLine, any>('BillingLine');

// Export adapter functions directly for cleaner imports
export const adaptBillingDetailsToDb = billingDetailsAdapter.toDb;
export const adaptBillingDetailsFromDb = billingDetailsAdapter.fromDb;
export const adaptBillingLinesToDb = (lines: BillingLine[]): any[] => {
  if (!lines || !Array.isArray(lines)) return [];
  return lines.map(line => billingLineAdapter.toDb(line));
};
export const adaptBillingLinesFromDb = (dbLines: any[]): BillingLine[] => {
  if (!dbLines || !Array.isArray(dbLines)) return [];
  return dbLines.map(line => billingLineAdapter.fromDb(line) as BillingLine);
};
