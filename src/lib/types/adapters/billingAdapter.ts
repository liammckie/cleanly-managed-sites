
/**
 * Billing Type Adapter
 * Provides consistent mapping between frontend and database billing formats
 */
import { typeRegistry } from './typeRegistry';
import { Json } from '@/lib/types/common';
import { BillingDetails, BillingLine } from '@/lib/types/billingTypes';

// Define database billing line type
export interface DbBillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  is_recurring: boolean;
  on_hold: boolean;
  notes?: string;
  weekly_amount?: number;
  monthly_amount?: number;
  annual_amount?: number;
  hold_start_date?: string;
  hold_end_date?: string;
  credit_amount?: number;
  credit_date?: string;
  credit_reason?: string;
}

// Register billing line type mapping
typeRegistry.register<BillingLine, DbBillingLine>({
  name: 'BillingLine',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'description', database: 'description' },
    { frontend: 'amount', database: 'amount' },
    { frontend: 'frequency', database: 'frequency' },
    { frontend: 'isRecurring', database: 'is_recurring' },
    { frontend: 'onHold', database: 'on_hold' },
    { frontend: 'notes', database: 'notes' },
    { frontend: 'weeklyAmount', database: 'weekly_amount' },
    { frontend: 'monthlyAmount', database: 'monthly_amount' },
    { frontend: 'annualAmount', database: 'annual_amount' },
    { frontend: 'holdStartDate', database: 'hold_start_date' },
    { frontend: 'holdEndDate', database: 'hold_end_date' },
    { frontend: 'creditAmount', database: 'credit_amount' },
    { frontend: 'creditDate', database: 'credit_date' },
    { frontend: 'creditReason', database: 'credit_reason' }
  ]
});

// Register billing details type mapping
typeRegistry.register<BillingDetails, Json>({
  name: 'BillingDetails',
  fields: [
    { frontend: 'recipient', database: 'recipient' },
    { frontend: 'emailInvoiceTo', database: 'email_invoice_to' },
    { frontend: 'billingMethod', database: 'billing_method' },
    { frontend: 'billingCycle', database: 'billing_cycle' },
    { frontend: 'billingDay', database: 'billing_day' },
    { frontend: 'accountNumber', database: 'account_number' },
    { frontend: 'purchaseOrderRequired', database: 'purchase_order_required' },
    { frontend: 'purchaseOrderNumber', database: 'purchase_order_number' },
    { frontend: 'billingReference', database: 'billing_reference' },
    { frontend: 'notes', database: 'notes' },
    { frontend: 'totalWeeklyAmount', database: 'total_weekly_amount' },
    { frontend: 'totalMonthlyAmount', database: 'total_monthly_amount' },
    { frontend: 'totalAnnualAmount', database: 'total_annual_amount' },
    { 
      frontend: 'billingLines', 
      database: 'billing_lines',
      transform: (value, direction) => {
        if (direction === 'toDb' && Array.isArray(value)) {
          const billingLineAdapter = typeRegistry.createAdapter<BillingLine, DbBillingLine>('BillingLine');
          return value.map(line => billingLineAdapter.toDb(line));
        }
        return value;
      }
    }
  ]
});

// Create and export billing adapters
export const billingLineAdapter = typeRegistry.createAdapter<BillingLine, DbBillingLine>('BillingLine');
export const billingDetailsAdapter = typeRegistry.createAdapter<BillingDetails, Json>('BillingDetails');

// Export adapter functions directly for cleaner imports
export const adaptBillingLineToDb = billingLineAdapter.toDb;
export const adaptBillingLineFromDb = billingLineAdapter.fromDb;
export const adaptBillingLinesToDb = billingLineAdapter.manyToDb;
export const adaptBillingLinesFromDb = billingLineAdapter.manyFromDb;
export const adaptBillingDetailsToDb = billingDetailsAdapter.toDb;
export const adaptBillingDetailsFromDb = billingDetailsAdapter.fromDb;
