
/**
 * Contract term interface
 */
export interface ContractTerm {
  id: string;
  term: string;
  description?: string;
}

/**
 * Contract details interface
 */
export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalNoticeDays?: number;
  renewalPeriod?: string;
  renewalLengthMonths?: number;
  terminationPeriod?: string;
  terminationPeriodDays?: number;
  value?: number;
  valueType?: string;
  valueFrequency?: string;
  termsOfPayment?: string;
  billingCycle?: string;
  billingDay?: number;
  lastBillingDate?: string;
  nextBillingDate?: string;
  contractLength?: string;
  contractLengthMonths?: number;
  renewalTerms?: string;
  notes?: string;
  terms?: ContractTerm[];
}

/**
 * Contract interface
 */
export interface Contract {
  id: string;
  contractNumber: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
  renewalNoticeDays: number;
  terminationPeriod: string;
  value: number;
  valueType: string;
  valueFrequency: string;
  termsOfPayment: string;
  billingCycle: string;
  contractLength: string;
  renewalTerms: string;
  notes: string;
  terms: ContractTerm[];
}

/**
 * Contract data for front-end display
 */
export interface ContractData {
  id: string;
  contractNumber: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
  renewalNoticeDays: number;
  terminationPeriod: string;
  value: number;
  valueType: string;
  valueFrequency: string;
  termsOfPayment: string;
  billingCycle: string;
  contractLength: string;
  renewalTerms: string;
  notes: string;
  terms: ContractTerm[];
  site_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Convert database contract to frontend format
 */
export function adaptContractToFrontend(dbContract: any): Contract {
  return {
    id: dbContract.id,
    contractNumber: dbContract.contract_number || '',
    type: dbContract.contract_type || '',
    status: dbContract.status || 'active',
    startDate: dbContract.start_date || '',
    endDate: dbContract.end_date || '',
    autoRenewal: dbContract.auto_renew || false,
    renewalNoticeDays: dbContract.renewal_notice_days || 0,
    terminationPeriod: dbContract.termination_period || '',
    value: dbContract.value || 0,
    valueType: dbContract.value_type || '',
    valueFrequency: dbContract.value_frequency || '',
    termsOfPayment: dbContract.terms_of_payment || '',
    billingCycle: dbContract.billing_cycle || '',
    contractLength: dbContract.contract_length || '',
    renewalTerms: dbContract.renewal_terms || '',
    notes: dbContract.notes || '',
    terms: dbContract.terms || []
  };
}

/**
 * Convert frontend contract to database format
 */
export function adaptContractToDb(contract: Contract): any {
  return {
    id: contract.id,
    contract_number: contract.contractNumber,
    contract_type: contract.type,
    status: contract.status,
    start_date: contract.startDate,
    end_date: contract.endDate,
    auto_renew: contract.autoRenewal,
    renewal_notice_days: contract.renewalNoticeDays,
    termination_period: contract.terminationPeriod,
    value: contract.value,
    value_type: contract.valueType,
    value_frequency: contract.valueFrequency,
    terms_of_payment: contract.termsOfPayment,
    billing_cycle: contract.billingCycle,
    contract_length: contract.contractLength,
    renewal_terms: contract.renewalTerms,
    notes: contract.notes,
    terms: contract.terms
  };
}

/**
 * Convert contract details to database format
 */
export function adaptContractDetailsToDb(contractDetails: ContractDetails): any {
  return {
    id: contractDetails.id,
    contract_number: contractDetails.contractNumber,
    contract_type: contractDetails.type,
    status: contractDetails.status,
    start_date: contractDetails.startDate,
    end_date: contractDetails.endDate,
    auto_renew: contractDetails.autoRenewal,
    renewal_notice_days: contractDetails.renewalNoticeDays,
    renewal_period: contractDetails.renewalPeriod,
    renewal_length_months: contractDetails.renewalLengthMonths,
    termination_period: contractDetails.terminationPeriod,
    termination_period_days: contractDetails.terminationPeriodDays,
    value: contractDetails.value,
    value_type: contractDetails.valueType,
    value_frequency: contractDetails.valueFrequency,
    terms_of_payment: contractDetails.termsOfPayment,
    billing_cycle: contractDetails.billingCycle,
    billing_day: contractDetails.billingDay,
    last_billing_date: contractDetails.lastBillingDate,
    next_billing_date: contractDetails.nextBillingDate,
    contract_length: contractDetails.contractLength,
    contract_length_months: contractDetails.contractLengthMonths,
    renewal_terms: contractDetails.renewalTerms,
    notes: contractDetails.notes,
    terms: contractDetails.terms
  };
}

/**
 * Convert database contract details to frontend format
 */
export function adaptContractDetailsFromDb(dbContract: any): ContractDetails {
  return {
    id: dbContract.id,
    contractNumber: dbContract.contract_number || '',
    type: dbContract.contract_type || '',
    status: dbContract.status || 'active',
    startDate: dbContract.start_date || '',
    endDate: dbContract.end_date || '',
    autoRenewal: dbContract.auto_renew || false,
    renewalNoticeDays: dbContract.renewal_notice_days || 0,
    renewalPeriod: dbContract.renewal_period || '',
    renewalLengthMonths: dbContract.renewal_length_months || 0,
    terminationPeriod: dbContract.termination_period || '',
    terminationPeriodDays: dbContract.termination_period_days || 0,
    value: dbContract.value || 0,
    valueType: dbContract.value_type || '',
    valueFrequency: dbContract.value_frequency || '',
    termsOfPayment: dbContract.terms_of_payment || '',
    billingCycle: dbContract.billing_cycle || '',
    billingDay: dbContract.billing_day || 1,
    lastBillingDate: dbContract.last_billing_date || '',
    nextBillingDate: dbContract.next_billing_date || '',
    contractLength: dbContract.contract_length || '',
    contractLengthMonths: dbContract.contract_length_months || 0,
    renewalTerms: dbContract.renewal_terms || '',
    notes: dbContract.notes || '',
    terms: dbContract.terms || []
  };
}
