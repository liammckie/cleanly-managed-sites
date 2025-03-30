
/**
 * Contract Type Adapter
 * Provides consistent mapping between frontend and database contract formats
 */
import { typeRegistry } from './typeRegistry';
import { Contract, DbContract, ContractDetails } from '@/lib/types/contracts';
import { Json } from '@/lib/types/common';

// Register contract type mapping
typeRegistry.register<Contract, DbContract>({
  name: 'Contract',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'siteId', database: 'site_id' },
    { frontend: 'clientId', database: 'client_id' },
    { frontend: 'contractNumber', database: 'contract_number' },
    { frontend: 'startDate', database: 'start_date' },
    { frontend: 'endDate', database: 'end_date' },
    { frontend: 'value', database: 'value' },
    { frontend: 'monthlyValue', database: 'monthly_value' },
    { frontend: 'monthlyRevenue', database: 'monthly_revenue' },
    { frontend: 'status', database: 'status' },
    { frontend: 'autoRenewal', database: 'auto_renewal' },
    { frontend: 'renewalPeriod', database: 'renewal_period' },
    { frontend: 'renewalNoticeDays', database: 'renewal_notice_days' },
    { frontend: 'terminationPeriod', database: 'termination_period' },
    { frontend: 'billingCycle', database: 'billing_cycle' },
    { frontend: 'serviceFrequency', database: 'service_frequency' },
    { frontend: 'serviceDeliveryMethod', database: 'service_delivery_method' },
    { frontend: 'isPrimary', database: 'is_primary' },
    { frontend: 'createdAt', database: 'created_at' },
    { frontend: 'updatedAt', database: 'updated_at' },
    { 
      frontend: 'contractDetails', 
      database: 'contract_details',
      transform: (value, direction) => {
        // Handle JSON serialization for contract details
        if (direction === 'toDb') {
          return value as Json;
        }
        return value;
      }
    }
  ]
});

// Register contract details type mapping
typeRegistry.register<ContractDetails, Json>({
  name: 'ContractDetails',
  fields: [
    { frontend: 'id', database: 'id' },
    { frontend: 'contractNumber', database: 'contract_number' },
    { frontend: 'startDate', database: 'start_date' },
    { frontend: 'endDate', database: 'end_date' },
    { frontend: 'autoRenewal', database: 'auto_renewal' },
    { frontend: 'renewalPeriod', database: 'renewal_period' },
    { frontend: 'renewalNoticeDays', database: 'renewal_notice_days' },
    { frontend: 'terminationPeriod', database: 'termination_period' },
    { frontend: 'value', database: 'value' },
    { frontend: 'monthlyValue', database: 'monthly_value' },
    { frontend: 'annualValue', database: 'annual_value' },
    { frontend: 'billingCycle', database: 'billing_cycle' },
    { frontend: 'serviceFrequency', database: 'service_frequency' },
    { frontend: 'serviceDeliveryMethod', database: 'service_delivery_method' },
    { frontend: 'contractType', database: 'contract_type' },
    { frontend: 'contractLength', database: 'contract_length' },
    { frontend: 'contractLengthUnit', database: 'contract_length_unit' },
    { frontend: 'noticeUnit', database: 'notice_unit' },
    { frontend: 'notes', database: 'notes' },
    { frontend: 'type', database: 'type' },
    { frontend: 'status', database: 'status' },
    { frontend: 'renewalTerms', database: 'renewal_terms' },
    { 
      frontend: 'terms', 
      database: 'terms',
      transform: (value, direction) => {
        if (direction === 'toDb' && Array.isArray(value)) {
          // Ensure each term is properly serialized
          return value.map(term => ({
            id: term.id,
            name: term.name,
            description: term.description,
            start_date: term.startDate,
            end_date: term.endDate,
            renewal_terms: term.renewalTerms,
            termination_period: term.terminationPeriod,
            auto_renew: term.autoRenew,
            value: term.value,
            type: term.type
          }));
        }
        return value;
      }
    }
  ]
});

// Create and export contract adapters
export const contractAdapter = typeRegistry.createAdapter<Contract, DbContract>('Contract');
export const contractDetailsAdapter = typeRegistry.createAdapter<ContractDetails, Json>('ContractDetails');

// Export adapter functions directly for cleaner imports
export const adaptContractToDb = contractAdapter.toDb;
export const adaptContractFromDb = contractAdapter.fromDb;
export const adaptContractDetailsToDb = contractDetailsAdapter.toDb;
export const adaptContractDetailsFromDb = contractDetailsAdapter.fromDb;

// Special case adapter for contract details as JSON
export function adaptContractDetailsToJson(details: ContractDetails | null | undefined): Json {
  if (!details) return null as unknown as Json;
  
  // Use the adapter to get the database representation
  const dbValue = adaptContractDetailsToDb(details);
  
  // If needed, perform any additional JSON-specific formatting
  // Convert to literal JSON if required by API constraints
  return dbValue;
}
